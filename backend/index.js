// backend/index.js
// Express.js backend for Mushroom Ecommerce

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// Try to connect to MongoDB, but continue without it if unavailable
let mongoConnected = false;
try {
    const connectDB = require('./config/database');
    const MongoStore = require('connect-mongo');

    // Attempt MongoDB connection
    connectDB().then(() => {
        mongoConnected = true;
        console.log('📊 MongoDB connected successfully');
    }).catch(err => {
        console.log('⚠️ MongoDB unavailable, using in-memory storage');
        console.log('To enable full database features, install and start MongoDB');
    });
} catch (error) {
    console.log('⚠️ MongoDB modules not available, using in-memory storage');
}

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
};

// Use MongoDB session store if available, otherwise use memory store
if (mongoConnected) {
    const MongoStore = require('connect-mongo');
    sessionConfig.store = MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/mushroom-ecommerce',
        touchAfter: 24 * 3600 // lazy session update
    });
}

app.use(session(sessionConfig));

// Import Routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    const mongoose = require('mongoose');
    const isMongoConnected = mongoose.connection.readyState === 1;

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: isMongoConnected ? 'MongoDB connected' : 'In-memory storage',
        mongodb: {
            connected: isMongoConnected,
            readyState: mongoose.connection.readyState,
            host: isMongoConnected ? mongoose.connection.host : null,
            name: isMongoConnected ? mongoose.connection.name : null
        },
        features: {
            products: 'Available (fallback data if no MongoDB)',
            cart: 'Available (session-based)',
            orders: 'Available (fallback storage)',
            payments: 'Available (test mode)'
        },
        version: '1.0.0'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});

// Graceful shutdown
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', err);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Frontend URL: ${process.env.CLIENT_URL}`);
    console.log(`💾 Storage: ${mongoConnected ? 'MongoDB' : 'In-memory'}`);
});
