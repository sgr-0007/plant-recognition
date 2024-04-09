// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 5000;
const URI = "mongodb+srv://faiqiqbal37:plant1234@plant-recognition.abudcv7.mongodb.net/";


app.use(cors({
    origin: 'http://localhost:3000',
}));

// Connect to MongoDB
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

const plantRoutes = require('./routes/plantRoutes');
// const plantIdentificationRoutes = require('./routes/plantIdentificationRoutes');
// const plantCommentRoutes = require('./routes/plantCommentRoutes');
// const plantDetailsRoutes = require('./routes/plantDetailsRoutes');

// Routes
app.use('/api/plants', plantRoutes);
// app.use('/api/plant_identifications', plantIdentificationRoutes);
// app.use('/api/plant_comments', plantCommentRoutes);
// app.use('/api/plant_details', plantDetailsRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
