// ================================
// ShoppingCart.jsx - Cart Management Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~120
//   • Complexity: High (cart operations + state management)
//   • Dependencies: react, api service
//   • Features: Cart display, quantity updates, checkout navigation
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Display cart items with detailed information
//   • Handle quantity updates and item removal
//   • Show cart totals (subtotal, tax, shipping, total)
//   • Provide checkout navigation
//
// 🔄 STATE MANAGEMENT:
//   • cart: object - Current cart data from backend
//   • loading: boolean - Loading state for operations
//   • error: string - Error messages for user feedback
// ================================

import React, { useState, useEffect } from 'react';
import api from '../api';
import './ShoppingCart.css';

export default function ShoppingCart({ isOpen, onClose, onCheckout }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch cart data when component mounts or opens
    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const fetchCart = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/cart');
            setCart(response.data.data.cart);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 0) return;

        try {
            setError('');
            if (newQuantity === 0) {
                await api.delete(`/cart/remove/${itemId}`);
            } else {
                await api.put(`/cart/update/${itemId}`, { quantity: newQuantity });
            }
            await fetchCart(); // Refresh cart
        } catch (err) {
            console.error('Error updating cart:', err);
            setError('Failed to update item');
        }
    };

    const removeItem = async (itemId) => {
        try {
            setError('');
            await api.delete(`/cart/remove/${itemId}`);
            await fetchCart(); // Refresh cart
        } catch (err) {
            console.error('Error removing item:', err);
            setError('Failed to remove item');
        }
    };

    const clearCart = async () => {
        if (!confirm('Are you sure you want to clear your cart?')) return;

        try {
            setError('');
            await api.delete('/cart/clear');
            await fetchCart(); // Refresh cart
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError('Failed to clear cart');
        }
    };

    const handleCheckout = () => {
        if (cart && cart.items.length > 0) {
            onCheckout();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-container" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>🛒 Your Cart</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close cart">
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <div className="cart-content">
                    {loading ? (
                        <div className="loading">Loading cart...</div>
                    ) : cart && cart.items.length > 0 ? (
                        <>
                            <div className="cart-items">
                                {cart.items.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <img
                                            src={item.image || '/assets/default-product.jpg'}
                                            alt={item.name}
                                            className="item-image"
                                            onError={(e) => {
                                                e.target.src = '/assets/default-product.jpg';
                                            }}
                                        />
                                        <div className="item-details">
                                            <h4 className="item-name">{item.name}</h4>
                                            <p className="item-price">${item.price.toFixed(2)} each</p>
                                            {item.size !== 'standard' && (
                                                <p className="item-size">Size: {item.size}</p>
                                            )}
                                        </div>
                                        <div className="item-controls">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    disabled={loading}
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    disabled={loading}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeItem(item._id)}
                                                disabled={loading}
                                                aria-label="Remove item"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        <div className="item-total">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax:</span>
                                    <span>${cart.tax?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping:</span>
                                    <span>
                                        {cart.shipping === 0 ? 'FREE' : `$${cart.shipping?.toFixed(2) || '0.00'}`}
                                    </span>
                                </div>
                                <div className="summary-row total">
                                    <span><strong>Total:</strong></span>
                                    <span><strong>${cart.total?.toFixed(2) || '0.00'}</strong></span>
                                </div>

                                <div className="shipping-notice">
                                    {cart.subtotal < 50 && (
                                        <p>🚚 Add ${(50 - cart.subtotal).toFixed(2)} more for free shipping!</p>
                                    )}
                                </div>
                            </div>

                            <div className="cart-actions">
                                <button
                                    className="clear-cart-btn"
                                    onClick={clearCart}
                                    disabled={loading}
                                >
                                    Clear Cart
                                </button>
                                <button
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="empty-cart">
                            <h3>Your cart is empty</h3>
                            <p>Add some mushroom spores to get started!</p>
                            <button className="continue-shopping" onClick={onClose}>
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
