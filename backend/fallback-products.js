// fallback-products.js
// Fallback product data for when MongoDB is not available

const fallbackProducts = [
    {
        _id: '1',
        name: 'Golden Teacher Spores',
        description: 'Classic strain perfect for beginners. Known for its golden caps and educational growing experience.',
        price: 25.99,
        category: 'spores',
        strain: 'Golden Teacher',
        stock: 50,
        images: [{ url: '/assets/golden-teacher.jpg' }],
        featured: true,
        active: true,
        createdAt: new Date('2024-01-15'),
        specifications: {
            difficulty: 'Beginner',
            potency: 'Medium',
            origin: 'Colombia'
        }
    },
    {
        _id: '2',
        name: 'Blue Meanie Spores',
        description: 'Potent strain with distinctive blue bruising. Fast colonization and heavy yields.',
        price: 32.99,
        category: 'spores',
        strain: 'Blue Meanie',
        stock: 30,
        images: [{ url: '/assets/blue-meanie.jpg' }],
        featured: true,
        active: true,
        createdAt: new Date('2024-01-20'),
        specifications: {
            difficulty: 'Intermediate',
            potency: 'High',
            origin: 'Australia'
        }
    },
    {
        _id: '3',
        name: 'Penis Envy Spores',
        description: 'Unique appearance with thick stems and small caps. One of the most sought-after strains.',
        price: 45.99,
        category: 'spores',
        strain: 'Penis Envy',
        stock: 20,
        images: [{ url: '/assets/penis-envy.jpg' }],
        featured: true,
        active: true,
        createdAt: new Date('2024-01-25'),
        specifications: {
            difficulty: 'Advanced',
            potency: 'Very High',
            origin: 'USA'
        }
    },
    {
        _id: '4',
        name: 'Beginner Grow Kit',
        description: 'Complete kit with everything needed to start growing. Includes substrate, spores, and instructions.',
        price: 89.99,
        category: 'growkits',
        stock: 15,
        images: [{ url: '/assets/grow-kit.jpg' }],
        featured: false,
        active: true,
        createdAt: new Date('2024-02-01'),
        specifications: {
            includes: 'Substrate, Spores, Instructions, Spray Bottle',
            difficulty: 'Beginner',
            yield: '100-200g fresh'
        }
    },
    {
        _id: '5',
        name: 'Sterilized Substrate',
        description: 'Pre-sterilized growing medium ready for inoculation. Made from organic materials.',
        price: 19.99,
        category: 'supplies',
        stock: 40,
        images: [{ url: '/assets/substrate.jpg' }],
        featured: false,
        active: true,
        createdAt: new Date('2024-02-05'),
        specifications: {
            volume: '2.5 lbs',
            sterilized: true,
            ingredients: 'Vermiculite, Brown Rice Flour, Water'
        }
    }
];

// Simulate async database operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FallbackProductService {

    static async find(filter = {}, options = {}) {
        await delay(100); // Simulate database delay

        let products = [...fallbackProducts];

        // Apply filters
        if (filter.active !== undefined) {
            products = products.filter(p => p.active === filter.active);
        }

        if (filter.category) {
            products = products.filter(p => p.category === filter.category);
        }

        if (filter.featured !== undefined) {
            products = products.filter(p => p.featured === filter.featured);
        }

        if (filter.$text && filter.$text.$search) {
            const searchTerm = filter.$text.$search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.strain?.toLowerCase().includes(searchTerm)
            );
        }

        if (filter.price) {
            if (filter.price.$gte) {
                products = products.filter(p => p.price >= filter.price.$gte);
            }
            if (filter.price.$lte) {
                products = products.filter(p => p.price <= filter.price.$lte);
            }
        }

        // Apply sorting
        if (options.sort) {
            const sortField = Object.keys(options.sort)[0];
            const sortOrder = options.sort[sortField];

            products.sort((a, b) => {
                if (sortField === 'price') {
                    return sortOrder === 1 ? a.price - b.price : b.price - a.price;
                }
                if (sortField === 'createdAt') {
                    return sortOrder === 1 ?
                        new Date(a.createdAt) - new Date(b.createdAt) :
                        new Date(b.createdAt) - new Date(a.createdAt);
                }
                if (sortField === 'name') {
                    return sortOrder === 1 ?
                        a.name.localeCompare(b.name) :
                        b.name.localeCompare(a.name);
                }
                return 0;
            });
        }

        // Apply pagination
        const skip = options.skip || 0;
        const limit = options.limit || products.length;

        return products.slice(skip, skip + limit);
    }

    static async findById(id) {
        await delay(50);
        return fallbackProducts.find(p => p._id === id) || null;
    }

    static async countDocuments(filter = {}) {
        await delay(30);
        const products = await this.find(filter);
        return products.length;
    }

    static async create(productData) {
        await delay(100);
        const newProduct = {
            _id: (fallbackProducts.length + 1).toString(),
            ...productData,
            createdAt: new Date(),
            active: true
        };
        fallbackProducts.push(newProduct);
        return newProduct;
    }

    static async findByIdAndUpdate(id, update, options = {}) {
        await delay(100);
        const productIndex = fallbackProducts.findIndex(p => p._id === id);

        if (productIndex === -1) {
            return null;
        }

        fallbackProducts[productIndex] = {
            ...fallbackProducts[productIndex],
            ...update,
            updatedAt: new Date()
        };

        return fallbackProducts[productIndex];
    }

    static async findByIdAndDelete(id) {
        await delay(100);
        const productIndex = fallbackProducts.findIndex(p => p._id === id);

        if (productIndex === -1) {
            return null;
        }

        const deletedProduct = fallbackProducts[productIndex];
        fallbackProducts.splice(productIndex, 1);
        return deletedProduct;
    }

    // Get featured products
    static async getFeatured(limit = 3) {
        await delay(50);
        return fallbackProducts
            .filter(p => p.featured && p.active)
            .slice(0, limit);
    }

    // Get products by category
    static async getByCategory(category, limit = 10) {
        await delay(50);
        return fallbackProducts
            .filter(p => p.category === category && p.active)
            .slice(0, limit);
    }

    // Search products
    static async search(query, limit = 10) {
        await delay(100);
        const searchTerm = query.toLowerCase();
        return fallbackProducts
            .filter(p =>
                p.active && (
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm) ||
                    p.strain?.toLowerCase().includes(searchTerm)
                )
            )
            .slice(0, limit);
    }
}

module.exports = { fallbackProducts, FallbackProductService };
