// Mongoose est un package qui facilite les interactions avec la base de données MongoDB.
const mongoose = require('mongoose');
// mongoose-unique-validator un plugin qui ajoute une validation de pré-enregistrement pour les champs uniques dans un schéma Mongoose.
const uniqueValidator = require('mongoose-unique-validator');
// Function schema avec les champs email et password permet de créer un schéma de données pour base de données MongoDB.
const userSchema = mongoose.Schema({
    // Champ email contenant l'objet avec le type, si il est requis et unique
    email: { type: String, required: true, unique: true },
    // Champ password contenant l'objet avec le type et si il est requis
    password: { type: String, required: true} 
}); 

userSchema.plugin(uniqueValidator);
// Export du model terminé grace à mongoose.model(avec le nom du model, schema du model)
module.exports = mongoose.model('User', userSchema); 