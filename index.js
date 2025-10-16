const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = require("./models");

const postRouter = require("./routes/posts");
app.use("/posts", postRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () =>{
        console.log("Running server in 3001 port.");
    });
});