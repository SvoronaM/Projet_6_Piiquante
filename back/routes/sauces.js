// Constante qui appelle express
const express = require('express');
// Utilisation de la classe express.Router pour créer des gestionnaires de routes modulaires et pouvant être montés
const router = express.Router();

const auth = require('../middleware/auth'); /* Import du fichier auth dans dossier middleware afin de vérifier les tokens des utilisateurs sur nos routes */
const multer = require('../middleware/multer-config'); /* Appelle du fichier multer-config dans le dossier middleware */

const saucesCtrl = require('../controllers/sauces'); /* Appelle du fichier sauce dans le dossier controllers */

router.post('/', auth, multer, saucesCtrl.createSauce); /* Route en POST, appelle le middleware "createSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth et multer */
router.get('/', auth, saucesCtrl.getAllSauce); /* Route en GET, appelle le middleware "getAllSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */
router.get('/:id', auth, saucesCtrl.getOneSauce); /* Route en GET, appelle le middleware "getOneSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */
router.put('/:id', auth, multer, saucesCtrl.modifySauce); /* Route en PUT, appelle le middleware "modifySauce" du fichier sauce dans controllers avec AVANT un middleware d'auth et multer */
router.delete('/:id', auth, saucesCtrl.deleteSauce); /* Route en DELETE, appelle le middleware "deleteSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */
router.post('/:id/like', auth, saucesCtrl.likedSauce); /* Route en POST, appelle le middleware "likedSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */

module.exports = router; /* Export des routes */