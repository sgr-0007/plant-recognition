const Plant = require("../models/plant");

exports.createPlant = async (req, res) => {
  console.log("Received form data:", req.body);  // Should now log correct data
  console.log("Received file:", req.file);      // Should log file info

  const {
    name, date_time_plant_seen, description, createdby,
    latitude, longitude, height, spread, flower_color,
    has_flowers = "false", has_leaves = "false", has_fruitsorseeds = "false"
  } = req.body;

  //   console.log(`Plant Details:
  //   Name: ${name},
  //   Seen At: ${date_time_plant_seen},
  //   Description: ${description},
  //   Created By: ${createdby},
  //   Location: (${latitude}, ${longitude}),
  //   Height: ${height},
  //   Spread: ${spread},
  //   Flower Color: ${flower_color},
  //   Has Flowers: ${has_flowers},
  //   Has Leaves: ${has_leaves},
  //   Has Fruits or Seeds: ${has_fruitsorseeds}
  // `);

  const plantid = generateRandomID();
  const createddate = new Date();
  var image = req.file.path;

// Remove 'public\' from the filePath
  image = image.replace('public\\', '');
  console.log(image)

  try {
    const newPlant = new Plant({
      plantid, name, description, image, latitude, longitude, createdby,
      createddate, height, spread, has_flowers: has_flowers === 'true',
      has_leaves: has_leaves === 'true', has_fruitsorseeds: has_fruitsorseeds === 'true',
      flower_color, date_time_plant_seen
    });

    // console.log("Plant ID:", newPlant.plantid);
    // console.log("Name:", newPlant.name);
    // console.log("Description:", newPlant.description);
    // console.log("Image:", newPlant.image);
    // console.log("Latitude:", newPlant.latitude);
    // console.log("Longitude:", newPlant.longitude);
    // console.log("Created By:", newPlant.createdby);
    // console.log("Created Date:", newPlant.createddate);
    // console.log("Height:", newPlant.height);
    // console.log("Spread:", newPlant.spread);
    // console.log("Has Flowers:", newPlant.has_flowers);
    // console.log("Has Leaves:", newPlant.has_leaves);
    // console.log("Has Fruits or Seeds:", newPlant.has_fruitsorseeds);
    // console.log("Flower Color:", newPlant.flower_color);
    // console.log("Date Time Plant Seen:", newPlant.date_time_plant_seen);

    
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
