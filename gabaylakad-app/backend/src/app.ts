import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import mainRoutes from './routes/mainRoutes';
import deviceRoutes from './routes/deviceRoutes';
import alertRoutes from './routes/alertRoutes';
import batteryRoutes from './routes/batteryRoutes';
import reflectorRoutes from './routes/reflectorRoutes';
import locationRoutes from './routes/locationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import sensorRoutes from './routes/sensorRoutes';
import legalRoutes from './routes/legalRoutes';
const app = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(morgan(':date[iso] :method :url :status :response-time ms'));
import { createServer } from 'http';
import { Server } from 'socket.io';
const server = createServer(app);
const io = new Server(server, {
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

app.use((req, res, next) => {
    if (req.path.startsWith('/socket.io')) {
        return next();
    }
    next();
});


app.post('/api/log', (req: Request, res: Response) => {
    const msg = req.body?.message || '[Frontend] No message';
    console.log('[FRONTEND LOG]', msg);
    res.status(200).json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/batteries', batteryRoutes);
app.use('/api/reflectors', reflectorRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard/sensor', sensorRoutes);
app.use('/api/legal', legalRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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

process.on('uncaughtException', (err) => {
    console.error('[UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('[UNHANDLED REJECTION]', reason);
});