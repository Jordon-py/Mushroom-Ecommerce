import React, { useContext, useEffect } from 'react';
import AnalyticsContext from '../AnalyticsContext.jsx';
import './Shop.css';

const products = [
  {
    name: 'A+ Albinos',
    image: '/assets/A+%20ALBINOS.jpg',
    description: 'Rare white variant prized by collectors.',
    price: '$25',
  },
  {
    name: 'Blue Mini',
    image: '/assets/BLUE%20MINI.jpg',
    description: 'Compact variety with vivid blue hues.',
    price: '$18',
  },
  {
    name: 'Hill Billy',
    image: '/assets/HILL%20BILLY.jpg',
    description: 'Hardy strain known for vigorous growth.',
    price: '$19',
  },
  {
    name: 'Jedi Mind F',
    image: '/assets/JEDI%20MIND%20FUCKS.webp',
    description: 'Popular among experienced cultivators.',
    price: '$24',
  },
  {
    name: 'Mazatapec',
    image: '/assets/MAZATAPEC.jpg',
    description: 'Classic Psilocybe cubensis strain from Mexico.',
    price: '$20',
  },
  {
    name: 'Natal Super Strength',
    image: '/assets/NATAL%20SUPER%20STRENGTH.jpg',
    description: 'Robust spores ideal for advanced growers.',
    price: '$26',
  },
  {
    name: 'P.E.6',
    image: '/assets/P%20E6.png',
    description: 'Penis Envy hybrid with unique genetics.',
    price: '$23',
  },
  {
    name: 'Penis Envy',
    image: '/assets/PENIS%20ENVY.png',
    description: 'Legendary potency and strong colonization.',
    price: '$28',
  },
  {
    name: 'PF Classic',
    image: '/assets/PF%20CLASSIC.jpg',
    description: 'Beginner-friendly spores for PF Tek enthusiasts.',
    price: '$15',
  },
  {
    name: 'Treasure Coast',
    image: '/assets/TREASURE%20COAST.webp',
    description: 'Florida strain famous for large flushes.',
    price: '$21',
  },
  {
    name: 'Burma',
    image: '/assets/burma%20mushrooms.jpg',
    description: 'Exotic variety from Southeast Asia.',
    price: '$20',
  },
  {
    name: 'Z-Strain',
    image: '/assets/z%20strain.jpg',
    description: 'Popular strain known for consistent growth.',
    price: '$22',
  },
  {
    name: 'P.E.6 Webp',
    image: '/assets/P%20E6.webp',
    description: 'Alternate image format of P.E.6 spores.',
    price: '$23',
  },
  {
    name: 'Shrooms 1',
    image: '/assets/Shrooms_1.PNG',
    description: 'Colorful promotional artwork.',
    price: '$18',
  },
  {
    name: 'Shrooms 2',
    image: '/assets/Shrooms_2.PNG',
    description: 'More spores with an artistic twist.',
    price: '$18',
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
