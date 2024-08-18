const fs = require('fs');
const util = require('util');

const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

exports.uploadFile = (filePath, fileBuffer) => {
  return writeFile(filePath, fileBuffer);
}

exports.deleteFile = (filePath) => {
  return unlink(filePath)
    .catch(err => console.error('Error deleting file:', err));
}
