import { Router } from 'express';
import { staff } from '../data/mockData';

const router = Router();

// GET all staff
router.get('/', (req, res) => {
    res.json(staff);
});

// POST create staff
router.post('/', (req, res) => {
    const newStaff = {
        ...req.body,
        id: `S${String(staff.length + 1).padStart(3, '0')}`
    };
    staff.push(newStaff);
    res.status(201).json(newStaff);
});

// PUT update staff
router.put('/:id', (req, res) => {
    const index = staff.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Staff not found' });
    }
    staff[index] = { ...staff[index], ...req.body };
    res.json(staff[index]);
});

// PATCH update staff status
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    const index = staff.findIndex(s => s.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Staff not found' });
    }

    staff[index].status = status;
    res.json(staff[index]);
});

// DELETE staff
router.delete('/:id', (req, res) => {
    const index = staff.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Staff not found' });
    }
    staff.splice(index, 1);
    res.status(204).send();
});

export default router;
