const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const products = [
    {
        name: 'Mazatapec',
        description: 'Classic Psilocybe cubensis strain from Mexico. Known for its spiritual and introspective effects. Great for beginners.',
        price: 20.00,
        category: 'spores',
        strain: 'Mazatapec',
        stock: 50,
        images: [{ url: '/assets/MAZATAPEC.jpg' }],
        featured: true,
        sizes: [
            { size: '5ml', price: 15.00, stock: 25 },
            { size: '10ml', price: 20.00, stock: 30 },
            { size: '20ml', price: 35.00, stock: 15 }
        ],
        specifications: new Map([
            ['Origin', 'Mexico'],
            ['Difficulty', 'Beginner'],
            ['Potency', 'Moderate'],
            ['Growth Speed', 'Fast']
        ])
    },
    {
        name: 'Blue Mini',
        description: 'Compact variety with vivid blue hues. Small but potent mushrooms with beautiful coloration.',
        price: 18.00,
        category: 'spores',
        strain: 'Blue Mini',
        stock: 35,
        images: [{ url: '/assets/BLUE MINI.jpg' }],
        featured: false,
        sizes: [
            { size: '5ml', price: 13.00, stock: 20 },
            { size: '10ml', price: 18.00, stock: 25 },
            { size: '20ml', price: 32.00, stock: 10 }
        ],
        specifications: new Map([
            ['Origin', 'Cultivated'],
            ['Difficulty', 'Intermediate'],
            ['Potency', 'High'],
            ['Growth Speed', 'Medium']
        ])
    },
    {
        name: 'PF Classic',
        description: 'Beginner-friendly spores for PF Tek enthusiasts. Reliable growth and consistent results.',
        price: 15.00,
        category: 'spores',
        strain: 'PF Classic',
        stock: 60,
        images: [{ url: '/assets/PF CLASSIC.jpg' }],
        featured: true,
        sizes: [
            { size: '5ml', price: 12.00, stock: 30 },
            { size: '10ml', price: 15.00, stock: 40 },
            { size: '20ml', price: 28.00, stock: 20 }
        ],
        specifications: new Map([
            ['Origin', 'Florida'],
            ['Difficulty', 'Beginner'],
            ['Potency', 'Moderate'],
            ['Growth Speed', 'Fast']
        ])
    },
    {
        name: 'Z-Strain',
        description: 'Popular strain known for consistent growth and reliable yields. Excellent for research purposes.',
        price: 22.00,
        category: 'spores',
        strain: 'Z-Strain',
        stock: 40,
        images: [{ url: '/assets/z strain.jpg' }],
        featured: false,
        sizes: [
            { size: '5ml', price: 17.00, stock: 20 },
            { size: '10ml', price: 22.00, stock: 25 },
            { size: '20ml', price: 38.00, stock: 15 }
        ],
        specifications: new Map([
            ['Origin', 'Unknown'],
            ['Difficulty', 'Beginner'],
            ['Potency', 'High'],
            ['Growth Speed', 'Fast']
        ])
    },
    {
        name: 'Penis Envy',
        description: 'Highly sought-after strain known for its unique appearance and potency. Advanced cultivators only.',
        price: 35.00,
        category: 'spores',
        strain: 'Penis Envy',
        stock: 25,
        images: [{ url: '/assets/PENIS ENVY.png' }],
        featured: true,
        sizes: [
            { size: '5ml', price: 28.00, stock: 15 },
            { size: '10ml', price: 35.00, stock: 20 },
            { size: '20ml', price: 60.00, stock: 8 }
        ],
        specifications: new Map([
            ['Origin', 'Amazonian'],
            ['Difficulty', 'Advanced'],
            ['Potency', 'Very High'],
            ['Growth Speed', 'Slow']
        ])
    },
    {
        name: 'A+ Albinos',
        description: 'Beautiful albino variety with ghostly white caps. Stunning visual appeal and consistent growth.',
        price: 28.00,
        category: 'spores',
        strain: 'A+ Albino',
        stock: 30,
        images: [{ url: '/assets/A+ ALBINOS.jpg' }],
        featured: false,
        sizes: [
            { size: '5ml', price: 22.00, stock: 18 },
            { size: '10ml', price: 28.00, stock: 22 },
            { size: '20ml', price: 48.00, stock: 12 }
        ],
        specifications: new Map([
            ['Origin', 'Florida'],
            ['Difficulty', 'Intermediate'],
            ['Potency', 'High'],
            ['Growth Speed', 'Medium']
        ])
    },
    {
        name: 'Burma',
        description: 'Fast-growing strain from Myanmar. Known for large flushes and robust mycelium growth.',
        price: 24.00,
        category: 'spores',
        strain: 'Burma',
        stock: 45,
        images: [{ url: '/assets/burma mushrooms.jpg' }],
        featured: false,
        sizes: [
            { size: '5ml', price: 19.00, stock: 25 },
            { size: '10ml', price: 24.00, stock: 30 },
            { size: '20ml', price: 42.00, stock: 15 }
        ],
        specifications: new Map([
            ['Origin', 'Myanmar'],
            ['Difficulty', 'Beginner'],
            ['Potency', 'Moderate'],
            ['Growth Speed', 'Very Fast']
        ])
    },
    {
        name: 'Jedi Mind Fucks',
        description: 'Unique strain with an unforgettable name. Known for its mind-bending properties and research value.',
        price: 30.00,
        category: 'spores',
        strain: 'Jedi Mind Fucks',
        stock: 20,
        images: [{ url: '/assets/JEDI MIND FUCKS.webp' }],
        featured: true,
        sizes: [
            { size: '5ml', price: 24.00, stock: 12 },
            { size: '10ml', price: 30.00, stock: 15 },
            { size: '20ml', price: 52.00, stock: 8 }
        ],
        specifications: new Map([
            ['Origin', 'Unknown'],
            ['Difficulty', 'Advanced'],
            ['Potency', 'Very High'],
            ['Growth Speed', 'Medium']
        ])
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const createdProducts = await Product.insertMany(products);
        console.log(`Seeded ${createdProducts.length} products successfully`);

        // Display created products
        createdProducts.forEach(product => {
            console.log(`✓ ${product.name} - $${product.price} (Stock: ${product.stock})`);
        });

        console.log('\n🌱 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, products };
