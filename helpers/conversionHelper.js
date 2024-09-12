const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const sharpConfig = require('../config/sharp');

exports.convertImageToPdf = async (imagePath, pdfPath) => {
  const image = await fs.promises.readFile(imagePath);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  const imageEmbed = path.extname(imagePath).toLowerCase() === '.png'
    ? await pdfDoc.embedPng(image)
    : await pdfDoc.embedJpg(image);

  let { width, height } = imageEmbed;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const margin = 20;

  // Calculate the available space for the image
  const maxWidth = pageWidth - 2 * margin;
  const maxHeight = pageHeight - 2 * margin;

  // Determine if scaling is needed
  const widthScale = maxWidth / width;
  const heightScale = maxHeight / height;
  const scale = Math.min(widthScale, heightScale, 1); // Choose the smaller scale to fit within the page

  // Apply scaling
  width *= scale;
  height *= scale;

  // Draw the image at the top left, taking into account the margin
  page.drawImage(imageEmbed, {
    x: margin,
    y: pageHeight - height - margin,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(pdfPath, pdfBytes);
};

exports.convertJpegToPng = async (jpegPath, pngPath) => {
  const jpegImage = await fs.promises.readFile(jpegPath);
  await sharp(jpegImage, { limit: sharpConfig.pixelLimit })
    .toFormat('png')
    .toFile(pngPath);
  await sharp(jpegImage).toFormat('png').toFile(pngPath);
}

exports.convertPngToJpeg = async (pngPath, jpegPath) => {
  const pngImage = await fs.promises.readFile(pngPath);
  await sharp(pngImage, { limit: sharpConfig.pixelLimit })
    .toFormat('jpeg')
    .toFile(jpegPath);
}
