const express = require("express");
const helmet = require("helmet");
//Connexion
const model = require("./models");
const commentRoutes = require("./routes/commentRoutes");
const messagesRoutes = require("./routes/messageRoutes");
const usersRoutes = require("./routes/usersRoutes");
const app = express();
const path = require("path");

model.sequelize.sync();

require("dotenv").config();

// Met le view engine dans le ejs
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Pour lire le format application/JSON
app.use(express.json());
//Pour lire le format application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Helmet pour securiser les cookies
app.use(helmet());

//app.use()
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api", messagesRoutes);
app.use("/api", commentRoutes);
app.use("/api", usersRoutes);

module.exports = app;