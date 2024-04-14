const express = require('express');
const plantController = require('../controllers/plantController');
const multer = require('multer');

const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/uploads/');
    },
    filename: function (req, file, cb) {
      var original = file.originalname;
      var file_extension = original.split(".");
      // Make the file name the date + the file extension
      filename =  Date.now() + '.' + file_extension[file_extension.length-1];
      cb(null, filename);
    }
  });

let upload = multer({ storage: storage });

router.post('/', upload.single('image'), plantController.createPlant);

router.get('/', plantController.getAllPlants);

router.get('/:plantid', plantController.getPlantById);

router.post('/:plantid/like', plantController.getPlantById);

module.exports = router;