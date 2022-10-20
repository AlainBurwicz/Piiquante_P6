// ************************* Modèle (User) pour MongoDB *************************

const mongoose = require('mongoose');
require('mongoose-type-email');
const uniqueValidator = require('mongoose-unique-validator'); // Package qui vérifie si l'email est unique
const sanitizerPlugin = require('mongoose-sanitizer-plugin'); // Désinfectant pour les modèles de mongoose

// Mongoose-unique assurera que 2 utilisateurs ne peuvent partager la même adresse email.
// Validation du mot de passe après verif du middleware 'verifyPassword' et modèle 'password'

const userSchema = mongoose.Schema({
  email: {
    // email doit être unique
    type: String,
    unique: true,
    required: [true, "Veuillez entrer votre adresse email"],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, // Regex email
      'Veuillez entrer une adresse email correcte',
    ],
  },
  password: {
    // Enrgistrement du password
    type: String,
    required: [true, 'Veuillez choisir un mot de passe'],
  },
});

userSchema.plugin(uniqueValidator);

userSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('User', userSchema);
