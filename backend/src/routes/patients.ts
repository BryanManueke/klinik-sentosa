import { Router } from 'express';
import { patients } from '../data/mockData';

const router = Router();

// GET all patients
router.get('/', (req, res) => {
    res.json(patients);
});

// GET patient by ID
router.get('/:id', (req, res) => {
    const patient = patients.find(p => p.id === req.params.id);
    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
});

// POST create patient
router.post('/', (req, res) => {
    const newPatient = {
        ...req.body,
        id: `P${String(patients.length + 1).padStart(3, '0')}`
    };
    patients.push(newPatient);
    res.status(201).json(newPatient);
});

// PUT update patient
router.put('/:id', (req, res) => {
    const index = patients.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    patients[index] = { ...patients[index], ...req.body };
    res.json(patients[index]);
});

// DELETE patient
router.delete('/:id', (req, res) => {
    const index = patients.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    patients.splice(index, 1);
    res.status(204).send();
});

export default router;
