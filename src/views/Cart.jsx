import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnalyticsContext from '../AnalyticsContext.jsx';
import { useCart } from '../CartContext.jsx';
import './Cart.css';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export default function Cart() {
  const { recordEvent, recordPageView } = useContext(AnalyticsContext);
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    recordPageView('Cart');
  }, [recordPageView]);

  const handleCheckoutStart = () => {
    recordEvent('checkout_start', 'Cart checkout', {
      itemCount,
      subtotal,
    });
  };

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <p>Review quantities and start checkout when you are ready.</p>
      </header>

      {items.length === 0 ? (
        <section className="cart-empty" aria-live="polite">
          <h2>Your cart is empty.</h2>
          <p>Add a product from the shop to begin building your order.</p>
          <Link className="cart-shop-link" to="/shop">
            Browse products
          </Link>
        </section>
      ) : (
        <section className="cart-panel" aria-label="Shopping cart line items">
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                {item.image && <img src={item.image} alt="" className="cart-item-image" />}
                <div className="cart-item-details">
                  <h2>{item.name}</h2>
                  <p>{formatCurrency(item.price)} each</p>
                </div>
                <label className="cart-quantity">
                  <span>Qty</span>
                  <input
                    min="0"
                    type="number"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.id, event.target.value)}
                  />
                </label>
                <p className="cart-line-total">{formatCurrency(item.price * item.quantity)}</p>
                <button type="button" className="cart-remove-btn" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <aside className="cart-summary" aria-label="Cart summary">
            <p>
              <span>Items</span>
              <strong>{itemCount}</strong>
            </p>
            <p>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </p>
            <button type="button" className="checkout-start-btn" onClick={handleCheckoutStart}>
              Start Checkout
            </button>
            <button type="button" className="cart-clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}
