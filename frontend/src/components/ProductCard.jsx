// ================================
// ProductCard.jsx - Individual Product Display Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~45
//   • Complexity: Medium (product interactions + state)
//   • Dependencies: react, api service
//   • Features: Add to cart, product details, rating display
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Display individual product information
//   • Handle add to cart functionality  
//   • Show product images, pricing, and descriptions
//   • Provide interactive product actions
//
// 🔄 COMPONENT STRUCTURE:
//   • Product image with fallback
//   • Product details (name, price, description)
//   • Add to cart button with quantity selector
//   • Rating and stock status display
// ================================

import React, { useState } from 'react';
import api from '../api';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (isAdding || product.stock === 0) return;

        setIsAdding(true);
        try {
            await api.post('/cart/add', {
                productId: product._id,
                quantity: quantity
            });

            // Call parent callback if provided
            if (onAddToCart) {
                onAddToCart(product, quantity);
            }

            // Reset quantity after successful add
            setQuantity(1);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    const getImageUrl = () => {
        if (product.images && product.images.length > 0) {
            return product.images[0].url;
        }
        return '/assets/default-product.jpg';
    };

    const isOutOfStock = product.stock === 0;

    return (
        <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="product-image-container">
                <img
                    src={getImageUrl()}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                        e.target.src = '/assets/default-product.jpg';
                    }}
                />
                {product.featured && <span className="featured-badge">⭐ Featured</span>}
                {isOutOfStock && <span className="stock-badge">Out of Stock</span>}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                {product.strain && (
                    <p className="product-strain">
                        <strong>Strain:</strong> {product.strain}
                    </p>
                )}

                <div className="product-rating">
                    {'⭐'.repeat(Math.floor(product.ratings?.average || 0))}
                    <span className="rating-count">
                        ({product.ratings?.count || 0} reviews)
                    </span>
                </div>

                <div className="product-price">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <span className="stock-info">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                </div>

                <div className="product-actions">
                    <div className="quantity-selector">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1 || isOutOfStock}
                            aria-label="Decrease quantity"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={product.stock}
                            disabled={isOutOfStock}
                            aria-label="Quantity"
                        />
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            disabled={quantity >= product.stock || isOutOfStock}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={isAdding || isOutOfStock}
                    >
                        {isAdding ? '🛒 Adding...' : isOutOfStock ? '❌ Out of Stock' : '🛒 Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
