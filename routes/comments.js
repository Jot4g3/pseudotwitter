const express = require("express");
const router = express.Router();
const {comments, posts} = require("../models");

router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const comments = await comments.findAll({where: {postId : postId}});
    res.json(comments);
})

router.get("/:postId/count", async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await posts.findByPk(postId);

        if (!post){
            return res.status(404).json({error: "Post não encontrado."});
        };

        const count = await comments.count({
            where: {
                postId: postId
            }
        });

        res.status(200).json({postId: postId, commentCount: count})
    } catch (err) {
        console.error(`Erro ao contar comentário: ${error}`)
        res.status(500).json({error: "Erro interno do servidor."})
    }
    
})

router.post("/", async (req, res) => {
    const comment = req.body;
    await comments.create(comment);
    res.json(comment);
});

module.exports = router;