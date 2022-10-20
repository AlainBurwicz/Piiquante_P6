// ******************************************************************************************************
// CONGIF MULTER
// ******************************************************************************************************

// Import de Multer

const multer = require('multer');

// Définition de l'extension des fichiers images

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration de multer

const storage = multer.diskStorage({
    // Stockage des images dans le dossier images
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Génération du nouveau nom de fichier image

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // Remplace les espaces par des underscores
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Export le middleware multer

module.exports = multer({ storage }).single('image');