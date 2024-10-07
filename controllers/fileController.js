const path = require('path');
const archiver = require('archiver');
const { convertJpegToPng, convertPngToJpeg, convertImageToPdf } = require('../helpers/conversionHelper');
const { uploadFile, deleteFile } = require('../helpers/fileOperationsHelper');

exports.convertFiles  = async (req, res) => {
  const { fromFormat, toFormat } = req.body;
  const uploadedFiles = req.files;

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }

  const convertedFiles = [];

  try {
    for (const uploadedFile of uploadedFiles) {
      const originalNameWithoutExt = path.parse(uploadedFile.originalname).name;
      const ext = path.extname(uploadedFile.originalname);
      const uniqueSuffix = Date.now();
      const newFileName = `${originalNameWithoutExt}-${uniqueSuffix}${ext}`;
      const finalPath = path.join('public/uploads', newFileName);

      // Use the helper to upload the file
      await uploadFile(finalPath, uploadedFile.buffer);

      const convertedFileName = `${originalNameWithoutExt}-${Date.now()}.${toFormat}`;
      const convertedFilePath = path.join('public/outputs', convertedFileName);

      // Conversion logic
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

      // Construct and add the converted file URL to the list
      const fileUrl = `${req.protocol}://${req.get('host')}/public/outputs/${convertedFileName}`;
      convertedFiles.push({
        convertedFileUrl: fileUrl,
        convertedFileName: convertedFileName,
        originalFileName: uploadedFile.originalname
      });
    }

    // Send response with individual converted files
    res.json({ convertedFiles });
  } catch (error) {
    console.error('Error during conversion:', error);

    // Clean up in case of error
    await deleteFile(finalPath);
    res.status(500).json({ error: 'Conversion failed.' });
  }
};

// Zip download route
exports.downloadAllFilesAsZip = async (req, res) => {
  const output = fs.createWriteStream('public/outputs/converted-files.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    res.download('public/outputs/converted-files.zip');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Add converted files to the zip
  const outputFiles = fs.readdirSync('public/outputs');
  outputFiles.forEach((file) => {
    archive.file(path.join('public/outputs', file), { name: file });
  });

  await archive.finalize();
};
