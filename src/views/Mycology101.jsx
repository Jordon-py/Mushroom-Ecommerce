// ================================
// Mycology101.jsx
// ================================
// Educational page about mushroom cultivation and mycology basics.
// This component provides learning resources for mushroom enthusiasts.
//
// Key Concepts Covered:
//   • Educational content layout
//   • Semantic HTML for content structure
//   • Accessibility considerations for educational material
// ================================

import SideBar from "../components/SideBar";

export default function Mycology101() {
    return (
        <>
            <main className="main-content">
                <header>
                    <h1>Mycology 101</h1>
                    <p>Learn the basics of mushroom cultivation</p>
                </header>
                <section className="mycology-content">
                    <article>
                        <h2>🌱 Getting Started with Mushroom Growing</h2>
                        <p>Mycology is the study of fungi, including mushrooms. Growing mushrooms at home can be a rewarding hobby that connects you with nature.</p>
                        
                        <h3>Basic Concepts:</h3>
                        <ul>
                            <li><strong>Spores:</strong> The "seeds" of mushrooms</li>
                            <li><strong>Mycelium:</strong> The root-like network that grows from spores</li>
                            <li><strong>Substrate:</strong> The growing medium for mushrooms</li>
                            <li><strong>Fruiting:</strong> When mushrooms actually grow and appear</li>
                        </ul>

                        <h3>🍄 Popular Beginner-Friendly Varieties:</h3>
                        <ul>
                            <li>Oyster mushrooms (Pleurotus species)</li>
                            <li>Shiitake (Lentinula edodes)</li>
                            <li>Lion's Mane (Hericium erinaceus)</li>
                        </ul>

                        <p><em>Always research local laws and regulations before starting any cultivation project.</em></p>
                    </article>                </section>
            </main>
        </>
    );
}
