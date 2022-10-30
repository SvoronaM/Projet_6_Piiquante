// Installation d'express (framework qui simplifie les taches, en nous permettant de déployer les API plus rapidement)
// l'application Express est fondamentalement une série de fonctions appelées MIDDLEWARE. Chaque élément de middleware
// reçoit les objets request et response, peut les lire, les analyser et les manipuler.(req, res, next)
const express = require('express');
// Mongoose facilite les interactions avec la bdd MongoDB. Il nous permet de valider le format des données ; de gérer
// les relations entre les documents ; de communiquer directement avec la bdd pour la lecture et l'écriture des documents
const mongoose = require("mongoose");
// Path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires
const path = require("path");
// Constante qui appelle express
const app = express();
// Dotenv charge les variables d'environnement d'un fichier .env dans un process.env
const dotenv = require('dotenv');
// Charge les variables d'environnement
dotenv.config();
//  App utilise le module express
app.use(express.json());

mongoose.connect('mongodb+srv://OCR_1:LbwAITYsMCv16fZB@cluster0.xjpuzc3.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));/* Permet de connecter l'API à la bd */

const userRoutes = require("./routes/user"); /* Constante qui appelle le fichier user dans le dossier routes */
const saucesRoutes = require("./routes/sauces"); /* Constante qui appelle le fichier sauces dans le dossier routes */

const myAccount = process.env.account; /* constante qui va chercher la variable d'environnement account dans le fichier .env */
const myMdp = process.env.mdp; /* constante qui va chercher la variable d'environnement mdp dans le fichier .env */
const myDatabase = process.env.database; /* constante qui va chercher la variable d'environnement database dans le fichier .env */
// indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images
app.use("/images", express.static(path.join(__dirname, "images"))); 
app.use("/api/auth", userRoutes); /* "/route attendu par le front-end", userRoutes */
app.use("/api", saucesRoutes); /* "/route attendu par le front-end", saucesRoutes */

// Export app pour y accéder depuis d'autres fichiers de projet
module.exports = app;