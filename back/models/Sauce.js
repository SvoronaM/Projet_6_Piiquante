// Mongoose est un package qui facilite les interactions avec la base de données MongoDB
const mongoose = require("mongoose");
// Schema avec les différents requis pour créer une sauce (donnés dans les requirements)
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: [{ type: String, required: true }],
    usersDisliked: [{ type: String, required: true }],
}); /*  */
// Export du model terminé grace à mongoose.model(avec le nom du model, schema du model)
module.exports = mongoose.model("Sauce", sauceSchema);