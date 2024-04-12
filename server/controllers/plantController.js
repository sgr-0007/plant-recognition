const Plant = require('../models/plant');
const PlantDetails = require('../models/plantDetails');

exports.createPlant = async (req, res) => {
    try {
        // Extract plant data from the request body
        const { name, date_time_plant_seen ,description, createdby, latitude, longitude, height, spread, has_flowers, has_leaves, has_fruitsorseeds, flower_color } = req.body;
    
        const plantid = generateRandomID();
        const plantdetailid = generateRandomID();

        const createddate = new Date();
        // Extract the filename of the uploaded image
        const image = req.file.path;

        // Create a new plant using the Plant model
        const newPlant = await Plant.create({
            plantid,
            name,
            description,
            image, // Save the filename of the image
            latitude,
            longitude,
            createdby,
            createddate // You may need to parse this if it's coming as a string
            // Add other fields as needed
        });

        const newPlantDetail = await PlantDetails.create({
            plantdetailid,
            height,
            spread,
            has_flowers,
            has_leaves,
            has_fruitsorseeds,
            flower_color,
            plantid,
            date_time_plant_seen,
        })

        // Save the new plant to the database
        await newPlant.save();
        await newPlantDetail.save();

        // Redirect to localhost:3000 after successful creation
        res.redirect('http://localhost:3000/');
        } catch (err) {
        // Handle errors if any
        res.status(400).json({ message: err.message });
    }
};

function generateRandomID(){
    const randomNumber = Math.floor(Math.random() * 1000);
    return randomNumber.toString();
}

exports.getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPlantById = async (req, res) => {
    try {
        const { plantid } = req.params;
        const plant = await Plant.findOne({ _id: plantid });
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.json(plant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};