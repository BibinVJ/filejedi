const path = require('path');
const { convertJpegToPng, convertPngToJpeg, convertImageToPdf } = require('../helpers/conversionHelper');
const { uploadFile, deleteFile } = require('../helpers/fileOperationsHelper');

exports.convertFile = async (req, res) => {
  const { fromFormat, toFormat } = req.body;
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const originalNameWithoutExt = path.parse(uploadedFile.originalname).name;
  const ext = path.extname(uploadedFile.originalname);
  const uniqueSuffix = Date.now();
  const newFileName = `${originalNameWithoutExt}-${uniqueSuffix}${ext}`;
  const finalPath = path.join('public/uploads', newFileName);

  try {
    // Use the helper to upload the file
    await uploadFile(finalPath, uploadedFile.buffer);

    const convertedFileName = `${originalNameWithoutExt}-${Date.now()}.${toFormat}`;
    const convertedFilePath = path.join('public/outputs', convertedFileName);

    if ((fromFormat.toLowerCase() === 'jpeg' || fromFormat.toLowerCase() === 'png') && toFormat.toLowerCase() === 'png') {
      await convertJpegToPng(finalPath, convertedFilePath);
    } else if ((fromFormat.toLowerCase() === 'png' || fromFormat.toLowerCase() === 'jpeg') && toFormat.toLowerCase() === 'jpeg') {
      await convertPngToJpeg(finalPath, convertedFilePath);
    } else if ((fromFormat.toLowerCase() === 'jpeg' || fromFormat.toLowerCase() === 'png') && toFormat.toLowerCase() === 'pdf') {
      await convertImageToPdf(finalPath, convertedFilePath);
    } else {
      // Clean up uploaded file if conversion fails
      await deleteFile(finalPath);
      return res.status(400).json({ error: 'Unsupported conversion format.' });
    }

    // Clean up uploaded file after successful conversion
    await deleteFile(finalPath);

    // Construct the full URL to the converted file
    const fileUrl = `${req.protocol}://${req.get('host')}/public/outputs/${convertedFileName}`;

    res.json({ convertedFileUrl: fileUrl, convertedFileName: convertedFileName });
  } catch (error) {
    console.error('Error during conversion:', error);

    // Ensure the uploaded file is deleted in case of an error
    await deleteFile(finalPath);

    res.status(500).json({ error: 'Conversion failed.' });
  }
};
