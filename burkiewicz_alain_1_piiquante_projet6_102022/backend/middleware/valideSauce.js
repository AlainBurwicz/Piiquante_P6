// ******************************************************************************************************
// MONGOOSE VALIDATOR SAUCE
// ******************************************************************************************************

const validate = require('mongoose-validator'); // Validateurs pour les schémas Mongoose utilisant validator.js

exports.nameValidator = [
  // Validation Nom sauce
  validate({
    validator: 'isLength',
    arguments: [3, 60], // Nom  comportant de 3 à 30 car.
    message: 'Le nom de votre Sauce doit contenir entre 3 and 60 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, // Regex Nom
    message:
      'Vous ne pouvez utiliser que des chiffres et des lettres pour nommer votre sauce',
  }),
];

exports.manufacturerValidator = [
  // Validation Nom manufacturer
  validate({
    validator: 'isLength',
    arguments: [3, 40], // Nom  manufacturer comportant de 3 à 40 car.
    message: 'Le nom du fabricant doit contenir entre 3 et 40 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, // Regex pour manufacturer
    message:
      'Vous ne pouvez utiliser que des chiffres et des lettres pour nommer le fabricant',
  }),
];

exports.descriptionValidator = [
  // Validation Description sauce
  validate({
    validator: 'isLength',
    arguments: [10, 150], // description comportant 10 à 150 car.
    message:
      'La description de la sauce doit contenir entre 10 et 150 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, // Regex description sauce
    message:
      'Vous ne pouvez utiliser que des chiffres et des lettres pour la description de la sauce',
  }),
];

exports.pepperValidator = [
  // Validation Principal ingrédient sauce
  validate({
    validator: 'isLength',
    arguments: [3, 20], // Principal ingrédient comportant 3 et 20 caractères
    message: 'Le principal ingrédient doit contenir entre 3 et 20 caractères',
  }),
  validate({
    validator: 'isAlphanumeric', // Ne peut contenir que des caractères alphanumériques
    message:
      'Ne peut contenir que des caractères alphanumériques entre 3 et 20 caractères',
  }),
];
