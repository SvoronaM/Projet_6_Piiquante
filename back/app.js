// Installation d'express (framework qui simplifie les taches, en nous permettant de déployer les API plus rapidement)
// l'application Express est fondamentalement une série de fonctions appelées MIDDLEWARE. Chaque élément de middleware
// reçoit les objets request et response, peut les lire, les analyser et les manipuler.(req, res, next)
const express = require('express');
// Mongoose facilite les interactions avec la bdd MongoDB. Il nous permet de valider le format des données ; de gérer
// les relations entre les documents ; de communiquer directement avec la bdd pour la lecture et l'écriture des documents
const mongoose = require("mongoose");
const path = require("path"); /* path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires */
// Constante qui appelle express
const app = express();
//  App utilise le module express
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Export app pour y accéder depuis d'autres fichiers de projet
module.exports = app;