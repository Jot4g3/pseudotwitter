const express = require("express");
const router = express.Router();
const { posts, sequelize } = require("../models");

router.get("/", async (req, res) => {
    try {
        const listOfPosts = await posts.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comments
                            WHERE comments.postId = posts.id
                        )`),
                        'commentCount'
                    ]
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        
        res.json(listOfPosts);

    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        
        const post = await posts.findOne({
            where: { id: id },
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comments
                            WHERE comments.postId = posts.id
                        )`),
                        'commentCount'
                    ]
                ]
            }
        });

        if (!post) {
            return res.status(44).json({ error: "Post não encontrado" });
        }
        
        res.json(post);

    } catch (error) {
        console.error("Erro ao buscar post por ID:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

router.post("/", async (req, res) => {
    try {
        const post = req.body;
        
        if (!post.title || !post.text || !post.username) {
             return res.status(400).json({ error: "Todos os campos (title, text, username) são obrigatórios." });
        }

        const newPost = await posts.create(post);
        res.status(201).json(newPost); 

    } catch (error) {
        console.error("Erro ao criar post:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;