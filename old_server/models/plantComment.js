// models/plantComment.js
const mongoose = require('mongoose');

const plantCommentSchema = new mongoose.Schema({
    plantid: { type: Number, required: true },
    commentid: { type: Number, required: true, unique: true },
    commentedby: { type: String }
});

module.exports = mongoose.model('PlantComment', plantCommentSchema);
