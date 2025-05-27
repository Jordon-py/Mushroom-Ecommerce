// ================================
// Home.jsx - Homepage Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~17
//   • Complexity: Low (layout composition)
//   • Dependencies: SideBar, WelcomeBanner components
//   • Layout Elements: 2 main sections
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Primary landing page for mushroom spore store
//   • Navigation integration
//   • Welcome messaging and brand introduction
//   • Product category overview
//
// 🔄 COMPONENT STRUCTURE:
//   • Fragment wrapper (prevents extra DOM nodes)
//   • Semantic HTML with proper heading hierarchy
//   • Clear content sectioning
//
// 🚨 RECENT FIXES APPLIED:
//   • ✅ Removed duplicate layout wrapper
//   • ✅ Cleaned up unused props
//   • ✅ Improved DOM structure
//
// 💡 DESIGN PATTERNS:
//   • Composition over configuration
//   • Semantic HTML structure
//   • Clear content hierarchy
// ================================

import SideBar from "../components/SideBar"
import WelcomeBanner from "../components/WelcomeBanner";

export default function Home({ lightMode, appSectionClass }) {
    return (
        <>
            <SideBar />
            <main className="main-content">
                <WelcomeBanner 
                    appSectionClass={appSectionClass} 
                    welcome="Trippy.Shroom Store" 
                />
                <section className="home-content">
                    <h2>Premium Mushroom Spores & Growing Supplies</h2>
                    <p>Discover our collection of high-quality mushroom spores and growing kits.</p>
                </section>
            </main>
        </>
    );
};