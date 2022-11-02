// Installation d'express (framework qui simplifie les taches, en nous permettant de déployer les API plus rapidement)
// l'application Express est fondamentalement une série de fonctions appelées MIDDLEWARE. Chaque élément de middleware
// reçoit les objets request et response, peut les lire, les analyser et les manipuler.(req, res, next)
const express = require('express');
// Mongoose facilite les interactions avec la bd MongoDB. Il nous permet de valider le format des données ; de gérer
// les relations entre les documents ; de communiquer directement avec la bdd pour la lecture et l'écriture des documents
const mongoose = require('mongoose');
// Path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires
const path = require('path');
// Constante qui appelle express
const app = express();
// installation de cors (CORS signifie « Cross Origin Resource Sharing ». Il s'agit d'un système de sécurité qui, par
// défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles.) Par défaut, les requêtes AJAX sont interdites
const cors = require('cors');
// Dotenv charge les variables d'environnement d'un fichier .env dans un process.env
const dotenv = require('dotenv');
// Helmet aide à sécuriser applications Express en définissant divers en-têtes HTTP
const helmet = require("helmet");

const bodyParser = require('body-parser');

const mongoSanitize = require('express-mongo-sanitize');
// Charge les variables d'environnement
dotenv.config();
//  app utilise le module express
app.use(express.json());
// app utilise le module cors
app.use(cors());
// app utilise le module helmet, je protège l'appli de certaines vulnerabilités en protégeant les en-têtes
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const myAccount = process.env.account; /* Constante qui va chercher la variable d'environnement account dans le fichier .env */
const myMdp = process.env.mdp; /* Constante qui va chercher la variable d'environnement mdp dans le fichier .env */
const myDatabase = process.env.database; /* Constante qui va chercher la variable d'environnement database dans le fichier .env */
// Permet de connecter l'API à la bd
mongoose.connect(`mongodb+srv://${myAccount}:${myMdp}.${myDatabase}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
// Ces headers permettent :
app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); /* d'accéder à API depuis n'importe quelle origine */
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); /* d'ajouter les headers mentionnés aux requêtes envoyées vers notre API */
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); /* d'envoyer des requêtes avec les méthodes mentionnées */
        next();
});

const userRoutes = require('./routes/user'); /* Constante qui appelle le fichier user dans le dossier routes */
const saucesRoutes = require('./routes/sauces'); /* Constante qui appelle le fichier sauces dans le dossier routes */
// indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes); /* "/route attendu par le front-end", userRoutes */
app.use('/api/sauces', saucesRoutes); /* "/route attendu par le front-end", saucesRoutes */

// Export app pour y accéder depuis d'autres fichiers de projet
module.exports = app;