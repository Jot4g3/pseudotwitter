require('dotenv').config()

const express = require("express");
const app = express();
const session = require("express-session");

const cors = require("cors");

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

app.use(
    session({
        secret: process.env.JWT_PASS,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, 
            maxAge: 1000 * 60 * 60 * 24 
        },
    })
);

const db = require("./models");

const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);

const usersRouter = require('./routes/users');
app.use("/users", usersRouter)

db.sequelize.sync().then(() => {
    app.listen(3001, () =>{
        console.log("Running server in 3001 port.");
    });
});