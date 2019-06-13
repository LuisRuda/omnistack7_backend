const multer = require('multer');
const path = require('path');

module.exports = {
    storage: new multer.diskStorage({
        // Define destino e nome das imagens salvas
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    })
};