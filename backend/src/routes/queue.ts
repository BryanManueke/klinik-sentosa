import { Router } from 'express';
import { queue, patients } from '../data/mockData';

const router = Router();

// GET all queue items
router.get('/', (req, res) => {
    res.json(queue);
});

// GET queue by patient ID
router.get('/patient/:patientId', (req, res) => {
    const patientQueue = queue.filter(q => q.patientId === req.params.patientId);
    res.json(patientQueue);
});

// POST add to queue
router.post('/', (req, res) => {
    const { patientId, doctorName, complaint } = req.body;
    const patient = patients.find(p => p.id === patientId);

    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }

    const newItem = {
        id: `Q${String(queue.length + 1).padStart(3, '0')}`,
        patientId,
        patientName: patient.name,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'waiting' as const,
        doctor: doctorName,
        complaint
    };

    queue.push(newItem);
    res.status(201).json(newItem);
});

// PATCH update queue status
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    const index = queue.findIndex(q => q.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Queue item not found' });
    }

    queue[index].status = status;
    res.json(queue[index]);
});

export default router;
