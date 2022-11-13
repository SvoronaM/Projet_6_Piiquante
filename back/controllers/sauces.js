// Appelle du fichier Sauces dans le dossier models
const Sauce = require("../models/Sauce");
// Package qui fournit des fonctionnalités très utiles pour accéder et interagir avec le système de fichiers
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse( /* Récupère les informations du formulaire */
        req.body.sauce
    );
    delete sauceObject._id; /* Supprimer le faux id envoyé par le front */
    const sauce = new Sauce({
        ...sauceObject , /* Le spread ... est utilisé pour faire une copie de tous les éléments de sauceObject */
        imageUrl: `${req.protocol}://${req.get("host")}/images/${ /* On ajoute l'image */
            req.file.filename
        }`,
        likes: 0 , /* On ajoute le like à 0 */
        dislikes: 0 , /* On ajoute le dislike à 0 */
    });
    sauce
        .save() /* On sauvegarde la sauce */
        .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    }) /* On recherche dans la bd la sauce avec son id */
        .then((sauce) => {
            /* On la récupère */
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find() /* On recherche dans la bd toutes les sauces */
        .then((sauces) => {
            /* On les récupère */
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.modifySauce = (req, res, next) => {
    let sauceObject = {}; /* On crée un objet SauceObject vide */
    if (req.file) {
        /* Si on upload un fichier */
        sauceObject = {
            /* On récupère notre objet  */
            ...JSON.parse(
                req.body.sauce
            ), /* En parsant la chaine de caractères (transforme un objet stringifié en Object JavaScript exploitable) */
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
            }`, /* Et on recréé l'URL complète de l'image */
        };
    } else {
        // Sinon si il n'y a pas de fichier transmis
        sauceObject = { ...req.body }; /* On récupère body de la requête */
    }
    delete sauceObject._userId; /* On supprime l'user id recupéré par le nouvel objet par sécurité */
    Sauce.findOne({
        _id: req.params.id, /* on recherche la sauce grâce à l'id récupéré dans la bdd */
    })
        .then((sauce) => {
            // Si l'user id récupéré dans la bd n'est pas le même que id user de auth
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({
                    message: "action non-autorisée", /* C'est une action non authorisée */
                });
            } else {
                // Sinon c'est ok, on met ensuite à jour
                Sauce.updateOne(
                    {
                        _id: req.params.id, /* 1er argument : id de l'objet que l'on souhaite modifier */
                    } ,
                    {
                        ...sauceObject,
                        _id: req.params.id, /* 2nd argument : nouvelle version de l'objet, l'id correspond à celui da la bd */
                    }
                )
                    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id, /* On recherche dans la bd la sauce avec son id */
    })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            // Si l'user id récupéré dans la bd n'est pas le même que id user de auth
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({
                    message: "action non-autorisée", /* C'est une action non authorisée */
                });
            } else {
                // Sinon c'est ok, on met ensuite à jour
            Sauce.deleteOne({
                _id: req.params.id, /* On supprime la sauce ayant l'id recupéré dans la bd */
            })
                .then(() => {
                    fs.unlink(`images/${filename}`, () => {});
                    res.status(200).json({ message: "Sauce supprimée !" });
                })
                .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.likedSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (req.body.like == 1 && !sauce.usersLiked.includes(req.auth.userId)) {/* Si l'utilisateur like une sauce */
            Sauce.updateOne(/* On met a jour la sauce de la page */
                { _id: req.params.id }, /* On récupère l'id dans la bd */
                {
                    $inc: { likes: 1 }, /* (L'opérateur $inc incrémente un champ d'une valeur spécifiée) on lui ajoute 1 like et on push l'id de l'utilisateur qui a liké dans la sauce */
                    $push: { usersLiked: req.body.userId },
                }
            )
                .then(() =>
                    res.status(200).json({ message: "Vous avez liké la sauce ! :)" })
                )
                .catch((error) => res.status(400).json({ error }));
        } else if (req.body.like == -1 && !sauce.usersDisliked.includes(req.body.userId)) {/* Sinon si l'utilisateur dislike une sauce */
            Sauce.updateOne(/* On met à jour la sauce de la page */
                { _id: req.params.id } , /* On récupère l'id dans la bdd */
                {
                    $inc: { dislikes: 1 },/* On lui ajoute 1 dislike */
                    $push: { usersDisliked: req.body.userId }, /* et on push l'id de l'utilisateur qui a liké dans la sauce */
                }
            )
                .then(() =>
                    res.status(200).json({ message: "Vous avez disliké la sauce ! :(" })
                )
                .catch((error) => res.status(400).json({ error }));
        } else {
            // Sinon
            if (sauce.usersLiked.includes(req.body.userId)) { /* Si l'userId est présent dans les usersLiked alors */
                Sauce.updateOne( /* On met à jour la sauce */
                    {
                        _id: req.params.id, /* On récupère l'id de la sauce dans la bd */
                    },
                    {
                        $inc: { likes: -1 }, /* On retire un like  */
                        $pull: { usersLiked: req.body.userId }, /* Et on retire l'utilisateur des usersLiked */
                    }
                )
                    .then(() =>
                        res.status(200).json({ message: "Vous avez disliké la sauce ! :(" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            } else if (sauce.usersDisliked.includes(req.body.userId)) { /* Sinon si l'userId est présent dans les usersDisliked alors */
                Sauce.updateOne( /* On met à jour la sauce */
                    {
                        _id: req.params.id, /* On récupère l'id de la sauce dans la bdd */
                    },
                    {
                        $inc: { dislikes: -1 }, /* On retire un dislike */
                        $pull: { usersDisliked: req.body.userId }, /*et on retire l'utilisateur des usersLiked */
                    }
                )
                    .then(() =>
                        res.status(200).json({ message: "Vous avez disliké la sauce ! :(" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }
        }
    });
};