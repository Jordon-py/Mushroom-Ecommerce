const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Joi = require('joi');
const mongoose = require('mongoose');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Validation schemas
const createOrderSchema = Joi.object({
    shippingAddress: Joi.object({
        firstName: Joi.string().required().trim(),
        lastName: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        phone: Joi.string().optional().trim(),
        address: Joi.string().required().trim(),
        city: Joi.string().required().trim(),
        state: Joi.string().required().trim(),
        zipCode: Joi.string().required().trim(),
        country: Joi.string().required().trim().default('US')
    }).required(),
    paymentMethod: Joi.string().valid('paypal', 'stripe', 'card').required(),
    notes: Joi.string().optional().trim().max(500)
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
    try {
        if (!isMongoConnected()) {
            // Fallback: Return success message for demo mode
            return res.json({
                success: true,
                message: 'Order simulation successful (in-memory mode)',
                data: {
                    orderId: 'DEMO-' + Date.now(),
                    status: 'simulated',
                    total: 0,
                    message: 'Connect MongoDB for full order processing'
                }
            });
        }

        // Validate request body
        const { error, value } = createOrderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        const sessionId = req.sessionID;
        const { shippingAddress, paymentMethod, notes } = value;

        // Get user's cart
        const cart = await Cart.findOne({ sessionId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        // Verify stock availability for all items
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: `Product ${item.name} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for ${item.name}`
                });
            }
        }

        // Generate order number
        const orderNumber = 'MSH' + Date.now() + Math.floor(Math.random() * 1000);

        // Create order
        const order = new Order({
            orderNumber,
            sessionId,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                image: item.image
            })),
            subtotal: cart.subtotal,
            tax: cart.tax,
            shipping: cart.shipping,
            total: cart.total,
            shippingAddress,
            paymentMethod,
            notes,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order'
        });
    }
});

// @route   GET /api/orders/:orderNumber
// @desc    Get order by order number
// @access  Public
router.get('/:orderNumber', async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const sessionId = req.sessionID;

        const order = await Order.findOne({
            orderNumber,
            sessionId
        }).populate('items.productId');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order'
        });
    }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Public
router.get('/', async (req, res) => {
    try {
        const sessionId = req.sessionID;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ sessionId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('items.productId');

        const total = await Order.countDocuments({ sessionId });
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

// @route   PUT /api/orders/:orderNumber/status
// @desc    Update order status (Admin functionality)
// @access  Public (should be admin only in production)
router.put('/:orderNumber/status', async (req, res) => {
    try {
        const { status } = req.body;
        const orderNumber = req.params.orderNumber;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Add status update to history
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: `Status updated to ${status}`
        });

        order.status = status;
        await order.save();

        res.json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
});

// @route   PUT /api/orders/:orderNumber/payment
// @desc    Update order payment status
// @access  Public
router.put('/:orderNumber/payment', async (req, res) => {
    try {
        const { paymentStatus, transactionId, paymentDetails } = req.body;
        const orderNumber = req.params.orderNumber;
        const sessionId = req.sessionID;

        const order = await Order.findOne({ orderNumber, sessionId });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Update payment information
        order.paymentStatus = paymentStatus;
        if (transactionId) order.transactionId = transactionId;
        if (paymentDetails) order.paymentDetails = paymentDetails;

        // If payment is successful, update stock and clear cart
        if (paymentStatus === 'completed') {
            // Update product stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } }
                );
            }

            // Clear user's cart
            await Cart.findOneAndUpdate(
                { sessionId },
                {
                    items: [],
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    total: 0
                }
            );

            // Update order status
            order.status = 'processing';
            order.statusHistory.push({
                status: 'processing',
                timestamp: new Date(),
                note: 'Payment completed, order is being processed'
            });
        }

        await order.save();

        res.json({
            success: true,
            data: order,
            message: 'Payment status updated successfully'
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update payment status'
        });
    }
});

// @route   DELETE /api/orders/:orderNumber
// @desc    Cancel order (if still pending)
// @access  Public
router.delete('/:orderNumber', async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const sessionId = req.sessionID;

        const order = await Order.findOne({ orderNumber, sessionId });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'Order cannot be cancelled as it is already being processed'
            });
        }

        order.status = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: 'Order cancelled by customer'
        });

        await order.save();

        res.json({
            success: true,
            data: order,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cancel order'
        });
    }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin functionality)
// @access  Public (should be admin only in production)
router.get('/admin/all', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        let filter = {};
        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('items.productId');

        const total = await Order.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

module.exports = router;
