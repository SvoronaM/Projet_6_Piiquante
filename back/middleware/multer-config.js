// Package permettant de gérer les fichiers entrants
const multer = require('multer');

// Dictionnaire des extensions de fichiers entrants
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};
// Utilisation de la function diskStorage pour dire que l'on va enregistrer sur le disque
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Callback enregistre l'image sur images
            callback(null, 'images');
            // Sinon si le dossier existe
        } else {
        // Callback enregistre l'image sur images
            callback(null, 'images');
        }
    },
// Filename qui explique à multer quel nom de fichier utiliser
    filename: (req, file, callback) => {
    // Nouveau nom avec une séparation du nom original et qui les remplace par le _ en les join en 1 seul string
        const name = file.originalname.split(' ').join('_');
        // Créer l'extension du fichier qui correspond au mimetype du fichier envoyé
        const extension = MIME_TYPES[file.mimetype];
        // Appelle le callback avec le name du fichier auquel on ajoute le temps, puis un . et l'extension
        callback(null, name + Date.now() + '.' + extension);
    }
});
// Export la méthode multer à laquelle on passe notre objet storage avec la méthode single (unique) avec 'image' pour expliquer qu'il s'agit de fichiers image uniquement
module.exports = multer({ storage }).single('image');
