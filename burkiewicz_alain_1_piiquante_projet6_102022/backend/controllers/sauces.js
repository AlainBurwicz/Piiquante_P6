// ******************************************************************************************************
// CONTROLLERS SAUCES LOGIQUE METIER
// ******************************************************************************************************

const Sauce = require('../models/sauce'); // Récup du modèle sauce dans models (Schéma mongoose)
const fs = require('fs'); // Runtime qui intéragit avec les fichiers et les dossiers. (Lire / Ecrire / Ajouter des fichiers)

// ----- Création sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; 
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Modif de l'URL de l'image en dynamique
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save() // Sauvegarde dans la database
    .then(() => res.status(201).json({
        
        message: 'Sauce enregistrée !',
      })
    )
    
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

// Modification d'une sauce

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // Vérifier si l'utilisateur a effectué un upload d'une image
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    // Mise à jour de la sauce avec le paramètre id

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifiée'}))
        .catch(error => res.status(400).json({ error}));
};


// ----- Suppression sauce

exports.deleteSauce = (req, res, next) => {

      // Recherche de l'objet pour obtenir l'URL de l'image et suppression du fichier image de la database


    Sauce.findOneAndDelete({_id: req.params.id})
        .then(sauce => {
        // Extraction du fichier en récupérant l'URL de la sauce (Split autour de la chaine de car. => nom du fichier)
            const filename = sauce.imageUrl.split('/images/')[1];
            // Appel d'unlink pour suppression du fichier
            fs.unlink(`images/${filename}`, () => {
                    // Suppression dans la database

                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimée'}))
                    .catch(error => res.status(400).json({ error}));
            })
        })
        .catch(error => res.status(500).json({ error}));
};


// ----- Affichage d'une sauce identifiée par son id depuis la base MongoDB

exports.getOneSauce = (req, res, next) => {
        // Findone permet de sélectionner un objet spécifique
        Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce)) // Si OK retourne la réponse et l'objet
        .catch(error => res.status(404).json({ error }));  // Si pas OK retourne erreur 404
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


exports.likeDislike = (req, res, next) => {
    if (req.body.like < 1) { 
        console.log(reg.body.like, "Déja validé");
    
    }
    else if(req.body.like == 1) {
        Sauce.updateOne({_id: req.params.id}, {

            // Incrémentation de 1 dans likes
            $inc: { likes: +1},
            // Ajoute la valeur spécifiée
            $push: {usersLiked: req.body.userId}
        })
        .then(() => res.status(200).json({message: 'Vous appréciez cette sauce !'}))
        .catch(error => res.status(400).json({ error }));
        // Sinon, si like = -1
    } else if(req.body.like == -1) {
        Sauce.updateOne({_id: req.params.id}, {
            // Incrémentation de 1 dans dislike
            $inc: { dislikes: +1},
            // On push la valeur spécifiée
            $push: {usersDisliked: req.body.userId}
        })
        .then(() => res.status(200).json({message: 'Vous n\'aimez pas cette sauce !'}))
        .catch(error => res.status(400).json({ error }));
        // Sinon, si like = 0
    } else if(req.body.like == 0) {
        console.log(req.body);
        Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if(sauce.usersLiked.includes(req.body.userId)){
                Sauce.updateOne({_id: req.params.id}, {
                    // On incrémente de -1 afin d'annuler le Like
                    $inc: { likes: -1},
                    // On push la valeur spécifiée
                    $pull: {usersLiked: req.body.userId}
                })
                .then(() => res.status(200).json({message: 'Vous annulez votre like pour cette sauce !'}))
                .catch(error => res.status(400).json({ error }));
            }
            if(sauce.usersDisliked.includes(req.body.userId)){
                Sauce.updateOne({_id: req.params.id}, {
                    // On incrémente de -1 le dislike afin d'annuler le dislike
                    $inc: { dislikes: -1},
                    // On push la valeur spécifiée
                    $pull: {usersDisliked: req.body.userId}
                })
                .then(() => res.status(200).json({message: 'Vous annulez votre dislike pour cette sauce !'}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        
    }
}


