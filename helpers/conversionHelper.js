const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');

exports.convertImageToPdf = async (imagePath, pdfPath) => {
  const image = await fs.promises.readFile(imagePath);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const imageEmbed = path.extname(imagePath).toLowerCase() === '.png' 
    ? await pdfDoc.embedPng(image) 
    : await pdfDoc.embedJpg(image);

  const { width, height } = imageEmbed;
  const margin = 20;

  page.drawImage(imageEmbed, {
    x: margin,
    y: page.getHeight() - height - margin,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(pdfPath, pdfBytes);
};

exports.convertJpegToPng = async (jpegPath, pngPath) => {
  const jpegImage = await fs.promises.readFile(jpegPath);
  await sharp(jpegImage).toFormat('png').toFile(pngPath);
}

exports.convertPngToJpeg = async (pngPath, jpegPath) => {
  const pngImage = await fs.promises.readFile(pngPath);
  await sharp(pngImage).toFormat('jpeg').toFile(jpegPath);
}
