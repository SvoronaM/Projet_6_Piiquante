// Constante qui appelle express
const express = require('express');
// Utilisation de la classe express.Router pour créer des gestionnaires de routes modulaires et pouvant être montés
const router = express.Router();

const userCtrl = require('../controllers/user'); /* Constante qui appelle le fichier user dans le dossier controllers */

router.post('/signup', userCtrl.signup); /* Route qui appelle en méthode POST le middleware "signup" du fichier user dans dossier controllers et l'envoie sur /signup */
router.post('/login', userCtrl.login); /* Route qui appelle en méthode POST le middleware "login" du fichier user dans dossier controllers et l'envoie sur /signup */

module.exports = router; /* Export des routes */