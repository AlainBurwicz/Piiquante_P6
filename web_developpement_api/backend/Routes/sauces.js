const express = require('express'); // Framework d'application Web minimal basé sur Node.js. Facilite le Dvpt d'appli Web, de sites et d'API

// ----- Creation router

const router = express.Router();

// ----- Importation middelwares

const auth = require('../middleware/auth'); // Pour proteger la route (TOKEN)
const multer = require('../middleware/multer-config'); // Multer :middleware node.js qui est principalement utilisé pour télécharger des fichiers.Télécharger images (exple) 

// ----- Importation controllers

const saucesCtrl = require('../controllers/sauces');

// ************************* ROUTES *************************

router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauce);
router.post('/:id/like', auth, saucesCtrl.likeDislike)

module.exports = router;
