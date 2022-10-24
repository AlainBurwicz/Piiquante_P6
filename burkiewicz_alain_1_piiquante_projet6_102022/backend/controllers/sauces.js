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
        // Analyse des données avec JSON.parse(), les données deviennent un objet JavaScript.

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
    const userId = req.body.userId;
    const userChoix = req.body.like;
    const filter = { _id: req.params.id };

    Sauce.findOne(filter)
        .then(thisSauce => {

            // Verification si l'utilisateur a déjà voté et quoi depuis la base de données

            let aDejaVote = thisSauce.usersLiked.includes(userId) ? 'like'
                : thisSauce.usersDisliked.includes(userId) ? 'dislike'
                    : false;

            // Initialisation de la variable 'update' pour le prochain crud unpdateOne

            let update;

            // Alimenter la variable 'update' en fonction du choix de l'utilisateur
            // Utilisation de "$inc" incrémentation, "$addToset" ajout, "$pull" suppression, de valeur dans MongoDb 
            
            switch (userChoix) {

                // Like : On ajoute 1 au like
                // Case = 1

                case (1):
                    if (!aDejaVote) {
                        update = {
                            $addToSet: { usersLiked: userId },
                            $inc: { likes: +1 }
                           
                        };
                        console.log(update, "!de A déja voté like +1");
                    }
                    break;

                // Dislike : On ajoute 1 au dislike
                // Case = -1

            

                case (-1):
                    if (!aDejaVote) {
                        update = {
                            $addToSet: { usersDisliked: userId },
                            $inc: { dislikes: +1 }
                        };
                        console.log(update, "!de A déja voté dislike +1");
                    }
                    break;

                // Reset 
                //Case = 0

                case (0):

                    // L'utilisateur a déja aimé avant : On enlève -1 au like

                    if (aDejaVote === 'like') {
                        update = {
                            $pull: { usersLiked: userId },
                            $inc: { likes: -1 }
                        };
                        console.log(update, "A déja voté like -1");
                    }
                    // L'utilisateur n'a pas déja aimé avant : On enlève -1 au dislike

                    if (aDejaVote === 'dislike') {
                        update = {
                            $pull: { usersDisliked: userId},
                            $inc: { dislikes: -1 }
                        };
                        console.log(update, "A déja voté dislike -1");

                    }
                    break;
            }

             // Mettre à jour avec like ou dislike si changement approprié

             if (update !== undefined) {
                Sauce.updateOne(filter, update)
                    .then(() => res.status(200).json({ message: 'Ici les changements apportés / aimé, pas aimé ' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
}


