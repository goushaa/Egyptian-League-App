const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { wss } = require('./broadcast');
const authRoutes = require('./routes/authRouter');
const matchRoutes = require('./routes/matchRouter');
const stadiumRoutes = require('./routes/stadiumRouter');
const userRoutes = require('./routes/userRouter');
const ticketRoutes = require('./routes/ticketRouter');
const teamRoutes = require('./routes/teamRouter');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Enable CORS
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/teams', teamRoutes);

// Database Connection
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));

// Create HTTP server
const server = http.createServer(app);

// Handle WebSocket server upgrade
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start Server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
