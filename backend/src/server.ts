import express from 'express';
import cors from 'cors';
import patientsRouter from './routes/patients';
import queueRouter from './routes/queue';
import medicinesRouter from './routes/medicines';
import prescriptionsRouter from './routes/prescriptions';
import medicalRecordsRouter from './routes/medicalRecords';
import staffRouter from './routes/staff';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/patients', patientsRouter);
app.use('/api/queue', queueRouter);
app.use('/api/medicines', medicinesRouter);
app.use('/api/prescriptions', prescriptionsRouter);
app.use('/api/medical-records', medicalRecordsRouter);
app.use('/api/staff', staffRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Sentosa Health Hub API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
