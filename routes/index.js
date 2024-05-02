var express = require('express');
var router = express.Router();
const plantsController = require('../controllers/plantController');
const multer = require('multer');
const fs = require('fs');
const {getSortedPlants, searchPlant} = require("../controllers/plantController");

// const { fetchPlantDetails } = require('../public/util/dbpedia');



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

// Assuming Express is already set up and running

// Dynamic plant details route


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

router.get('/api/plants/sorted', getSortedPlants);


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

router.get('/api/plants/dbsearch', async (req, res) => {
  // Retrieve plant name from query string
  const plantName = req.query.name;
  if (!plantName) {
    return res.status(400).json({ error: 'Plant name is required' });
  }

  // The DBpedia SPARQL endpoint URL
  const endpointUrl = 'https://dbpedia.org/sparql';

  // The SPARQL query to retrieve data for the given plant
  const sparqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?label ?description
    WHERE {
      <http://dbpedia.org/resource/${encodeURIComponent(plantName)}> rdfs:label ?label .
      <http://dbpedia.org/resource/${encodeURIComponent(plantName)}> dbo:abstract ?description .
      FILTER (langMatches(lang(?label), "en") && langMatches(lang(?description), "en"))
    } LIMIT 1`;

  // Encode the query as a URL parameter
  const encodedQuery = encodeURIComponent(sparqlQuery);

  // Build the URL for the SPARQL query
  const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

  try {
    // Use fetch to retrieve the data
    const response = await fetch(url);
    const data = await response.json();

    // The results are in the 'data' object
    if (data.results.bindings.length > 0) {
      const bindings = data.results.bindings[0];
      res.json({
        label: bindings.label.value,
        description: bindings.description.value
      });
    } else {
      res.status(404).json({
        label: 'No data found',
        description: 'No description available'
      });
    }
  } catch (error) {
    console.error('Error fetching plant data from DBpedia', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


module.exports = router;
