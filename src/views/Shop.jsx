// ================================
// Shop.jsx
// ================================
// The shop page component that displays mushroom products for sale.
// This component will eventually show spores, grow kits, and other supplies.
//
// Key Concepts Covered:
//   • Component composition
//   • Semantic HTML structure
//   • Future e-commerce layout preparation
// ================================

import SideBar from "../components/SideBar";

export default function Shop() {
    return (
        <>
            <SideBar />
            <main className="main-content">
                <header>
                    <h1>Mushroom Shop</h1>
                    <p>Premium spores and growing supplies</p>
                </header>
                <section className="shop-content">
                    <div className="coming-soon">
                        <h2>🍄 Coming Soon!</h2>
                        <p>Our mushroom spore collection and growing kits will be available here soon.</p>
                        <ul>
                            <li>Premium spore syringes</li>
                            <li>Mushroom growing kits</li>
                            <li>Cultivation supplies</li>
                            <li>Educational materials</li>
                        </ul>
                    </div>                </section>
            </main>
        </>
    );
}
