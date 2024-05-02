var express = require('express');
var router = express.Router();

router.get('/plantdetails', async (req, res) => {
    const plantid = req.query.plantid;
    console.log(plantid);
    try {
        const response = await fetch(`http://localhost:3000/api/plantdetails/${plantid}`);
        if (response.ok) {
            const plantDetails = await response.json();
            res.render('plantdetails', {plantDetails});
        } else {
            throw new Error('Failed to fetch plant data');
        }
  
    } catch (err) {
      console.error('Error while fetching data: ', err);
      res.render('error', { message: 'Failed to fetch plant data' });
    }
  });

  module.exports = router;