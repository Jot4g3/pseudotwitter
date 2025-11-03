const express = require("express");
const router = express.Router();
const { comments, posts, users } = require("../models");
const requireAuth = require("../util/requireAuth");

router.get("/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const listOfComments = await comments.findAll({
            where: { postId: postId },
            include: [
                {
                    model: users,
                    attributes: ["username"]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(listOfComments);
    } catch (err) {
        console.error(`Erro ao buscar comentários: ${err}`);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});

router.get("/:postId/count", async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await posts.findByPk(postId);

        if (!post){
            return res.status(404).json({error: "Post não encontrado."});
        };

        const count = await comments.count({
            where: { postId: postId }
        });

        res.status(200).json({postId: postId, commentCount: count});
    } catch (err) {
        console.error(`Erro ao contar comentário: ${err}`);
        res.status(500).json({error: "Erro interno do servidor."});
    }
});

router.post("/", requireAuth, async (req, res) => {
    try {
        const {body, postId} = req.body;

        if(!body || !postId) {
            return res.status(400).json({ error: "Comentário e postId são obrigatórios." });
        }

        const newComment = await comments.create({
            body,
            postId,
            userId: req.session.user.id
        });

        const populatedComment = await comments.findOne({
            where: { id: newComment.id },
            include: [
                {
                    model: users,
                    attributes: ["username"]
                }
            ]
        });

        return res.status(201).json(populatedComment);

    } catch (err) {
        console.error(`Erro ao postar comentário: ${err}`);
        return res.status(500).json({error: "Erro interno do servidor."});
    }
});

module.exports = router;