const express = require('express');
const {getPlantDetailsByPlantId} = require("../controllers/plantDetailsController");
const router = express.Router();


router.get('/:plantid', getPlantDetailsByPlantId);

module.exports = router;
