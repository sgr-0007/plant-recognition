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

exports.searchPlant = async (req, res) => {
  const plantName = req.query.name;
  if (!plantName) {
    res.status(400).json({ error: 'Plant name is required' });
    return;
  }

  const endpointUrl = 'https://dbpedia.org/sparql';
  const sparqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?label ?description
    WHERE {
      <http://dbpedia.org/resource/${encodeURIComponent(plantName)}> rdfs:label ?label .
      <http://dbpedia.org/resource/${encodeURIComponent(plantName)}> dbo:abstract ?description .
      FILTER (langMatches(lang(?label), "en") && langMatches(lang(?description), "en"))
    } LIMIT 1`;

  const encodedQuery = encodeURIComponent(sparqlQuery);
  const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.bindings.length > 0) {
      const bindings = data.results.bindings[0];
      const plantDetails = {
        label: bindings.label.value,
        description: bindings.description.value
      };
      res.json(plantDetails);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching plant data from DBpedia', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};


// File: controllers/plantController.js

exports.getSortedPlants = async (req, res) => {
  const { sort, order = 'desc', has_flowers, has_leaves, has_fruitsorseeds } = req.query;
  let query = {};

  if (has_flowers) query.has_flowers = has_flowers === 'true';
  if (has_leaves) query.has_leaves = has_leaves === 'true';
  if (has_fruitsorseeds) query.has_fruitsorseeds = has_fruitsorseeds === 'true';

  try {
    // Construct a sort object dynamically based on the query params
    let sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions['createddate'] = -1; // Default sorting
    }

    let plants = await Plant.find(query).sort(sortOptions);
    res.json({ success: true, data: plants });
  } catch (error) {
    console.error('Error fetching sorted plants:', error);
    res.status(500).json({ success: false, message: "Failed to fetch sorted plants", error: error.message });
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

exports.addComment = async (req, res) => {
  const { plantid } = req.params;
  const { comment, commentedby, updateCommentId } = req.body;

  // Error handling for missing data (plantid and comment are still required)
  if (!plantid || !comment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find the plant by ID
    const plant = await Plant.findOne({ plantid });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
      // Find the comment
      const commentIndex = plant.comments.findIndex(x => x.comment === comment && x.commentedby === commentedby);

      if (commentIndex === -1) {
      const newComment = {
        commentid: Math.floor(Math.random() * 100000) + 1, 
        commentedby: commentedby,
        comment : comment,
      };

      // Add the new comment to the plant's comments array
      plant.comments.push(newComment);
      }   

    // Save the updated plant document
    const updatedPlant = await plant.save();
    return res.status(200).json({ message: 'Comment added successfully', comment: updatedPlant.comments });

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

}

exports.getComments = async (req, res) => {
  const { plantid } = req.params;

  try {
    const plant = await Plant.findOne({ plantid });
    // fetch comments
    const comments = plant.comments;
    res.json({ comments });
  }
  catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


