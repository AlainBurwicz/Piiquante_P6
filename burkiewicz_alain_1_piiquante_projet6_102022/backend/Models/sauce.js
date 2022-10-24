// ************************* Modèle (SAUCE) pour MongoDB *************************

const mongoose = require('mongoose'); // Package Mongoose interface qui interagit avec MongoDB
const sanitizerPlugin = require('mongoose-sanitizer-plugin'); // Désinfectant pour les modèles de mongoose


// ************************* SCHEMA *************************

// ----- Création du schéma à enregistrer dans MongoDB

const sauceSchema = mongoose.Schema({
    // ( id automatique par MongoDB)
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true }
});

// Sanitizez Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.

sauceSchema.plugin(sanitizerPlugin);


module.exports = mongoose.model('Sauces', sauceSchema);
