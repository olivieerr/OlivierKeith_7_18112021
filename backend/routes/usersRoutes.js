const express = require("express");
const usersCtrl = require("../controllers/usersController");
const auth = require("../middleware/auth.jwt");
const router = express.Router();

/**
 * @description creation d'un nouveau compte
 */
router.post("/auth/signup", usersCtrl.signup);

/**
 * @description connexion a un compte
 */
router.post("/auth/login", usersCtrl.login);

/**
 * @description listing de tous les comptes utilisateurs
 */
router.get("/user/", auth, usersCtrl.getAllUsers);

/**
 * @description Details d'un profil 
 */
router.get("/user/account/:id", auth, usersCtrl.userProfil);

/**
 * @description mise a jour d'un compte
 */
router.put("/user/account/:id", auth, usersCtrl.updateUser);

/**
 * @description connexion a un compte
 */
router.patch("/user/account", auth, usersCtrl.updateProfil);

/**
 * @description connexion a un compte
 */
router.delete("/user/account/:id", auth, usersCtrl.deleteAccount);

module.exports = router;