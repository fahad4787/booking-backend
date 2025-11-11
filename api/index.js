// Vercel Express preset requires express to be imported in the entrypoint.
// eslint-disable-next-line no-unused-vars
const express = require('express');
const { app, ensureDatabaseInitialized } = require('../lib/expressApp');

let isReady = false;

module.exports = async function handler(req, res) {
  try {
    if (!isReady) {
      await ensureDatabaseInitialized();
      isReady = true;
    }

    return app(req, res);
  } catch (error) {
    console.error('API handler initialization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

