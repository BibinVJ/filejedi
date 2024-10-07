const multer = require('multer');

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// module.exports = multer({ storage: storage });
module.exports = multer({ storage: storage }).array('files', 10);  // Allow up to 10 files
