const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

const verifyPassword = require('../middleware/verifyPassword');

router.post('/signup', verifyPassword, userCtrl.signup); // Crée un nouvel utilisateur
router.post('/login', userCtrl.login); // Connecte un utilisateur

module.exports = router;
