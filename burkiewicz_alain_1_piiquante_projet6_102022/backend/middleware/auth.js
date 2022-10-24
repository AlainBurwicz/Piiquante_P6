// ******************************************************************************************************
// AUTH TOKEN
// ******************************************************************************************************

// Importation jsonwebtoken

const jwToken = require('jsonwebtoken'); // Package TOKEN pour attribution d'un token à la connexion

// Permet de vérifier le token envoyé par le frontend

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  // Récup du token dans le header. Uniquement le second élément du tableau (split)
        const decodedToken = jwToken.verify(token, 'RANDOM_TOKEN_SECRET'); //Vérif du token décodé avec la clé secrète.
        const userId = decodedToken.userId; // Vérif de la correspondance de l'userId envoyé avec la requête au userId encodé dans le token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable'; // Si le token différent à l'userId : erreur 401
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée'});
    }
};
