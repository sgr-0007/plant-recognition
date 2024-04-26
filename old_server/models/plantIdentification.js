// models/plantIdentification.js
const mongoose = require('mongoose');

const plantIdentificationSchema = new mongoose.Schema({
    plantidentificationid: { type: Number, required: true, unique: true },
    plantid: { type: Number, required: true },
    suggestedname: { type: String },
    identifiedby: { type: String },
    status: { type: String },
    approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('PlantIdentification', plantIdentificationSchema);
