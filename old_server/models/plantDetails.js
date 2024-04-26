// models/plant_detail.js
const mongoose = require('mongoose');

const plantDetailSchema = new mongoose.Schema({
    plantdetailid: { type: Number, required: true, unique: true },
    height: { type: Number },
    spread: { type: Number },
    has_flowers: { type: Boolean },
    has_leaves: { type: Boolean },
    has_fruitsorseeds: { type: Boolean },
    flower_color: { type: String },
    plantid: { type: Number, required: true },
    date_time_plant_seen: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlantDetail', plantDetailSchema);
