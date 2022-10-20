// ******************************************************************************************************
// CONTROLLERS SAUCES LOGIQUE METIER
// ******************************************************************************************************

const Sauce = require('../models/sauce'); // Récup du modèle sauce dans models (Schéma mongoose)
const fs = require('fs'); // Runtime qui intéragit avec les fichiers et les dossiers. (Lire / Ecrire / Ajouter des fichiers)

// ----- Création sauce

exports.createSauce = (req, res, next) => {
  // Stockage des datas envoyées par le front-end dans une variable en les transformant en objetJs
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // Supppression de l'id généré par le front-end. (L'id de la sauce est créé par MongoDB)
  const sauce = new Sauce({
    // Création d'une d'une instance de modèle de sauce (on utilise spread (...))
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Modif de l'URL de l'image en dynamique
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save() // Sauvegarde dans la database
    .then(() =>
      res.status(201).json({
        // Si OK code 201 et enregistrement
        message: 'Sauce enregistrée !',
      })
    )
    // Si pas OK erreur 400
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.modifySauce = (req, res, next) => {
  
  // ----- Crétion de l'objet Js pour modification

  const sauceObject = req.file ?// Vérifier si l'utilisateur a effectué un upload d'une image
     {
        // Si OUI
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body }; 
    // delete sauceObject.userId;
    // Si NON


  // ----- Suppression de l'ancienne image si une nouvelle est uploadée

  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        // Rechercher le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        if (fs.existsSync(`images/${filename}`)) {
          // Si le fichier existe SUPPRESSION
          fs.unlinkSync(`images/${filename}`);
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
  // ----- Mise à jour de la sauce pour le parametre id

  Sauce.updateOne(
    { _id: req.params.id },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
    .catch((error) => res.status(400).json({ error }));
};

// ----- Suppression sauce

exports.deleteSauce = (req, res, next) => {
  // Recherche de l'objet pour obtenir l'URL de l'image et suppression du fichier image de la database
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      // Extraction du fichier en récupérant l'URL de la sauce (Split autour de la chaine de car. => nom du fichier)
      const filename = sauce.imageUrl.split('/images/')[1]; // Appel d'unlink pour suppression du fichier
      fs.unlink(`images/${filename}`, () => {
        // Suppression dans la database
        Sauce.deleteOne({_id: req.params.id,
        })
          .then(() =>
            res.status(200).json({
              message: 'Sauce supprimée !',
            })
          )
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
      });
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};

// ----- Get d'une sauce identifiée par son id depuis la base MongoDB

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    // Findone permet de sélectionner un objet spécifique
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce)) // Si OK retourne la réponse et l'objet
    .catch((error) =>
      res.status(404).json({
        // Si NO retourne erreur 404
        error,
      })
    );
};

// ----- Get de toutes les sauces

exports.getAllSauce = (req, res, next) => {
  Sauce.find() // Find permet de seléctionnner tous les objets
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

// ----- Like et Dislike

exports.likeDislike = (req, res, next) => {
  let like = req.body.like; // Like présent dans le body
  let userId = req.body.userId; // Capture du userId
  let sauceId = req.params.id; // Capture de l'id de la sauce

  if (like === 1) {
    // Valeur 1 pour like
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        $push: {
          // On push le user et on incrémente le compteur de 1
          usersLiked: userId,
        },
        $inc: {
          likes: +1,
        }, // Incrémentation de 1
      }
    )
      .then(() =>
        res.status(200).json({
          message: "j'\ aime ajouté !",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === -1) {
    Sauce.updateOne(
      // Valeur -1 pour dislike
      {
        _id: sauceId,
      },
      {
        $push: {
          usersDisliked: userId,
        },
        $inc: {
          dislikes: +1,
        }, // Incrémentation de 1
      }
    )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !',
        });
      })
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === 0) {
    // Valeur 0 pour annuler like ou dislike
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          // Annulation like
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersLiked: userId,
              },
              $inc: {
                likes: -1,
              }, // Incrémentation de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: 'Like retiré !',
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
        if (sauce.usersDisliked.includes(userId)) {
          // Annulation dislike
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              }, // Incrémentation de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: 'Dislike retiré !',
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
      })
      .catch((error) =>
        res.status(404).json({
          error,
        })
      );
  }
};
