const express = require("express");
const router = express.Router();
const { posts, users, comments, sequelize } = require("../models");
const requireAuth = require("../util/requireAuth");

router.get("/", async (req, res) => {
    try {
        const listOfPosts = await posts.findAll({
            include: [
                {
                    model: users,
                    attributes: ['username']
                },
                {
                    model: comments,
                    attributes: [],
                }
            ],
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("comments.id")), "commentCount"]
                ]
            },
            group: [
                'posts.id', 
                'posts.title', 
                'posts.text', 
                'posts.createdAt', 
                'posts.updatedAt', 
                'posts.userId',
                'user.id',
                'user.username'
            ],
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
        const { id } = req.params;

        const post = await posts.findOne({
            where: { id },
            include: [
                {
                    model: users,
                    attributes: ['username']
                },
                {
                    model: comments,
                    attributes: ['id'] // Pega IDs dos comentários para contar depois
                }
            ]
        });

        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }

        // Adiciona commentCount manualmente
        const result = {
            id: post.id,
            title: post.title,
            text: post.text,
            createdAt: post.createdAt,
            user: post.user,
            commentCount: post.comments.length
        };

        res.json(result);

    } catch (error) {
        console.error("Erro ao buscar post por ID:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});


router.post("/", requireAuth, async (req, res) => {
    try {
        const {title, text} = req.body;
        
        if (!title || !text) {
             return res.status(400).json({ error: "Os campos título e detalhes são obrigatórios." });
        }   

        const newPost = await posts.create({
            title,
            text,
            userId: req.session.user.id
        });

        const fullPost = await posts.findOne({
            where: { id: newPost.id },
            include: {
                model: users,
                attributes: ['username']
            }
        });

        res.status(201).json(fullPost); 

    } catch (err) {
        console.error("Erro ao criar post:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;