const express = require('express');
const router = express.Router();
const multer = require('../config/multer');
const { convertFile } = require('../controllers/fileController');
const validateFile = require('../middleware/fileValidator');

router.post('/convert', multer.single('file'), validateFile, convertFile);

module.exports = router;
