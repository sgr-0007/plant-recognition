var express = require('express');
var router = express.Router();
const plantsController = require('../controllers/plantController');
const multer = require('multer');
const fs = require('fs');
// const upload = multe;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var directory = 'public/images_dynamic/uploads/';
    fs.access(directory, function(error){
      // If directory is not already created
      if(error){
        fs.mkdir(directory, { recursive: true }, function(error){
          if(error){
            console.error('Error creating directory: ',error);
          } else{
            console.log('Directory created successfully');
            cb(null, directory);
          }
        });
      } else{
        //Directory already exists
        cb(null, directory);
      }
    });
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    // Make the file name the date + the file extension
    filename =  Date.now() + '.' + file_extension[file_extension.length-1];
    console.log(filename);
    cb(null, filename);
  }
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    // const plants = await plantsController.getAllPlantsHomepage(req, res);
    var plants = []
    res.render('index', { plants });
  } catch (err) {
    console.error('Error while fetching data:', err);
    res.render('error', { message: 'Failed to fetch plant data' });
  }
});



/* GET home page. */
router.get('/api/plants', async (req, res) => {
  try {
    // Mimicking the structure of an Express middleware using controllers
    await plantsController.getAllPlants(req, res);
  } catch (err) {
    console.error('Error while fetching data:', err);
    res.render('error', { message: 'Failed to fetch plant data' });
  }
});

router.get('/api/plant', async (req, res) => {
  const plantid = req.query.plantid;
  req.params.plantid = plantid;  // Setting up params as it is used by the controller method
  try {
    await plantsController.getPlantById(req, res);
  } catch (err) {
    console.error('Error while fetching plant details:', err);
    res.render('error', { message: 'Failed to fetch plant details' });
  }
});

// POST route for creating a new plant
router.post('/api/plantCreate', upload.single('image'), async (req, res) => {
  try {
    // console.log(req.body);  // Log text data
    // console.log(req.file);  // Log file data
    await plantsController.createPlant(req, res);
  } catch (err) {
    console.error('Error while creating plant:', err);
    res.status(500).render('error', { message: 'Failed to create plant' });
  }
});

// POST route for adding plant identification to the plantid
router.post('/api/:plantid/plantIdentification', async(req, res)=>{
  try {
    const plantIdentification = await plantsController.postPlantIdentification(req, res);
    console.log(plantIdentification);
  } catch (error) {
    console.error('Error posting plant identification', err);
    res.render('error', { message: 'Failed to post plant identification' });
  }
});

module.exports = router;
