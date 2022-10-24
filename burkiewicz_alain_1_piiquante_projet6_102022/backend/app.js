// ************************* APP.JS APPEL AUX FONCTIONS IMPLEMENTEES DANS L'API / ACCES AUX IMAGES ET ROUTES USERS ET SAUCES *************************

const express = require('express'); // Framework d'application Web minimal basé sur Node.js. Facilite le Dvpt d'appli Web, de sites et d'API 
const bodyParser = require('body-parser'); // Package d'extraction d'objet JSON des requêtes POST
const mongoose = require('mongoose'); // Interface qui fait le lien avec MongoDB
const path = require('path'); // Package permettant l'upload des images (répertoires / chemins / fichiers)
const helmet = require('helmet'); // Helmet aide à sécuriser Express en définissant divers en-têtes HTTP. (Attaque XSS)
const nocache = require('nocache'); // Middleware Express pour désactiver la mise en cache
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// ----- Utilisation de 'dotenv' pour masquer les infos de connexion à la base de données à l'aide de variables d'environnement

require('dotenv').config();

// ----- Connexion à MongoDB


mongoose.connect(process.env.CONNECT_USER,

{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// ************************* CREATION APP *************************

const app = express(); // L'application utilise le framework express

// ----- Gestion des erreurs de sécurité CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');   // Ressouces partagées par tout le monde
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Entêtes pouvant être uilisées après vérif
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Méthodes autorisées pour les requêtes HTTP
  res.setHeader('Content-Security-Policy', "default-src 'self'"); // Authorisation au serveur de fournir des script de la page visitée
  next();
});


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json()); // Transforme les données de la requête en objet JSON facilement exploitable
// app.use(helmet());
app.use(nocache()); // Désactive la mise en cache du navigateur
app.use('/images', express.static(path.join(__dirname, 'images'))); // Gestion de la ressource image de façon statique
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
// This sets custom options for the referrerPolicy middleware.
app.use(
  helmet({
    referrerPolicy: { policy: "no-referrer" },
  })
);

module.exports = app;
