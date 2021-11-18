// const fse = require("fs-extra");
const model = require("../models");
const fs = require("fs");
const { error } = require("console");

const Post = model.messages;
const User = model.users;
const Comment = model.comment;

/**
    * @name createComment
    * @description Methode d'ajout d'un nouveau commentaire
    * @param {Requete Http} req 
    * @param {Response Json} res 
    */
exports.createComment = (req, res) => {
    //Declarations des varibales pour récuperer les données du modèles
    const userId = req.params.userId; //userId du user
    const postId = req.params.messageId; // postId du post
    console.log(userId, postId);
    const commentPost = req.body.comment;
    const urlImage = req.file ?
        `${req.protocol}://${req.get("host")}/images/${req.file.filename}` :
        null;

    const comment = new Comment({
        comment: commentPost,
        imageUrl: urlImage,
        userId: userId, //original userId,
        messageId: JSON.parse(postId),
    });
    comment
        .save()
        .then((created) => {
            if (created) {
                Comment.findOne({
                        where: { id: created.id },
                        include: [{
                            model: User,
                            attributes: ["lastName", "firstName", "userName"],
                        }, ],
                    })
                    .then((commentFounded) => {
                        res.status(200).json({
                            message: "Le comment est trouvé et sauvegardé à la base de donées",
                            comment: commentFounded,
                        });
                    })
                    .catch((error) => {
                        console.error(error.message);
                        return res
                            .status(404)
                            .json({ error: "Le comment est introuvable" });
                    });
            }
        })
        .catch((error) => {
            console.error(error.message);
            return res.status(500).json({ error });
        });
},

exports.getAllComments = (req, res) => {
    Comment.findAll({
            include: [{
                    model: User,
                    attributes: ["userName"],
                },
                {
                    model: Post,
                    attributes: ["postContent", "imageUrl"],
                },
            ],
            order: ["createdAt"],
        })
        .then((comment) => {
            if (comment <= null) {
                return res.status(404).json({ message: "Pas de Commentaires!" });
            } else {
                return res.status(200).json({ comment });
            }
        })
        .catch((error) => {
            console.error(error.message);
            return res.status(500).json({ error });
        });
},

exports.updateComment = (req, res) => {
    const commentId = req.params.id;
    const userId = req.params.userId;
    const comment = req.body.comment;
    const commentObject = req.file ? {
        comment: req.body.comment,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    } : { comment };

    User.findOne({
            attributes: ["id", "email", "userName", "isAdmin"],
            where: { id: userId },
        })
        .then((user) => {
            Comment.findOne({
                    where: {
                        id: commentId,
                        // Il n'y a que l'utilisateur qui a poster le commentaire qui peut le modifier
                        userId: user.id
                    },
                })
                .then((commentFind) => {
                    console.log("Hello", commentFind.comment);
                    console.log("Hello", commentFind.imageUrl);
                    if (commentFind.imageUrl != null) {
                        const fileName = commentFind.imageUrl.split("/images/")[1];
                        console.log("fileName", fileName);
                        fs.unlink(`images/${fileName}`, () => {
                            if (user && (user.isAdmin || user.id == commentFind.userId)) {
                                if (commentFind) {
                                    Comment.update(commentObject, {
                                            where: { id: commentId },
                                        })
                                        .then((updated) => {
                                            console.log("ici updateeeeeeeeeed", updated);
                                            Comment.findOne({
                                                    where: {
                                                        id: commentId,
                                                    },
                                                })
                                                .then((updatedFound) => {
                                                    if (!updatedFound) {
                                                        throw error;
                                                    } else {
                                                        // Si il n'y a pas d'erreur alors, l'erreur unlink est réussi
                                                        console.log("Modified!");
                                                        return res.status(200).json({
                                                            message: "Commentaire modifiée",
                                                            comments: updatedFound,
                                                        });
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.error(error.message);
                                                    return res(401).json({
                                                        error: " La modification échouée",
                                                    });
                                                });
                                        })
                                        .catch((error) => {
                                            console.error(error.message);
                                            return res.status(500).json({ error: "internal error" });
                                        });
                                } else {
                                    res
                                        .status(404)
                                        .json({ message: "Le commentaire est introuvable" });
                                }
                            } else {
                                res.status(403).json({
                                    message: "Vous n'avez pas l'autorisation pour modifier ce commentaire!",
                                });
                            }
                        });
                    } else {
                        if (user && (user.isAdmin || user.id == commentFind.userId)) {
                            if (commentFind) {
                                Comment.update(commentObject, {
                                        where: { id: commentId },
                                    })
                                    .then((updated) => {
                                        console.log("ici updateeeeeeeeeed", updated);
                                        Comment.findOne({
                                                where: {
                                                    id: commentId,
                                                },
                                            })
                                            .then((updatedFound) => {
                                                if (!updatedFound) {
                                                    throw error;
                                                } else {
                                                    // Si il n'y a pas d'erreur alors, unlink est réussi
                                                    console.log("Modified!");
                                                    return res.status(200).json({
                                                        message: "Commentaire modifiée",
                                                        comments: updatedFound,
                                                    });
                                                }
                                            })
                                            .catch((error) => {
                                                console.error(error.message);
                                                return res(401).json({
                                                    error: " La modification échouée",
                                                });
                                            });
                                    })
                                    .catch((error) => {
                                        console.error(error.message);
                                        return res.status(500).json({ error: "internal error" });
                                    });
                            } else {
                                res
                                    .status(404)
                                    .json({ message: "Le commentaire est introuvable" });
                            }
                        } else {
                            res.status(403).json({
                                message: "Vous n'avez pas l'autorisation pour modifier ce commentaire!",
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                    return res.status({ message: "Commentaire introuvable!" });
                });
        })
        .catch((error) => {
            console.log(error.message);
            return res
                .status(403)
                .json({ message: "Vous n'avez pas d'autorisation!" });
        });
},

exports.deleteComment = (req, res) => {
    const commentId = req.params.id; // l'id du post
    const userId = req.params.userId; //l'id de user
    User.findOne({
            //On cherche une id d'utilisateur
            attributes: ["id", "email", "userName", "isAdmin"],
            where: { id: userId }, //l'id de user est trouvé et compare avec l'id dans la base de données
        })
        .then((user) => {
            //après avoir trouvé l'id de user
            Comment.findOne({
                    where: {
                        id: commentId,
                    },
                })
                .then((comment) => {
                    console.log("ici::::::::::::::", comment.imageUrl);
                    if (comment.imageUrl != null) {
                        const fileName = comment.imageUrl.split("/images/")[1];
                        fs.unlink(`images/${fileName}`, () => {
                            if (user && (user.isAdmin || user.id == comment.userId)) {
                                //on fait une condition, si c'est un admin (true) ou si c'est l'id de l'utilisateur, on peut accder a la publication
                                //Si l'id de post a été envoyé dans la requête
                                //Il faut faire une requête postId pour vérifier s'il existe en bdd avant destroy, si non on envoie message erreur
                                Comment.destroy({
                                        where: { id: comment.id }, // Alors, on trouve l'id du poste cet utilisateur là
                                    })
                                    .then(() => {
                                        return res.status(200).json({
                                            message: "Publication supprimée",
                                            comments: comment,
                                        });
                                    })
                                    .catch(() => {
                                        console.error(error.message);
                                        return res.status(500).json({ error });
                                    });
                            } else {
                                return res.status(403).json({
                                    message: "Vous n'avez pas d'autorisation effacer ce post !",
                                });
                            }
                        });
                    } else {
                        if (user && (user.isAdmin || user.id == comment.userId)) {
                            //on fait une condition, si c'est un admin (true) ou si c'est l'id de l'utilisateur, on peut accder a la publication
                            //Si l'id de post a été envoyé dans la requête
                            //Il faut faire une requête postId pour vérifier s'il existe en bdd avant destroy, si non on envoie message erreur
                            Comment.destroy({
                                    where: { id: comment.id }, // Alors, on trouve l'id du poste cet utilisateur là
                                })
                                .then(() => {
                                    return res.status(200).json({
                                        message: "Publication supprimée",
                                        comments: comment,
                                    });
                                })
                                .catch(() => {
                                    console.error(error.message);
                                    return res.status(500).json({ error });
                                });
                        } else {
                            // Si on ne trouve pas ni l'admin ni l'utilisateur qui a publier cette pubication, alors, on a pas acces pour effacer la publication
                            return res.status(403).json({
                                message: "Vous n'avez pas d'autorisation effacer ce post !",
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                    res.status(404).json({ message: "Le commentaire n'existe pas!" });
                });
        })
        .catch((error) => {
            console.error(error.message);
            return res.status(500).json({ error });
        });
}
