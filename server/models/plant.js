// models/plant.js
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    plantid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    createdby: { type: String },
    createddate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plant', plantSchema);
