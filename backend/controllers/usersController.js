/**
 * @imports
 */
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const model = require("../models");
const fs = require("fs");
const JWT_TOKEN_SECRET = 'n8V7ODddesfoy6OJzZRnM1j6MtGNJHzK';


/**
 * Déclarations des constantes globales
 */
const Post = model.messages;
const User = model.users;
const Comment = model.comment;
const { Op } = require("sequelize");

require("dotenv").config(); //process

exports.signup = async(req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    if (!firstName || !lastName) {
        return res.status(400).json({ error: "Le prénom ou le nom est vide !" });
    } else {
        if (!userName) {
            return res.status(400).json({ error: "Le pseudo est vide" });
        }
        if (!email) {
            return res.status(400).json({ error: "L'adrese e-mail est vide !" });
        }
        if (!password) {
            return res.status(400).json({ error: "Le mot de passe est vide" });
        }
    }

    //ici declaration de regex
    const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
    const regexName =
        /^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/;
    if (
        regexMail.test(email) &&
        regexPassword.test(password) &&
        regexName.test(firstName) &&
        regexName.test(lastName) &&
        regexName.test(userName)
    ) {
        bcryptjs.hash(password, 10) //On hash et on salt 10 fois
            .then((hash) => {
                //sauvegarder dans la base de donées => User
                const user = new User({
                    //...req.body,// pour tout récuperer
                    firstName: firstName,
                    lastName: lastName,
                    userName: userName,
                    email: email,
                    password: hash,
                    //email: CryptoJS.SHA256(req.body.email, process.env.EMAIL).toString()//ici je veux crypter
                });
                user.save() // On Sauvegarde tous cela dans la base de doneés
                    .then(() => {
                        return res.status(201).json({
                            message: "Félicitation, utilisateur crée !",
                        });
                    })
                    .catch((error) => {
                        console.error("test", error.message);
                        return res
                            .status(401)
                            .json({ error: " L'utilisateur a déjà été crée !" });
                    });
            })
            .catch((error) => {
                return res.status(500).json({ error: "Internal error" });
            });
    } else {
        return res
            .status(401)
            .json({ error: "Email, mot de passe ou le nom n'est pas bon" });
    }
};

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
        return res
            .status(400)
            .json({ message: "Désolé, l'adresse e-mail ne doit pas être vide " });
    }
    if (!password) {
        return res
            .status(400)
            .json({ message: "Désolé, le mot de passe ne doit pas être vide" });
    }

    hashedpassword = bcryptjs.hash(password, 10);
    User.findOne({
        where: {
            email: email,
        },
    })
        .then((user) => {
            if (!user) {
                return res
                    .status(400)
                    .json({ error: "Email ou mot de passe incorrect ! " });
            }
            bcryptjs.compare(password, user.password, (err, valid) => {
                if (!valid) {
                    return res.status(400).json({
                        accessToken: null,
                        error: "Email ou mot de passe incorrect !",
                    });
                } else {
                    //Ici pour roles après
                    res.status(200).json({
                        message: "vous avez reussi a vous connecter !",
                        token: jwt.sign({
                                userId: user.id,
                                isAdmin: user.isAdmin
                            },
                            JWT_TOKEN_SECRET, {
                                expiresIn: '24h'
                            }),
                        user: {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            userName: user.userName,
                            email: user.email,
                            isAdmin: user.isAdmin,
                        }, //the same as user: user, to retrieve the table and it's content
                    });
                }
            })
        })
        .catch((error) => {
            console.error(error.message, "Utilisateur non trouvé");
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        });
};

exports.getAllUsers = (req, res, next) => {
    User.findAll({
        attributes: ["id", "firstName", "lastName", "userName", "createdAt"],
    })
        .then((users) => {
            //console.log("user => ", users);
            if (users) {
                res
                    .status(200)
                    .json({ message: "Tous les utilisateurs disponibles", users });
            } else {
                return res.status(404).json({ message: "Il n'y a aucun utilisaturs" });
            }
        })
        .catch((error) => {
            console.error(error.message);
            return res.status(404).json({ error: "Il n'y a aucun utilisaturs" });
        });
};

exports.userProfil = (req, res) => {
    const userId = req.params.id;
    console.log("userId :", userId);
    User.findOne({
        where: {
            id: userId,
        },
        attributes: [
            "firstName",
            "lastName",
            "userName",
            "email",
            "createdAt",
            "isAdmin",
        ],
    }) //A veifier
        .then((user) => {
            res.status(200).json(user); //recuperer tous le model de user
        })
        .catch((error) => {
            res.status(404).json(error);
        });
};

exports.updateUser = (req, res) => {
    //Write to Update a User informations
    const updatedUser = req.params.id;
    const loggedUser = req.params.userId;
    //Operation ternaire si il y a des photos
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;

    //SELECT userId FROM User WHERE id= 2 par exemple
    if (!firstName || !lastName) {
        return res.status(400).json({ message: "Le prénom ou le nom est vide !" });
    } else {
        if (!userName) {
            return res.status(401).json({ message: "Le userName est vide" });
        }
        if (!email) {
            return res.status(401).json({ message: "L'émail est vide !" });
        }
        if (!password) {
            return res.status(401).json({ message: "Le mot de passe est vide" });
        }
    }

    //ici declaration de regex
    const regexMail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
    const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
    const regexName = /(.*[a-z]){3,30}/;
    if (
        regexMail.test(email) &&
        regexPassword.test(password) &&
        regexName.test(firstName) &&
        regexName.test(lastName) &&
        regexName.test(userName)
    ) {
        User.findOne({
            //Un user se connecte
            where: {
                id: loggedUser,
            },
        })
            .then((userLogged) => {
                console.log(userLogged);
                //Et, on met a jour le user qui a logé
                User.findOne({
                    where: {
                        id: updatedUser,
                    },
                })
                    .then((updatedUser) => {
                        //ici, unlink si il y a des images
                        if (userLogged && updatedUser == updatedUser) {
                            if (userLogged) {
                                bcryptjs
                                    .hash(password, 10)
                                    .then((hashedPassword) => {
                                        User.update({
                                            firstName,
                                            lastName,
                                            userName,
                                            email,
                                            password: hashedPassword,
                                            isAdmin
                                        }, {
                                            where: {
                                                id: updatedUser.id,
                                            },
                                        })
                                            .then((updated) => {
                                                if (updated) {
                                                    return res
                                                        .status(200)
                                                        .json({ message: "Utilisateur modifié" });
                                                } else {
                                                    return res.status(403).json({
                                                        error: "La modification d'utilisateur échoué !",
                                                    });
                                                }
                                            })
                                            .catch((error) => {
                                                console.error(error.message);
                                                return res.status(500).json({
                                                    error: "Impossible a mettre a jour, internal error",
                                                });
                                            });
                                    })
                                    .catch((error) => {
                                        console.error(error.message);
                                        return res
                                            .status(400)
                                            .json({ error: "Le mot de passe n'a pas pu être haché" });
                                    });
                            } else {
                                res
                                    .status(404)
                                    .json({ message: "L'utilisateur introuvable !" });
                            }
                        } else {
                            res.status(403).json({
                                error: "Vous n'avez pas d'autorisation pour modifier ce compte",
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error.message);
                        return res
                            .status(500)
                            .json({ error: "Internal error, update impossible" });
                    });
            })
            .catch((error) => {
                console.error(error.message);
                return res.status(401).json({
                    error: "Veuillez vous connectez pour modifier ce compte",
                });
            });
    } else {
        return res
            .status(401)
            .json({ message: "Email, mot de passe ou le nom n'est pas bon" });
    }
};

exports.updateProfil = (req, res) => {
    //Write to Update a User informations
    const loggedUserId = req.params.userId;

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;

    //ici declaration de regex
    const regexMail =
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
    const regexName = /^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/;
    if (
        (!email || regexMail.test(email)) &&
        (!password || regexPassword.test(password)) &&
        (!firstName || regexName.test(firstName)) &&
        (!lastName || regexName.test(lastName)) &&
        (!userName || regexName.test(userName))
    ) {
        User.findOne({
            where: {
                id: loggedUserId,
            },
        })
            .then(async(loggedUser) => {
                if (loggedUser) {

                    if (firstName) {
                        loggedUser.firstName = firstName;
                    }
                    if (lastName) {
                        loggedUser.lastName = lastName;
                    }
                    if (userName) {
                        loggedUser.userName = userName;
                    }
                    if (email) {
                        loggedUser.email = email;
                    }
                    if (password) {
                        loggedUser.password = await bcryptjs.hash(password, 10);
                    }
                    loggedUser.isAdmin = req.body.isAdmin;

                    User.update(loggedUser.dataValues, {
                        where: {
                            id: loggedUserId,
                        },
                    })
                        .then((updated) => {
                            if (updated) {
                                return res
                                    .status(200)
                                    .json({ message: "Utilisateur modifié", user: loggedUser });
                            } else {
                                return res.status(403).json({
                                    error: "La modification d'utilisateur échoué !",
                                });
                            }
                        })
                        .catch((error) => {
                            console.error(error.message);
                            return res.status(400).json({
                                error: "Impossible a mettre a jour",
                            });
                        });
                }
            })
            .catch((error) => {
                console.error(error.message);
                res.status(404).json({ error: "Utilisateur non trovué" });
            });
    } else {
        return res
            .status(401)
            .json({ message: "Email, mot de passe ou le nom n'est pas bon" });
    }
};

exports.deleteAccount = (req, res) => {
    const deletedUser = req.params.id;
    const loggedUser = req.params.userId; //l'id de user

    if (loggedUser != null) {
        User.findOne({
            //On cherche une id d'utilisateur
            attributes: ["id", "email", "userName", "isAdmin"],
            where: { id: loggedUser }, //l'id de user est trouvé et compare avec l'id dans la base de données
        })
            .then((user) => {
                //après avoir trouvé l'id de user on cherche tous les id associé a l'id trouvé plus haut
                Post.findAll({
                    where: { userId: deletedUser },
                })
                    .then((post) => {
                        Comment.findAll({
                            where: { userId: deletedUser },
                        })
                            .then((comment) => {
                                if (user && (user.isAdmin || deletedUser == loggedUser)) {
                                    User.destroy({
                                        where: {
                                            "id": deletedUser,
                                        },
                                    })
                                        .then((destroyed) => {
                                            for (const posts of post) {
                                                if (posts.imageUrl != null) {
                                                    const fileName = posts.imageUrl.split("/images/")[1];
                                                    fs.unlink(`images/${fileName}`, () => {
                                                        if (!destroyed) {
                                                            throw error;
                                                        } else {
                                                            // Si il n'y a pas d'erreur alors, l'erreur unlink est réussi
                                                            console.log("File deleted!");
                                                        }
                                                    });
                                                } else {
                                                    if (!destroyed) {
                                                        throw error;
                                                    } else {
                                                        // Si il n'y a pas d'erreur alors, l'erreur unlink est réussi
                                                        console.log("File deleted!");
                                                    }
                                                }
                                            }
                                            for (const comments of comment) {
                                                if (comments.imageUrl) {
                                                    const fileName =
                                                        comments.imageUrl.split("/images/")[1];
                                                    fs.unlink(`images/${fileName}`, () => {
                                                        if (!destroyed) {
                                                            throw error;
                                                        } else {
                                                            // Si il n'y a pas d'erreur alors, l'erreur unlink est réussi
                                                            console.log("File deleted!");
                                                        }
                                                    });
                                                } else {
                                                    if (!destroyed) {
                                                        throw error;
                                                    } else {
                                                        // Si il n'y a pas d'erreur alors, l'erreur unlink est réussi
                                                        console.log("File deleted!");
                                                    }
                                                }
                                            }
                                            // "error": "Ici, Internal error !"
                                            res
                                                .status(200)
                                                .json({ message: "Utilisateur supprimée !" });
                                        })
                                        .catch((error) => {
                                            console.error(error.message);
                                            return res
                                                .status(500)
                                                .json({ error: "Ici, Internal error !" });
                                        });
                                } else {
                                    res
                                        .status(403)
                                        .json({ error: "Vous n'avez pas d'autorisation" });
                                }
                            })
                            .catch((error) => {
                                console.error(error.message);
                                return res
                                    .status(404)
                                    .json({ error: "Commentaires introuvable" });
                            });
                    })
                    .catch((error) => {
                        console.error(error.message);
                        return res.status(404).json({ error: "Post introuvable" });
                    });
            })
            .catch((error) => {
                console.error(error.message);
                return res.status(403).json({ error: "Utilisateur n'existe pas !" });
            });
    } else {
        return res.status(500).json({ error: "internal Error" });
    }
};