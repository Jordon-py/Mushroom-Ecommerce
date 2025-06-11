const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Joi = require('joi');
const mongoose = require('mongoose');

// Import fallback service with error handling
let FallbackProductService;
try {
    const fallbackModule = require('../fallback-products');
    FallbackProductService = fallbackModule.FallbackProductService;
    console.log('✅ FallbackProductService loaded successfully');
} catch (error) {
    console.error('❌ Failed to load FallbackProductService:', error.message);
}

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Validation schemas
const productValidationSchema = Joi.object({
    name: Joi.string().required().trim().max(100),
    description: Joi.string().required().trim().max(1000),
    price: Joi.number().required().min(0),
    category: Joi.string().valid('spores', 'growkits', 'supplies', 'accessories').required(),
    strain: Joi.string().optional().trim(),
    stock: Joi.number().min(0).default(0),
    sizes: Joi.array().items(Joi.object({
        size: Joi.string().required(),
        price: Joi.number().required().min(0),
        stock: Joi.number().required().min(0)
    })).optional(),
    featured: Joi.boolean().default(false),
    active: Joi.boolean().default(true),
    specifications: Joi.object().optional()
});

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        let filter = { active: true };

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.featured) {
            filter.featured = req.query.featured === 'true';
        }

        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        // Build sort object
        let sort = {};
        if (req.query.sortBy) {
            const sortField = req.query.sortBy;
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
            sort[sortField] = sortOrder;
        } else {
            sort = { createdAt: -1 }; // Default sort by newest
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        let products, total; if (isMongoConnected()) {
            // Use MongoDB
            products = await Product.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-__v');

            total = await Product.countDocuments(filter);
        } else if (FallbackProductService) {
            // Use fallback data
            products = await FallbackProductService.find(filter, {
                sort,
                skip,
                limit
            });

            total = await FallbackProductService.countDocuments(filter);
        } else {
            // Simple fallback if service unavailable
            products = [];
            total = 0;
        }

        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('-__v');

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
});

// @route   POST /api/products
// @desc    Create new product (Admin only - for now public for testing)
// @access  Public
router.post('/', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = productValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        const product = new Product(value);
        await product.save();

        res.status(201).json({
            success: true,
            data: product,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Error creating product:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Product with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to create product'
        });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only - for now public for testing)
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = productValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product'
        });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only - for now public for testing)
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
});

// @route   GET /api/products/categories/list
// @desc    Get available categories
// @access  Public
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

module.exports = router;
