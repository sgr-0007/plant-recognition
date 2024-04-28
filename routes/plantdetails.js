var express = require('express');
var router = express.Router();
const plantsController = require('../controllers/plantController');

router.get('/:plantid', async (req, res) => {
    try {
        const plantDetails = await plantsController.getPlantById(req, res);
        console.log(plantDetails);    
      } catch (err) {
        console.error('Error while fetching data:', err);
        res.render('error', { message: 'Failed to fetch plant data' });
      }
  });

  module.exports = router;