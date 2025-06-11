const mongoose = require('mongoose');

/**
 * CART MODEL DOCUMENTATION FOR JUNIOR DEVELOPERS
 * =============================================
 * 
 * This model represents a shopping cart in our mushroom e-commerce store.
 * 
 * KEY CONCEPTS:
 * - Uses sessionId instead of userId to support guest checkout
 * - Automatically calculates totals using Mongoose pre-save middleware
 * - Implements TTL (Time To Live) for automatic cleanup of old carts
 * - References Product model for data consistency
 * 
 * BUSINESS RULES:
 * - Products must be between $10-$1000 (premium mushroom pricing)
 * - Free shipping on orders over $50
 * - 8% tax rate (configurable via environment variables)
 * - Maximum 10 items per product (prevents inventory issues)
 * - Maximum 50 total items per cart (performance consideration)
 * - Carts auto-delete after 7 days of inactivity
 */

// Configuration constants - move to environment variables in production
const CART_CONFIG = {
    TAX_RATE: process.env.TAX_RATE || 0.08,
    FREE_SHIPPING_THRESHOLD: process.env.FREE_SHIPPING_THRESHOLD || 50,
    SHIPPING_COST: process.env.SHIPPING_COST || 9.99,
    MAX_QUANTITY_PER_ITEM: 10,
    MAX_TOTAL_ITEMS: 50,
    CART_TTL_DAYS: 7
};

const cartSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
        // Remove 'index: true' here since we declare it separately below
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'Product name too long']
        },
        price: {
            type: Number, // Fixed: was 'float' which isn't a valid Mongoose type
            required: true,
            min: [10.00, 'Minimum price is $10.00'],
            max: [1000.00, 'Maximum price is $1000.00'],
            validate: {
                validator: function (v) {
                    // Ensure price has at most 2 decimal places
                    return /^\d+(\.\d{1,2})?$/.test(v.toString());
                },
                message: 'Price must have at most 2 decimal places'
            }
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Minimum quantity is 1'],
            max: [CART_CONFIG.MAX_QUANTITY_PER_ITEM, `Maximum quantity per item is ${CART_CONFIG.MAX_QUANTITY_PER_ITEM}`],
            default: 1,
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be a whole number'
            }
        },
        size: {
            type: String,
            enum: ['small', 'standard', 'large', 'bulk'],
            default: 'standard'
        },
        image: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    // Basic URL validation for image paths
                    return /^(https?:\/\/|\/|data:image\/)/.test(v);
                },
                message: 'Invalid image URL format'
            }
        }
    }],
    subtotal: {
        type: Number, // Fixed: was 'Float' which isn't valid
        default: 0.00,
        min: [0.00, 'Subtotal cannot be negative']
    },
    tax: {
        type: Number, // Fixed: was 'float' which isn't valid
        default: 0,
        min: [0, 'Tax cannot be negative']
    },
    shipping: {
        type: Number,
        default: 0,
        min: [0, 'Shipping cost cannot be negative']
    },
    total: {
        type: Number,
        default: 0,
        min: [0, 'Total cannot be negative']
    },
    status: {
        type: String,
        enum: ['active', 'abandoned', 'converted'],
        default: 'active'
    }
}, {
    timestamps: true
});

/**
 * PRE-SAVE MIDDLEWARE EXPLANATION
 * ==============================
 * 
 * This function runs automatically before saving a cart to the database.
 * It calculates all totals to ensure consistency and prevent client-side manipulation.
 * 
 * CALCULATION ORDER:
 * 1. Subtotal: Sum of (price × quantity) for all items
 * 2. Tax: Subtotal × tax rate
 * 3. Shipping: Free if subtotal > threshold, otherwise flat rate
 * 4. Total: Subtotal + tax + shipping
 * 
 * WHY WE DO THIS:
 * - Prevents price tampering from frontend
 * - Ensures consistent calculations across the app
 * - Single source of truth for pricing logic
 */
cartSchema.pre('save', function (next) {
    try {
        // Validate total item count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > CART_CONFIG.MAX_TOTAL_ITEMS) {
            const error = new Error(`Cart cannot contain more than ${CART_CONFIG.MAX_TOTAL_ITEMS} total items`);
            error.name = 'ValidationError';
            return next(error);
        }

        // Calculate subtotal with precision handling
        this.subtotal = parseFloat(
            this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
        );

        // Calculate tax
        this.tax = parseFloat((this.subtotal * CART_CONFIG.TAX_RATE).toFixed(2));

        // Calculate shipping
        this.shipping = this.subtotal >= CART_CONFIG.FREE_SHIPPING_THRESHOLD ?
            0 : CART_CONFIG.SHIPPING_COST;

        // Calculate total
        this.total = parseFloat((this.subtotal + this.tax + this.shipping).toFixed(2));

        next();
    } catch (error) {
        next(error);
    }
});

/**
 * INSTANCE METHODS
 * ===============
 * 
 * These methods can be called on individual cart documents.
 * Example: const cart = await Cart.findOne({sessionId}); cart.addItem(productData);
 */

// Add item to cart or update quantity if item exists
cartSchema.methods.addItem = function (productData) {
    const existingItem = this.items.find(item =>
        item.productId.toString() === productData.productId.toString() &&
        item.size === productData.size
    );

    if (existingItem) {
        existingItem.quantity += productData.quantity || 1;
    } else {
        this.items.push(productData);
    }

    return this.save();
};

// Remove item from cart
cartSchema.methods.removeItem = function (productId, size = 'standard') {
    this.items = this.items.filter(item =>
        !(item.productId.toString() === productId.toString() && item.size === size)
    );
    return this.save();
};

// Update item quantity
cartSchema.methods.updateQuantity = function (productId, newQuantity, size = 'standard') {
    const item = this.items.find(item =>
        item.productId.toString() === productId.toString() &&
        item.size === size
    );

    if (item) {
        item.quantity = newQuantity;
        return this.save();
    }
    throw new Error('Item not found in cart');
};

/**
 * INDEXES EXPLANATION
 * ==================
 * 
 * sessionId: Single field index for fast cart lookups by session
 * updatedAt + TTL: Automatically deletes inactive carts after 7 days
 * 
 * TTL (Time To Live) helps keep database clean and performant by
 * removing abandoned carts without manual cleanup scripts.
 */
cartSchema.index({ sessionId: 1 });
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days = 604800 seconds

module.exports = mongoose.model('Cart', cartSchema);

/**
 * USAGE EXAMPLES FOR JUNIOR DEVELOPERS
 * ===================================
 * 
 * // Create new cart
 * const cart = new Cart({ 
 *   sessionId: 'session_123',
 *   items: [{ productId, name, price, quantity, image }]
 * });
 * await cart.save(); // Totals calculated automatically
 * 
 * // Add item to existing cart
 * const cart = await Cart.findOne({ sessionId: 'session_123' });
 * await cart.addItem({ productId, name, price, quantity: 2, size: 'large', image });
 * 
 * // Get cart with product details populated
 * const cart = await Cart.findOne({ sessionId }).populate('items.productId');
 * 
 * // Convert cart to order (update status)
 * cart.status = 'converted';
 * await cart.save();
 */
