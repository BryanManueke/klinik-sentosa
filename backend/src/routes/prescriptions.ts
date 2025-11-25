import { Router } from 'express';
import { prescriptions, medicines } from '../data/mockData';

const router = Router();

// GET all prescriptions
router.get('/', (req, res) => {
    res.json(prescriptions);
});

// GET prescriptions by patient ID
router.get('/patient/:patientId', (req, res) => {
    const patientPrescriptions = prescriptions.filter(p => p.patientId === req.params.patientId);
    res.json(patientPrescriptions);
});

// POST create prescription
router.post('/', (req, res) => {
    const { patientId, patientName, doctorName, items } = req.body;

    const totalPrice = items.reduce((sum: number, item: any) => {
        const med = medicines.find(m => m.id === item.medicineId);
        return sum + (med ? med.price * item.amount : 0);
    }, 0);

    const newPrescription = {
        id: `RX${String(prescriptions.length + 1).padStart(3, '0')}`,
        patientId,
        patientName,
        doctorName,
        items,
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        totalPrice
    };

    prescriptions.push(newPrescription);
    res.status(201).json(newPrescription);
});

// PATCH process prescription
router.patch('/:id/process', (req, res) => {
    const index = prescriptions.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Prescription not found' });
    }

    const prescription = prescriptions[index];

    // Update medicine stock
    prescription.items.forEach(item => {
        const medIndex = medicines.findIndex(m => m.id === item.medicineId);
        if (medIndex !== -1) {
            medicines[medIndex].stock = Math.max(0, medicines[medIndex].stock - item.amount);
        }
    });

    prescription.status = 'processed';
    res.json(prescription);
});

// PATCH pay prescription
router.patch('/:id/pay', (req, res) => {
    const index = prescriptions.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Prescription not found' });
    }

    prescriptions[index].status = 'paid';
    res.json(prescriptions[index]);
});

export default router;
