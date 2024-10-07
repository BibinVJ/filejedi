const express = require('express');
const router = express.Router();
const multer = require('../config/multer');
const { convertFiles, downloadAllFilesAsZip } = require('../controllers/fileController');
const validateFile = require('../middleware/fileValidator');

router.post('/convert', multer, validateFile, convertFiles);

router.get('/download-all', downloadAllFilesAsZip);

module.exports = router;
