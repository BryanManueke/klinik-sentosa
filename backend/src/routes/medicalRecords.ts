import { Router } from 'express';
import { medicalRecords } from '../data/mockData';

const router = Router();

// GET all medical records
router.get('/', (req, res) => {
    const { patientId } = req.query;

    if (patientId) {
        const records = medicalRecords.filter(r => r.patientId === patientId);
        return res.json(records);
    }

    res.json(medicalRecords);
});

// POST create medical record
router.post('/', (req, res) => {
    const newRecord = {
        ...req.body,
        id: `MR${String(medicalRecords.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0]
    };

    medicalRecords.push(newRecord);
    res.status(201).json(newRecord);
});

export default router;
