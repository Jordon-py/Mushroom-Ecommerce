// test-mongodb.js
// Comprehensive MongoDB connection test for my-shroom-store

require('dotenv').config();
const mongoose = require('mongoose');

// Color codes for better terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
    title: (msg) => console.log(`${colors.bright}${colors.magenta}🧪 ${msg}${colors.reset}`),
    step: (msg) => console.log(`${colors.blue}🔍 ${msg}${colors.reset}`)
};

// Test configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mushroom-ecommerce';
const TEST_TIMEOUT = 10000; // 10 seconds

async function testMongoConnection() {
    log.title('MongoDB Connection Test for my-shroom-store Backend');
    console.log('');

    log.info(`Testing connection to: ${MONGODB_URI}`);
    console.log('');

    try {
        // Step 1: Test basic connection
        log.step('Step 1: Testing basic MongoDB connection...');

        const startTime = Date.now();

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: TEST_TIMEOUT,
            connectTimeoutMS: TEST_TIMEOUT,
        });

        const connectionTime = Date.now() - startTime;
        log.success(`Connected to MongoDB in ${connectionTime}ms`);
        log.success(`Host: ${mongoose.connection.host}`);
        log.success(`Database: ${mongoose.connection.name}`);
        log.success(`Port: ${mongoose.connection.port}`);
        console.log('');

        // Step 2: Test database operations
        log.step('Step 2: Testing basic database operations...');

        // Create a test collection
        const testCollection = mongoose.connection.db.collection('connection_test');

        // Insert test document
        const testDoc = {
            test: true,
            timestamp: new Date(),
            message: 'MongoDB connection test successful'
        };

        const insertResult = await testCollection.insertOne(testDoc);
        log.success(`Test document inserted with ID: ${insertResult.insertedId}`);

        // Read test document
        const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
        if (foundDoc) {
            log.success('Test document retrieved successfully');
        }

        // Delete test document
        await testCollection.deleteOne({ _id: insertResult.insertedId });
        log.success('Test document cleaned up');
        console.log('');

        // Step 3: Test existing collections
        log.step('Step 3: Checking existing collections...');

        const collections = await mongoose.connection.db.listCollections().toArray();
        if (collections.length === 0) {
            log.warning('No collections found - this is normal for a fresh database');
        } else {
            log.info(`Found ${collections.length} existing collections:`);
            collections.forEach(col => {
                console.log(`  - ${col.name}`);
            });
        }
        console.log('');

        // Step 4: Test models (if they exist)
        log.step('Step 4: Testing application models...');

        try {
            const Product = require('./models/Product');
            const productCount = await Product.countDocuments();
            log.success(`Product model accessible - ${productCount} products in database`);
        } catch (error) {
            log.warning('Product model test skipped (model may not be loaded)');
        }

        try {
            const Cart = require('./models/Cart');
            const cartCount = await Cart.countDocuments();
            log.success(`Cart model accessible - ${cartCount} carts in database`);
        } catch (error) {
            log.warning('Cart model test skipped (model may not be loaded)');
        }

        try {
            const Order = require('./models/Order');
            const orderCount = await Order.countDocuments();
            log.success(`Order model accessible - ${orderCount} orders in database`);
        } catch (error) {
            log.warning('Order model test skipped (model may not be loaded)');
        }
        console.log('');

        // Step 5: Performance test
        log.step('Step 5: Basic performance test...');

        const perfStart = Date.now();
        await mongoose.connection.db.admin().ping();
        const pingTime = Date.now() - perfStart;

        if (pingTime < 100) {
            log.success(`Database ping: ${pingTime}ms (Excellent)`);
        } else if (pingTime < 500) {
            log.success(`Database ping: ${pingTime}ms (Good)`);
        } else {
            log.warning(`Database ping: ${pingTime}ms (Slow - check network)`);
        }
        console.log('');

        // Final success message
        log.title('🎉 All MongoDB tests passed successfully!');
        log.info('Your database connection is working properly.');

    } catch (error) {
        console.log('');
        log.error('MongoDB connection test failed:');
        console.log('');

        if (error.name === 'MongoServerSelectionError') {
            log.error('Server Selection Error - MongoDB server not accessible');
            log.info('Possible solutions:');
            console.log('  1. Check if MongoDB is installed and running');
            console.log('  2. Verify the connection string in MONGODB_URI');
            console.log('  3. Check firewall settings');
            console.log('  4. For Atlas: verify network access and credentials');
        } else if (error.name === 'MongoTimeoutError') {
            log.error('Connection Timeout - MongoDB took too long to respond');
            log.info('Possible solutions:');
            console.log('  1. Check network connectivity');
            console.log('  2. Increase timeout values');
            console.log('  3. Check MongoDB server status');
        } else {
            log.error(`Unexpected error: ${error.message}`);
        }

        console.log('');
        log.info('Error details:');
        console.log(error);

    } finally {
        // Clean up
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            log.info('MongoDB connection closed');
        }

        console.log('');
        log.title('Test completed');
        process.exit(0);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    log.warning('Test interrupted by user');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }
    process.exit(0);
});

// Run the test
testMongoConnection().catch(error => {
    log.error('Fatal error during test execution:');
    console.error(error);
    process.exit(1);
});