// ================================
// Shop.jsx - Complete E-commerce Shopping Experience
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~180
//   • Complexity: High (product fetching + filtering + cart)
//   • Dependencies: react, api service, ProductCard, ShoppingCart
//   • Features: Product grid, filtering, search, cart management
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Display mushroom spore products in organized grid
//   • Handle product filtering by category and search
//   • Manage shopping cart state and interactions
//   • Provide sorting and pagination functionality
//
// 🔄 STATE MANAGEMENT:
//   • products: array - Product catalog from backend
//   • filteredProducts: array - Products after filters applied
//   • loading: boolean - Loading state for API calls
//   • error: string - Error messages for user feedback
//   • cartOpen: boolean - Cart visibility state
//   • filters: object - Current filter settings
// ================================

import React, { useState, useEffect, useContext } from 'react';
import AnalyticsContext from '../AnalyticsContext.jsx';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ShoppingCart from '../components/ShoppingCart';
import './Shop.css';

export default function Shop({ lightMode }) {
    const { recordPageView, recordProductView } = useContext(AnalyticsContext);

    // State management
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Filter and search state
    const [filters, setFilters] = useState({
        category: 'all',
        search: '',
        sortBy: 'name',
        sortOrder: 'asc'
    });

    // Record page view on mount
    useEffect(() => {
        recordPageView('Shop');
        fetchProducts();
        fetchCartCount();
    }, [recordPageView]);

    // Apply filters when products or filters change
    useEffect(() => {
        applyFilters();
    }, [products, filters]);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/products', {
                params: {
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                    limit: 50 // Get more products for filtering
                }
            });

            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCartCount = async () => {
        try {
            const response = await api.get('/cart/count');
            if (response.data.success) {
                setCartCount(response.data.data.count);
            }
        } catch (err) {
            console.error('Error fetching cart count:', err);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                (product.strain && product.strain.toLowerCase().includes(searchTerm))
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            let valueA = a[filters.sortBy];
            let valueB = b[filters.sortBy];

            if (filters.sortBy === 'name') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (filters.sortOrder === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        setFilteredProducts(filtered);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleAddToCart = (product, quantity) => {
        recordProductView(product.name);
        fetchCartCount(); // Update cart count

        // Show success message
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    const handleCheckout = () => {
        // In a real app, this would navigate to checkout page
        alert('Checkout functionality will be implemented next!');
    };

    const categories = [
        { value: 'all', label: 'All Products' },
        { value: 'spores', label: 'Spore Syringes' },
        { value: 'growkits', label: 'Grow Kits' },
        { value: 'supplies', label: 'Supplies' },
        { value: 'accessories', label: 'Accessories' }
    ];

    return (
        <>
            <main className="main-content">
                <header id="main-header">
                    <h1>🍄 Mushroom Shop</h1>
                    <p>Premium spores and growing supplies for serious cultivators</p>

                    <button
                        className="cart-toggle"
                        onClick={() => setCartOpen(true)}
                        aria-label="Open shopping cart"
                    >
                        🛒 Cart ({cartCount})
                    </button>
                </header>

                <section className="shop-filters">
                    <div className="filter-group">
                        <label htmlFor="category-filter">Category:</label>
                        <select
                            id="category-filter"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="search-filter">Search:</label>
                        <input
                            id="search-filter"
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sort-filter">Sort by:</label>
                        <select
                            id="sort-filter"
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split('-');
                                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                            }}
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                        </select>
                    </div>
                </section>

                <section className="shop-content">
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                            <button onClick={fetchProducts}>Try Again</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-message">
                            <div className="spinner"></div>
                            <p>Loading mushroom spores...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <>
                            <div className="products-header">
                                <h2>Available Products ({filteredProducts.length})</h2>
                                {filters.category !== 'all' && (
                                    <p>Showing {categories.find(c => c.value === filters.category)?.label}</p>
                                )}
                                {filters.search && (
                                    <p>Search results for: "{filters.search}"</p>
                                )}
                            </div>

                            <div className="product-grid">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="no-products">
                            <h3>No products found</h3>
                            <p>
                                {filters.search || filters.category !== 'all'
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'Products are being added to our catalog. Check back soon!'}
                            </p>
                            {(filters.search || filters.category !== 'all') && (
                                <button
                                    onClick={() => setFilters({ category: 'all', search: '', sortBy: 'name', sortOrder: 'asc' })}
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </main>

            <ShoppingCart
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                onCheckout={handleCheckout}
            />
        </>
    );
}
