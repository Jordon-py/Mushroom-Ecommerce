import React, { useContext, useEffect } from 'react';
import AnalyticsContext from '../AnalyticsContext.jsx';
import './Shop.css';

const products = [
  {
    name: 'Mazatapec',
    image: '/assets/MAZATAPEC.jpg',
    description: 'Classic Psilocybe cubensis strain from Mexico.',
    price: '$20',
  },
  {
    name: 'Blue Mini',
    image: '/assets/BLUE MINI.jpg',
    description: 'Compact variety with vivid blue hues.',
    price: '$18',
  },
  {
    name: 'PF Classic',
    image: '/assets/PF CLASSIC.jpg',
    description: 'Beginner-friendly spores for PF Tek enthusiasts.',
    price: '$15',
  },
  {
    name: 'Z-Strain',
    image: '/assets/z strain.jpg',
    description: 'Popular strain known for consistent growth.',
    price: '$22',
  },
];

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
        {products.map((p) => (
          <div
            key={p.name}
            className="product-card"
            onClick={() => recordProductView(p.name)}
          >
            <img src={p.image} alt={p.name} />
            <h2>{p.name}</h2>
            <p className="description">{p.description}</p>
            <p className="price">{p.price}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
