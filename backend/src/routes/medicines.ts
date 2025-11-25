import { Router } from 'express';
import { medicines } from '../data/mockData';

const router = Router();

// GET all medicines
router.get('/', (req, res) => {
    res.json(medicines);
});

// POST create medicine
router.post('/', (req, res) => {
    const newMedicine = {
        ...req.body,
        id: `M${String(medicines.length + 1).padStart(3, '0')}`
    };
    medicines.push(newMedicine);
    res.status(201).json(newMedicine);
});

// PUT update medicine
router.put('/:id', (req, res) => {
    const index = medicines.findIndex(m => m.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Medicine not found' });
    }
    medicines[index] = { ...medicines[index], ...req.body };
    res.json(medicines[index]);
});

// PATCH update medicine stock
router.patch('/:id/stock', (req, res) => {
    const { change } = req.body;
    const index = medicines.findIndex(m => m.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Medicine not found' });
    }

    medicines[index].stock = Math.max(0, medicines[index].stock + change);
    res.json(medicines[index]);
});

// DELETE medicine
router.delete('/:id', (req, res) => {
    const index = medicines.findIndex(m => m.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Medicine not found' });
    }
    medicines.splice(index, 1);
    res.status(204).send();
});

export default router;
