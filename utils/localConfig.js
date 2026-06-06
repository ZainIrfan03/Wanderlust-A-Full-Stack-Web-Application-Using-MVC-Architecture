// localConfig.js

const multer = require('multer');
const path = require('path');

// Define the storage configuration to save files locally
const storage = multer.diskStorage({
    // Sets the destination folder: public/uploads
    destination: function (req, file, cb) {
        // __dirname is the current directory (project root)
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    
    // Defines the filename using the current timestamp to prevent conflicts
    filename: function (req, file, cb) {
        // Saves the file as: timestamp-originalfilename.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Export the storage engine
module.exports = {
    storage
};