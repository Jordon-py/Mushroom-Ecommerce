const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Set connection timeout to fail faster
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mushroom-ecommerce', {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        return true;

    } catch (error) {
        // Don't exit process, let the app continue with in-memory storage
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
};

module.exports = connectDB;
