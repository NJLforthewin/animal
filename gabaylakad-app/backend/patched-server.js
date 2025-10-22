

// PATCHED: Start from minimal Socket.IO server and reintroduce backend features step by step.
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Add routes after app is initialized
try {
  const authRoutes = require('./dist/routes/authRoutes').default;
  app.use('/api/auth', authRoutes);
  console.log('Added /api/auth route');
} catch (e) {
  console.error('Failed to add /api/auth route:', e.message);
}

try {
  const mainRoutes = require('./dist/routes/mainRoutes').default;
  app.use('/api', mainRoutes);
  console.log('Added /api route');
} catch (e) {
  console.error('Failed to add /api route:', e.message);
}

try {
  const deviceRoutes = require('./dist/routes/deviceRoutes').default;
  app.use('/api/devices', deviceRoutes);
  console.log('Added /api/devices route');
} catch (e) {
  console.error('Failed to add /api/devices route:', e.message);
}

try {
  const alertRoutes = require('./dist/routes/alertRoutes').default;
  app.use('/api/alerts', alertRoutes);
  console.log('Added /api/alerts route');
} catch (e) {
  console.error('Failed to add /api/alerts route:', e.message);
}

try {
  const batteryRoutes = require('./dist/routes/batteryRoutes').default;
  app.use('/api/batteries', batteryRoutes);
  console.log('Added /api/batteries route');
} catch (e) {
  console.error('Failed to add /api/batteries route:', e.message);
}

try {
  const reflectorRoutes = require('./dist/routes/reflectorRoutes').default;
  app.use('/api/reflectors', reflectorRoutes);
  console.log('Added /api/reflectors route');
} catch (e) {
  console.error('Failed to add /api/reflectors route:', e.message);
}

try {
  const locationRoutes = require('./dist/routes/locationRoutes').default;
  app.use('/api/locations', locationRoutes);
  console.log('Added /api/locations route');
} catch (e) {
  console.error('Failed to add /api/locations route:', e.message);
}

try {
  const dashboardRoutes = require('./dist/routes/dashboardRoutes').default;
  app.use('/api/dashboard', dashboardRoutes);
  console.log('Added /api/dashboard route');
} catch (e) {
  console.error('Failed to add /api/dashboard route:', e.message);
}


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Socket.IO client connected:', socket.id);
});

// STEP 1: Add a simple REST endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});



server.listen(5000, () => {
  console.log('Patched server running on port 5000');
});
