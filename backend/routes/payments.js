const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Configure PayPal
paypal.configure({
    'mode': process.env.PAYPAL_MODE || 'sandbox',
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

// @route   POST /api/payments/paypal/create
// @desc    Create PayPal payment
// @access  Public
router.post('/paypal/create', async (req, res) => {
    try {
        const sessionId = req.sessionID;
        const { orderNumber } = req.body;

        // Get order details
        const order = await Order.findOne({ orderNumber, sessionId });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        if (order.paymentStatus === 'completed') {
            return res.status(400).json({
                success: false,
                error: 'Order has already been paid'
            });
        }

        // Create PayPal payment
        const payment = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/checkout/success?orderNumber=${orderNumber}`,
                cancel_url: `${process.env.CLIENT_URL}/checkout/cancel?orderNumber=${orderNumber}`
            },
            transactions: [{
                amount: {
                    currency: 'USD',
                    total: order.total.toFixed(2),
                    details: {
                        subtotal: order.subtotal.toFixed(2),
                        tax: order.tax.toFixed(2),
                        shipping: order.shipping.toFixed(2)
                    }
                },
                description: `Mushroom Ecommerce Order #${orderNumber}`,
                custom: orderNumber,
                item_list: {
                    items: order.items.map(item => ({
                        name: item.name,
                        sku: item.productId.toString(),
                        price: item.price.toFixed(2),
                        currency: 'USD',
                        quantity: item.quantity
                    }))
                }
            }]
        };

        paypal.payment.create(payment, (error, payment) => {
            if (error) {
                console.error('PayPal payment creation error:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to create PayPal payment'
                });
            }

            // Find approval URL
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url');

            res.json({
                success: true,
                data: {
                    paymentId: payment.id,
                    approvalUrl: approvalUrl.href
                }
            });
        });
    } catch (error) {
        console.error('Error creating PayPal payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment'
        });
    }
});

// @route   POST /api/payments/paypal/execute
// @desc    Execute PayPal payment
// @access  Public
router.post('/paypal/execute', async (req, res) => {
    try {
        const { paymentId, payerId, orderNumber } = req.body;
        const sessionId = req.sessionID;

        if (!paymentId || !payerId || !orderNumber) {
            return res.status(400).json({
                success: false,
                error: 'Missing required payment information'
            });
        }

        // Get order
        const order = await Order.findOne({ orderNumber, sessionId });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Execute PayPal payment
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [{
                amount: {
                    currency: 'USD',
                    total: order.total.toFixed(2)
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                console.error('PayPal payment execution error:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to execute PayPal payment'
                });
            }

            if (payment.state === 'approved') {
                try {
                    // Update order with payment details
                    await Order.findOneAndUpdate(
                        { orderNumber, sessionId },
                        {
                            paymentStatus: 'completed',
                            transactionId: payment.id,
                            paymentDetails: {
                                method: 'paypal',
                                paypalPaymentId: payment.id,
                                paypalPayerId: payerId,
                                amount: payment.transactions[0].amount.total,
                                currency: payment.transactions[0].amount.currency,
                                completedAt: new Date()
                            },
                            status: 'processing',
                            $push: {
                                statusHistory: {
                                    status: 'processing',
                                    timestamp: new Date(),
                                    note: 'Payment completed via PayPal'
                                }
                            }
                        }
                    );

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

                    res.json({
                        success: true,
                        data: {
                            orderNumber,
                            paymentId: payment.id,
                            status: 'completed'
                        },
                        message: 'Payment completed successfully'
                    });
                } catch (dbError) {
                    console.error('Database update error:', dbError);
                    res.status(500).json({
                        success: false,
                        error: 'Payment processed but order update failed'
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Payment was not approved'
                });
            }
        });
    } catch (error) {
        console.error('Error executing PayPal payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to execute payment'
        });
    }
});

// @route   GET /api/payments/paypal/status/:paymentId
// @desc    Get PayPal payment status
// @access  Public
router.get('/paypal/status/:paymentId', (req, res) => {
    const paymentId = req.params.paymentId;

    paypal.payment.get(paymentId, (error, payment) => {
        if (error) {
            console.error('PayPal payment status error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to get payment status'
            });
        }

        res.json({
            success: true,
            data: {
                paymentId: payment.id,
                state: payment.state,
                amount: payment.transactions[0].amount,
                createTime: payment.create_time,
                updateTime: payment.update_time
            }
        });
    });
});

// @route   POST /api/payments/webhook/paypal
// @desc    Handle PayPal webhooks
// @access  Public
router.post('/webhook/paypal', async (req, res) => {
    try {
        const event = req.body;
        console.log('PayPal webhook received:', event.event_type);

        switch (event.event_type) {
            case 'PAYMENT.SALE.COMPLETED':
                // Handle successful payment
                const paymentId = event.resource.parent_payment;
                console.log('Payment completed:', paymentId);
                break;

            case 'PAYMENT.SALE.DENIED':
                // Handle denied payment
                console.log('Payment denied:', event.resource.parent_payment);
                break;

            default:
                console.log('Unhandled webhook event:', event.event_type);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('PayPal webhook error:', error);
        res.status(500).json({
            success: false,
            error: 'Webhook processing failed'
        });
    }
});

// @route   POST /api/payments/card/process
// @desc    Process credit card payment (placeholder for Stripe or other processor)
// @access  Public
router.post('/card/process', async (req, res) => {
    try {
        const { orderNumber, cardDetails } = req.body;
        const sessionId = req.sessionID;

        // Get order
        const order = await Order.findOne({ orderNumber, sessionId });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // This is a placeholder for credit card processing
        // In a real application, you would integrate with Stripe, Square, or another payment processor

        // For demo purposes, we'll simulate a successful payment
        const simulatedSuccess = Math.random() > 0.1; // 90% success rate

        if (simulatedSuccess) {
            const transactionId = 'card_' + Date.now() + Math.floor(Math.random() * 1000);

            await Order.findOneAndUpdate(
                { orderNumber, sessionId },
                {
                    paymentStatus: 'completed',
                    transactionId,
                    paymentDetails: {
                        method: 'card',
                        last4: cardDetails.number.slice(-4),
                        amount: order.total,
                        currency: 'USD',
                        completedAt: new Date()
                    },
                    status: 'processing',
                    $push: {
                        statusHistory: {
                            status: 'processing',
                            timestamp: new Date(),
                            note: 'Payment completed via credit card'
                        }
                    }
                }
            );

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

            res.json({
                success: true,
                data: {
                    orderNumber,
                    transactionId,
                    status: 'completed'
                },
                message: 'Payment processed successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Payment was declined'
            });
        }
    } catch (error) {
        console.error('Error processing card payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process payment'
        });
    }
});

module.exports = router;
