const express = require("express");
const postCtrl = require("../controllers/messageController");
const auth = require("../middleware/auth.jwt");
const router = express.Router();
const multer = require("../middleware/multer-config");


/**
 * @description creation d'un message
 */
router.post("/message/", auth, multer, postCtrl.createPost);

/**
 * @description listing de tous les messages
 */
router.get("/message/", auth, postCtrl.getAllPost);

/**
 * @description Listing de tous les messages d'un utilisateur
 */
router.get("/message/:id", auth, postCtrl.getMyPosts);

/**
 * @description Mise a jour d'un message d'un utilisateur
 */
router.put("/message/:id", auth, multer, postCtrl.updatePost);

/**
 * @description Suppression d'un message
 */
router.delete("/message/:id", auth, postCtrl.deletePost);

module.exports = router;