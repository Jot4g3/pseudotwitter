const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = require("./models");

const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () =>{
        console.log("Running server in 3001 port.");
    });
});