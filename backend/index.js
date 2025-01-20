const express = require('express');
const config = require('./src/config');
const routes = require('./src/routes');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware for configuration and CORS
app.use(config);
app.use(cors());

// Inject `io` into requests for real-time communication
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Static file serving
app.use('/static', express.static(path.join(__dirname, 'src/public')));

// Routes
app.use('/api', routes);

// Frontend entry point
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});