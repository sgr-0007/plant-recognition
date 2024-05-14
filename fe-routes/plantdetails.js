var express = require('express');
const {searchPlant} = require("../controllers/plantController");
var router = express.Router();


function capitalizeFirstLetter(string) {
    if (string.length === 0) {
        return ''; // Return an empty string if the input is empty
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

router.get('/dbsearch', searchPlant);

router.get('/plantdetails', async (req, res) => {
    const plantid = req.query.plantid;
    console.log(plantid);
    try {
        const response = await fetch(`http://localhost:3000/api/plantdetails/${plantid}`);
        if (response.ok) {
            const plantDetails = await response.json();
            responseTwo = await fetch(`http://localhost:3000/plantdetails/dbsearch?name=${capitalizeFirstLetter(plantDetails.name)}`)
            const plantDetailsDB = await responseTwo.json();
            res.render('plantdetails', {plantDetails, plantDetailsDB});
        } else {
            throw new Error('Failed to fetch plant data');
        }
  
    } catch (err) {
      console.error('Error while fetching data: ', err);
      res.render('error', { message: 'Failed to fetch plant data' });
    }
  });

  module.exports = router;