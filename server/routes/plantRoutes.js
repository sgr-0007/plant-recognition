const express = require('express');
const plantController = require('../controllers/plantController');

const router = express.Router();

router.post('/', plantController.createPlant);

router.get('/', plantController.getAllPlants);

router.get('/:plantid', plantController.getPlantById);

module.exports = router;