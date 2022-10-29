// Package permettant de créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { /* on exporte une function qui sera le middleware */
    try {
        // On sépare avec un espace le token du headers authorization, du bearer. Et on récupère le token qui est en 2eme
        const token = req.headers.authorization.split(' ')[1];
        // On vérifie que le token de l'utilisateur est bien le même que la clé (avec la méthode verify)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // On récupère le user id du token décodé
        const userId = decodedToken.userId;
        // On le rajoute à l'objet request afin que les routes puissent l'exploiter
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};