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

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan(':date[iso] :method :url :status :response-time ms'));


// Endpoint to log frontend errors/messages to backend terminal
app.post('/api/log', (req: Request, res: Response) => {
    const msg = req.body?.message || '[Frontend] No message';
    console.log('[FRONTEND LOG]', msg);
    res.status(200).json({ status: 'ok' });
});


// Dashboard card endpoints (dummy data)
// Dashboard card endpoints now use real RESTful routes/controllers
// For dashboard, frontend should call /api/devices, /api/batteries, /api/locations, /api/reflectors, /api/alerts, etc.
// TODO: Integrate with IoT device data stream for live dashboard updates

app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/batteries', batteryRoutes);
app.use('/api/reflectors', reflectorRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/dashboard', dashboardRoutes);

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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});