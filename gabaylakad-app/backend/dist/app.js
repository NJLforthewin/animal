"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// --- Socket.IO Real-time Location Setup ---
// ...existing code...
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mainRoutes_1 = __importDefault(require("./routes/mainRoutes"));
const deviceRoutes_1 = __importDefault(require("./routes/deviceRoutes"));
const alertRoutes_1 = __importDefault(require("./routes/alertRoutes"));
const batteryRoutes_1 = __importDefault(require("./routes/batteryRoutes"));
const reflectorRoutes_1 = __importDefault(require("./routes/reflectorRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const app = (0, express_1.default)();
// Only allow frontend origin for Socket.IO and REST
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use((0, cors_1.default)({ origin: allowedOrigin, credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)(':date[iso] :method :url :status :response-time ms'));
// --- Socket.IO Real-time Location Setup ---
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log('Socket.IO client connected:', socket.id);
    socket.on('error', (err) => {
        console.error('[Socket.IO] Client error:', err);
    });
    socket.on('disconnect', (reason) => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}, reason: ${reason}`);
    });
});
app.set('io', io);
// Prevent Express middleware from interfering with Socket.IO
app.use((req, res, next) => {
    if (req.path.startsWith('/socket.io')) {
        return next();
    }
    next();
});
// Endpoint to log frontend errors/messages to backend terminal
app.post('/api/log', (req, res) => {
    var _a;
    const msg = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.message) || '[Frontend] No message';
    console.log('[FRONTEND LOG]', msg);
    res.status(200).json({ status: 'ok' });
});
// Dashboard card endpoints (dummy data)
// Dashboard card endpoints now use real RESTful routes/controllers
// For dashboard, frontend should call /api/devices, /api/batteries, /api/locations, /api/reflectors, /api/alerts, etc.
// TODO: Integrate with IoT device data stream for live dashboard updates
app.use('/api/auth', authRoutes_1.default);
app.use('/api', mainRoutes_1.default);
app.use('/api/devices', deviceRoutes_1.default);
app.use('/api/alerts', alertRoutes_1.default);
app.use('/api/batteries', batteryRoutes_1.default);
app.use('/api/reflectors', reflectorRoutes_1.default);
app.use('/api/locations', locationRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Express + Socket.IO server running on port ${PORT}`);
});
// Robust error logging for silent backend failures
process.on('uncaughtException', (err) => {
    console.error('[UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('[UNHANDLED REJECTION]', reason);
});
