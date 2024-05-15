var express = require('express');
var router = express.Router();
const plantsController = require('../controllers/plantController');

router.get('/:plantid', async (req, res) => {
    try {
        const plantDetails = await plantsController.getPlantById(req, res);
        console.log('router plant details');    
        console.log(plantDetails);    
      } catch (err) {
        console.error('Error while fetching data:', err);
        res.render('error', { message: 'Failed to fetch plant data' });
      }
  });

  router.post('/:plantid/comments', async (req, res) => {
    try {
      await plantsController.addComment(req, res);
    } catch (err) {
      console.error('Error while commenting:', err);
      res.status(500).render('error', { message: 'Failed to add your comment' });
    }
  });

  router.get('/:plantid/comments', async (req, res) => {
    try {

      await plantsController.getComments(req, res);
    } catch (err) {
      console.error('Error while commenting:', err);
      res.status(500).render('error', { message: 'Failed to add your comment' });
    }
  });



  module.exports = router;