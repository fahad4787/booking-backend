const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './config.env' });

const bookingRoutes = require('../routes/booking');
const ordersRoutes = require('../routes/orders');
const { initializeDatabase, testConnection } = require('../config/database');

function configureApp(app) {
  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Routes
  app.get('/', async (req, res) => {
    try {
      const dbHealthy = await testConnection();
      res.json({
        status: 'OK',
        message: 'Booking backend is running on Vercel',
        database: dbHealthy ? 'connected' : 'unavailable'
      });
    } catch (error) {
      console.error('Root status check failed:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Booking backend encountered an issue',
        details: error.message
      });
    }
  });

  app.use('/api/booking', bookingRoutes);
  app.use('/api/orders', ordersRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Shopify Booking API is running' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Something went wrong!',
      message: err.message
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}

async function ensureDatabaseInitialized() {
  await initializeDatabase();
}

module.exports = {
  configureApp,
  ensureDatabaseInitialized
};

