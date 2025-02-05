var express = require('express');
var config = require('./src/config');
var routes = require('./src/routes');
const path = require('path');
const app = express();



var cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Replace with your Angular app's URL
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
});

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(config);
app.use(cors());

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('uploadProgress', (data) => { 
    console.log(data)
    callback({
      status: "ok"
    });
  });  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


app.use("/api", routes);

app.get('/*', (req, res) => {
  res.sendFile('./src/views/index.html', { root: __dirname });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });
  return;
});

server.listen(process.env.PORT, () => {
  console.log("Running in Port:" + process.env.PORT);
});