const Plant = require('../models/plant');

exports.createPlant = async (req, res) => {
    try {
        const plant = await Plant.create(req.body);
        res.status(201).json(plant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPlantById = async (req, res) => {
    try {
        const { plantid } = req.params;
        const plant = await Plant.findOne({ _id: plantid });
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.json(plant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};