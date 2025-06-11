const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Joi = require('joi');
const mongoose = require('mongoose');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Validation schemas
const addToCartSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    size: Joi.string().optional().default('standard')
});

const updateCartItemSchema = Joi.object({
    quantity: Joi.number().integer().min(0).required()
});

// Helper function to get or create cart
const getOrCreateCart = async (sessionId) => {
    let cart = await Cart.findOne({ sessionId }).populate('items.productId');

    if (!cart) {
        cart = new Cart({ sessionId, items: [] });
        await cart.save();
    }

    return cart;
};

// Helper function to calculate cart totals
const calculateCartTotals = (cart) => {
    const subtotal = cart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        shipping: Math.round(shipping * 100) / 100,
        total: Math.round(total * 100) / 100
    };
};

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Public
router.get('/', async (req, res) => {
    try {
        if (!isMongoConnected()) {
            // Fallback: Return empty cart for in-memory mode
            return res.json({
                success: true,
                data: {
                    items: [],
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    total: 0,
                    itemCount: 0
                },
                message: 'Using in-memory storage (no persistent cart)'
            });
        }

        const sessionId = req.sessionID;
        const cart = await getOrCreateCart(sessionId);

        // Calculate totals
        const totals = calculateCartTotals(cart);

        // Update cart with calculated totals
        cart.subtotal = totals.subtotal;
        cart.tax = totals.tax;
        cart.shipping = totals.shipping;
        cart.total = totals.total;

        await cart.save();

        res.json({
            success: true,
            data: {
                cart,
                totals
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cart'
        });
    }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Public
router.post('/add', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = addToCartSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        const { productId, quantity, size } = value;
        const sessionId = req.sessionID;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient stock available'
            });
        }

        const cart = await getOrCreateCart(sessionId);

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;

            if (product.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Not enough stock available for requested quantity'
                });
            }

            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            const newItem = {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
                size,
                image: product.images && product.images.length > 0
                    ? product.images[0].url
                    : '/assets/default-product.jpg'
            };

            cart.items.push(newItem);
        }

        // Calculate and update totals
        const totals = calculateCartTotals(cart);
        cart.subtotal = totals.subtotal;
        cart.tax = totals.tax;
        cart.shipping = totals.shipping;
        cart.total = totals.total;

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            success: true,
            data: {
                cart,
                totals
            },
            message: 'Item added to cart successfully'
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add item to cart'
        });
    }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Public
router.put('/update/:itemId', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = updateCartItemSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        const { quantity } = value;
        const sessionId = req.sessionID;
        const itemId = req.params.itemId;

        const cart = await getOrCreateCart(sessionId);

        // Find the item in cart
        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }

        if (quantity === 0) {
            // Remove item from cart
            cart.items.splice(itemIndex, 1);
        } else {
            // Check stock availability
            const product = await Product.findById(cart.items[itemIndex].productId);
            if (product && product.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Insufficient stock available'
                });
            }

            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        // Calculate and update totals
        const totals = calculateCartTotals(cart);
        cart.subtotal = totals.subtotal;
        cart.tax = totals.tax;
        cart.shipping = totals.shipping;
        cart.total = totals.total;

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            success: true,
            data: {
                cart,
                totals
            },
            message: 'Cart updated successfully'
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update cart'
        });
    }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Public
router.delete('/remove/:itemId', async (req, res) => {
    try {
        const sessionId = req.sessionID;
        const itemId = req.params.itemId;

        const cart = await getOrCreateCart(sessionId);

        // Find and remove the item
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }

        // Calculate and update totals
        const totals = calculateCartTotals(cart);
        cart.subtotal = totals.subtotal;
        cart.tax = totals.tax;
        cart.shipping = totals.shipping;
        cart.total = totals.total;

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            success: true,
            data: {
                cart,
                totals
            },
            message: 'Item removed from cart successfully'
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove item from cart'
        });
    }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Public
router.delete('/clear', async (req, res) => {
    try {
        const sessionId = req.sessionID;

        await Cart.findOneAndUpdate(
            { sessionId },
            {
                items: [],
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cart'
        });
    }
});

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Public
router.get('/count', async (req, res) => {
    try {
        const sessionId = req.sessionID;
        const cart = await Cart.findOne({ sessionId });

        const itemCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

        res.json({
            success: true,
            data: { count: itemCount }
        });
    } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get cart count'
        });
    }
});

module.exports = router;
