// const express = require('express');
// const cors = require('cors');
// const menuRoutes = require('./routes/menuRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Log all incoming requests
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//     next();
// });

// app.use('/api/menu', menuRoutes);

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Menu routes
app.use('/api/menu', menuRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}`);
})
.on('error', (error) => {
    console.error('Server failed to start:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

