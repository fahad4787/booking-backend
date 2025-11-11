const express = require('express');
const { configureApp, ensureDatabaseInitialized } = require('./lib/expressApp');
const app = configureApp(express());
const PORT = process.env.PORT || 3000;

// Initialize database and start server
async function startServer() {
  try {
    await ensureDatabaseInitialized();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
