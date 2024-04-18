var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5000/api/plants');
    if (response.ok) {
      const plants = await response.json();
      res.render('index', { plants });
    } else {
      throw new Error('Failed to fetch plant data');
    }
  } catch (err) {
    console.error('Error while fetching data: ', err);
    res.render('error', { message: 'Failed to fetch plant data' });
  }
});

router.get('/plantdetails', async (req, res) => {
  const plantData =
    {
      plantdetailid: 2,
      height: 50,
      spread: 30,
      has_flowers: false,
      has_leaves: true,
      has_fruitsorseeds: true,
      flower_color: 'Blue',
      plantid: 567,
      date_time_plant_seen: new Date('2024-04-15T15:00:00'), // Example date
    }
    const plantid = 844;
  try {
      const response = await fetch(`http://localhost:5000/api/plant_details/${plantid}`);
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
