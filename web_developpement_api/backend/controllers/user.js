// ******************************************************************************************************
// CONTROLLERS USER LOGIQUE METIER
// ******************************************************************************************************

const bcrypt = require('bcrypt') // Package bcrypt pour hasher le mot de User
const User = require('../Models/User.js'); // Récupération model User créé avec le schéma mongoose
const jwToken = require('jsonwebtoken'); // Package TOKEN pour attribution d'un token à la connexion


// ----- Création User

// ----- Sauvegarde d'un nouvel utilisateur hash paswword généré par bcrypt

exports.signup = (req, res, next) => {
  // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
  bcrypt.hash(req.body.password, 10) // Appel de la méthode hash de bcrypt. 10 est le nombre de de qu'on fait faire à l'algorithme
    .then(hash => {       // Récup du hash et création du nouvel utilisateur avec le model mongoose
      const user = new User({
        email: req.body.email, // Passage de l'email trouvé dans la requête
        password: hash // Récup le password hashé de bcrypt
      });
      user.save() // Enregistrement du user dans la database
        .then(() => res.status(201).json({
          message: 'Utilisateur créé avec succès!'
        }))
        .catch(error => res.status(400).json({
          error
        })); // Si user existant avec la même adresse email
    })
    .catch(error => res.status(500).json({
      error
    }));

};

// ----- Login User

exports.login = (req, res, next) => { // Vérif du password si OK renvoi d'un TOKEN contenant i'id user
  User.findOne({ // Recherche du user dans la database qui correspond à l'adresse email
    email: req.body.email
  })
    .then(user => {
      // Si user non trové revoi erreur 401
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      bcrypt.compare(req.body.password, user.password) // Comparaison bcrypt des hashs pour vérif des strigs d'origine
        .then(valid => {
          // Si la réponse est fausse renvoi erreur 401
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          res.status(200).json({ // Si réponse OK renvoi d'un objet JSON avex un userId + un token (Le serveur backend renvoie un token au frontend)
            userId: user._id,
            token: jwToken.sign( // Jsonwebtoken encode un nouveau token avec une chaine de développement temporaire
              {
                userId: user._id
              },
              'RANDOM_TOKEN_SECRET', // Clé d'encodage du token
              {
                expiresIn: '24h' // Configuration d'expiration au bout de 24h
              }
            )
            // Encodage de l'userID pour la création de nouveaux objets. Permet d'appliquer le bon userId aux objets afin de ne pas modifier les objets d'un autre userId
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};
