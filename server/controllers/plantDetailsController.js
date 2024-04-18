const PlantDetails = require("../models/plantDetails");

exports.getPlantDetailsByPlantId = async (req, res) => {
    try {
        const { plantid } = req.params;

        const plantDetails = await PlantDetails.findOne({ plantid: plantid });
        if (!plantDetails) {
            return res.status(404).json({ message: "Plant not found" });
        }
        res.json(plantDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
