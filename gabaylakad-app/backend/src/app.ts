import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import mainRoutes from './routes/mainRoutes';

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
app.get('/api/dashboard/location', (req, res) => {
    res.json({ location: 'Unknown', lat: 0, lng: 0 });
});
app.get('/api/dashboard/battery', (req, res) => {
    res.json({ battery: '100%', status: 'Full' });
});
app.get('/api/dashboard/activity', (req, res) => {
    res.json({ activity: 'Inactive', lastActive: 'Never' });
});
app.get('/api/dashboard/emergency', (req, res) => {
    res.json({ emergency: false, lastTriggered: null });
});
app.get('/api/dashboard/nightreflector', (req, res) => {
    res.json({ nightReflector: 'Off', lastChanged: null });
});
app.get('/api/dashboard/activitylog', (req, res) => {
    res.json({ logs: [] });
});

app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);

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