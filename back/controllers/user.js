// Constante qui appelle le fichier user dans le dossier models
const User = require('../models/user');
// Package de chiffrement bcrypt
const bcrypt = require('bcrypt');
// Package permettant de créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');
// ici nous créons les middleware.
// Un middleware est un bloc de code qui traite les requêtes et réponses de l'application. Chaque élément de middleware
// reçoit les objets request et response, peut les lire, les analyser et les manipuler. (req, res, next)
// La méthode next permet à chaque middleware de passer l'exécution au middleware suivant.
exports.signup = (req, res, next) => {
    // Crée un hash crypté du mdp user pour les enregistrer de manière sécurisée dans la bd. Le 10 : demande « saler » le mdp 10 fois. (+ valeur élevée, + longue exécution, hachage + sécurisé)
    bcrypt.hash(req.body.password, 10)
        .then(hash => { /* On recupere le hash */
            const user = new User({ /* On crée le nouvel utilisateur avec le model mongoose */
                email: req.body.email, /* On récupère l'adresse de cet utilisateur */
                password: hash /* On enregistre le hachage du mdp afin de ne pas stocker le mdp en clair*/
            });
            // Sauvegarde l'utilisateur crée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) /* On recherche dans la bd l'email de l'utilisateur */
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Paire identifiant / mot de passe incorrecte !' }); /* Si on le trouve pas, on renvoie une erreur */
            }
            bcrypt.compare(req.body.password, user.password) /* Sinon on compare les hachage grâce à bcrypt */
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); /* Si ne correspond pas, on renvoie une erreur */
                    }
                    res.status(200).json({ /* Sinon on retourne un objet avec les info necessaires à l'authentification de requetes emises à l'utilisateur */
                        userId: user._id, /* Id d'utilisateur */
                        token: jwt.sign( /*Fonction sign par jsonwebtoken */
                            { userId: user._id }, /* 1er argument : l'id de l'utilisateur pour verifier que c'est bien cet user */
                            'RANDOM_TOKEN_SECRET', /* 2e argument : clé d'encodage du token (a changer lors de la mise en prod) */
                            { expiresIn: '24h' } /* 3e argument : temps d'expiration du token */
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));/* Un problème de serveur interne */
        })
        .catch(error => res.status(500).json({ error }));
};