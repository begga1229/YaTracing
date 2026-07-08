import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import db from './config/database.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/auth.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Team from './models/Team.js';
import Material from './models/Material.js';
import Equipment from './models/Equipment.js';
import Report from './models/Report.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('project:update', (data) => {
    io.emit('project:updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

// Database Sync
const syncDatabase = async () => {
  try {
    await db.authenticate();
    console.log('Database connected successfully');
    await db.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;

syncDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 WebSocket ready on ws://localhost:${PORT}`);
  });
});

export { io };