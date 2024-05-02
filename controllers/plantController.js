const Plant = require("../models/plant");

exports.createPlant = async (req, res) => {
  // console.log("Received form data:", req.body);  // Should now log correct data
  // console.log("Received file:", req.file);      // Should log file info

  // console.log('plant controller')
  const {
    name, 
    dateTimeSeen: date_time_plant_seen, // Map the correct property to your variable
    description, 
    createdby,
    latitude, 
    longitude, 
    height, 
    spread, 
    flowerColor: flower_color, // Adjust this as well if you want to maintain your variable naming convention
    hasFlowers: has_flowers, // Adjust this to correctly map
    hasLeaves: has_leaves, // Adjust this to correctly map
    hasFruitsOrSeeds: has_fruitsorseeds // Correct the mapping
  } = req.body;

  // console.log("Received form data:", req.body); 

  // console.log('has_fruitsorseeds:', has_fruitsorseeds);  // Check the value
  // console.log('Type of has_fruitsorseeds:', typeof has_fruitsorseeds);  // Check the type

  const plantid = generateRandomID();
  const createddate = new Date();
  var image = req.file.path;

// Remove 'public\' from the filePath
  image = image.replace('public\\', '');
  // console.log(image)

  try {
    const newPlant = new Plant({
      plantid, name, description, image, latitude, longitude, createdby,
      createddate, height, spread, has_flowers,
      has_leaves, has_fruitsorseeds: has_fruitsorseeds == 'true',
      flower_color, date_time_plant_seen
    });

    await newPlant.save();

    res.redirect("/");  // Adjust as necessary for your URL structure
  } catch (error) {
    console.error("Error creating plant:", error);
    res.status(400).json({ message: "Failed to create plant" });
  }
};

function generateRandomID() {
  return Math.floor(Math.random() * 1000000).toString();  // Ensures a more unique ID
}

exports.getAllPlantsHomepage = async (req, res) => {
  try {
    const plants = await Plant.find();  // Example, assuming Plant is your Mongoose model
    // return plants;  // Return the data to be used by the caller
    // res.json({plants})
    return [];
  } catch (error) {
    console.error('Error fetching plants:', error);
    throw error;  // Throw the error to be handled by the caller
  }
};

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();  // Example, assuming Plant is your Mongoose model
    // return plants;  // Return the data to be used by the caller
    res.json({ plants })
  } catch (error) {
    console.error('Error fetching plants:', error);
    throw error;  // Throw the error to be handled by the caller
  }
};

exports.getPlantById = async (req, res) => {
  const { plantid } = req.params;
  try {
    console.log("Plant ID:", plantid);
    const plant = await Plant.findOne({ plantid });
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.json(plant);
    // return json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postPlantIdentification = async (req, res) => {
  const { plantid } = req.params;
  const { suggestedname, identifiedby } = req.body;
  try {
    console.log("Plant ID for identification: ", plantid);
    console.log("Plant identification details: ", suggestedname, ", ",identifiedby);
    const plant = await Plant.findOne({ plantid });

    if(!plant){
      return res.status(404).json({ error: 'Plant not found' });
    }

    const newIdentification = {
      plantidentificationid: generateRandomID(),
      suggestedname,
      identifiedby,
    };

    plant.identifications.push(newIdentification);
    await plant.save();

    console.log("Plant identi added successfully! ", newIdentification);
    res.status(201).json({ message: 'Plant identification added successfully', identification: newIdentification });

  } catch (error) {
    console.error('Error adding plant identification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}