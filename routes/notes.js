const mongoose = require("mongoose");
const { Router } = require("express");
const userDAO = require("../daos/user");
const notesDAO = require("../daos/notes");
const tokenDAO = require("../daos/token");

const router = Router();

// Check login credentials
const logInCheck = async (req,res,next) => {
    const header = req.headers.authorization;
        if (header) {
            const tokenHeader = header.split(' ')[1];
            req.token = tokenHeader;
            if (req.token) {
                const userId = await tokenDAO.tokenUser(req.token);
                if (userId) {
                    req.userId = userId;
                    next();
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
    } 
};
router.use(logInCheck)

// Create a note
router.post("/", async (req, res, next) => {
    const text = req.body;
    const user = req.userId;
    if (!req.token) {
        res.status(401).send('You don\'t have a token.');
    }
    else if (!user) {
        res.status(404).send('Access denied');
    }
    else {
        const note = await notesDAO.createNote(text, user);
        res.json(note)
    }
    next()
})

// Find a specific note
router.get("/:id", async (req, res, next) => {
    const noteId = req.params.id;
    const user = req.userId;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).send("The ID type is invalid.");
    }
    else if (!req.token) {
        res.status(401).send('You don\'t have a token.');
    }
    else if (!user) {
        res.status(404).send('Access denied');
    }
    else {
        const note = await notesDAO.getSingleNote(noteId, user);
        if (note) {
            res.json(note)
        }
        else {
            res.status(404).send('That note does not exist')
        }
    }
    next()
})

// find all notes
router.get("/", async (req, res, next) => {
    const user = req.userId;
    if (!req.token) {
        res.status(401).send('You don\'t have a token.');
    }
    else if (!user) {
        res.status(404).send('Access denied');
    }
    else {
        const notes = await notesDAO.getNotes(user);
        res.json(notes)
    }
    next()
})


module.exports = router;
