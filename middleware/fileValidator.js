const path = require('path');

module.exports = (req, res, next) => {
  const { fromFormat, toFormat } = req.body;
  const files = req.files;

  if (!fromFormat || !toFormat) {
    return res.status(400).json({ error: 'Both from format and to format must be provided.' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Loop through all files and validate each file extension and content type
  for (const file of files) {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (fromFormat.toLowerCase() === 'jpeg' && !(fileExtension === '.jpeg' || fileExtension === '.jpg')) {
      return res.status(400).json({ error: `File ${file.originalname} must be in JPEG format.` });
    } else if (fromFormat.toLowerCase() !== 'jpeg' && fileExtension !== `.${fromFormat.toLowerCase()}`) {
      return res.status(400).json({ error: `File ${file.originalname} must be in ${fromFormat} format.` });
    }

    // Read the file buffer and validate its content
    const fileBuffer = file.buffer;

    if (fromFormat.toLowerCase() === 'jpeg' && !isJpeg(fileBuffer)) {
      return res.status(400).json({ error: `File ${file.originalname} is not a valid JPEG image.` });
    }

    if (fromFormat.toLowerCase() === 'png' && !isPng(fileBuffer)) {
      return res.status(400).json({ error: `File ${file.originalname} is not a valid PNG image.` });
    }
    
    // if (fromFormat.toLowerCase() !== fileExtension.slice(1)) {
    //   return res.status(400).json({ error: `File ${file.originalname} must be in ${fromFormat} format.` });
    // }
  }

  next();
};

function isJpeg(buffer) {
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9;
}

function isPng(buffer) {
  return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a;
}
