// routes/plantRoutes.js
const express = require('express');
const Plant = require('../models/plant');

const router = express.Router();

// Route for creating a new plant
router.post('/', async (req, res) => {
    try {
        const plant = await Plant.create(req.body);
        res.status(201).json(plant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route for getting all plants
router.get('/', async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:plantid', async (req, res) => {
    try {
        const { plantid } = req.params;
        const plant = await Plant.findOne({ plantid });
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.json(plant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
