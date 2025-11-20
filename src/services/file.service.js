// services/file.service.js
const fs = require("fs");
const path = require("path");

const saveLocalFile = (file) => {
  const uploadsFolder = path.join("uploads");

  if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
  }

  const filePath = path.join(uploadsFolder, file.originalname);
  fs.writeFileSync(filePath, file.buffer);

  return filePath;
};

const deleteLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { saveLocalFile, deleteLocalFile };
