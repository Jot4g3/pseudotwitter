const express = require("express");
const router = express.Router();
const { users, posts } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username e password são obrigatórios." });
        }

        const existingUser = await users.findOne({ where: { username: username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username já existe." });
        }

        const hash = await bcrypt.hash(password, 10);
        
        await users.create({
            username: username,
            password: hash,
        });
        
        res.status(201).json({ message: "Usuário criado com sucesso." });

    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await users.findOne({ where: { username: username } });
        if (!user) {
            return res.status(400).json({ error: "Usuário ou senha incorretos." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Usuário ou senha incorretos." });
        }

        req.session.user = {
            id: user.id,
            username: user.username
        };
        
        res.json(req.session.user);

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

router.get("/me", (req, res) => {
    if (req.session.user) {
        return res.json(req.session.user);
    } else {
        return res.status(401).json({ error: "Usuário não autenticado." });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Falha ao fazer logout." });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logout com sucesso." });
    });
});
module.exports = router;