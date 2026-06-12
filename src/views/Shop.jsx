import React, { useContext, useEffect } from 'react';
import AnalyticsContext from '../AnalyticsContext.jsx';
import { products } from '../data/products.js';
import './Shop.css';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatCurrency(priceCents) {
  return currencyFormatter.format(priceCents / 100);
}

export default function Shop() {
  const { recordPageView, recordProductView } = useContext(AnalyticsContext);

  useEffect(() => {
    recordPageView('Shop');
  }, [recordPageView]);

  return (
    <main className="main-content">
      <header id="main-header">
        <h1>Mushroom Shop</h1>
        <p>Premium spores and growing supplies</p>
      </header>
      <section className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => recordProductView(product.name)}
          >
            <img src={product.image} alt={product.imageAlt} />
            <h2>{product.name}</h2>
            <p className="description">{product.description}</p>
            <p className="price">{formatCurrency(product.priceCents)}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
