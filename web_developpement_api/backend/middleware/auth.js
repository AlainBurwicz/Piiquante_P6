// ******************************************************************************************************
// AUTH TOKEN
// ******************************************************************************************************

const jwToken = require('jsonwebtoken'); // Package TOKEN pour attribution d'un token à la connexion


// ----- Vérif du TOKEN du user si il correspond à l'id user dans la requête.

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récup du token dans le header. Uniquement le second élément du tableau (split)
    const decodedToken = jwToken.verify(token, 'RANDOM_TOKEN_SECRET'); //Vérif du token décodé avec la clé secrète.
    const userId = decodedToken.userId; // Vérif de la correspondance de l'userId envoyé avec la requête au userId encodé dans le token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'userId non valide'; // Si le token différent à l'userId : erreur 401
    } else {
      next(); // Si OK on passe au prochain middleware
    }
  } catch (error) {
    // probleme d'autentification si erreur dans les inscrutions
    res.status(401).json({
      error: error | 'Requête non authentifiée !',
    });
  }
};
