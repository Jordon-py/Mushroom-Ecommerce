const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['spores', 'growkits', 'supplies', 'accessories'],
        default: 'spores'
    },
    strain: {
        type: String,
        trim: true
    },
    images: [{
        public_id: String,
        url: {
            type: String,
            required: true
        }
    }],
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    sizes: [{
        size: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    featured: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    specifications: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', strain: 'text' });
productSchema.index({ category: 1, featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });

module.exports = mongoose.model('Product', productSchema);
