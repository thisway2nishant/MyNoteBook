const express = require("express");
const Note = require("../models/Notes");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require("express-validator");

router.get('/getNotes', fetchuser, async (req, res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch(error){
        console.error(error);
        res.status(500).send("Some error occured.")
      }
})

router.post('/addNote', [
    body("title", "Title must be at least 3 characters long").isLength({ min: 3 }),
    body("description", "Description must be at least 6 characters long").isLength({ min: 6 }),
  ], fetchuser, async (req, res)=>{

    // Finds errors and returns bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {title, description, tag} = req.body;

    try {
        const note = new Note({title, description, tag, user: req.user.id});
        const savedNote = await note.save();
        res.json(savedNote);
    } catch(error){
        console.error(error);
        res.status(500).send("Some error occured.")
      }
})

router.put('/updateNote/:id', fetchuser, async (req, res)=>{
  const {title, description, tag} = req.body;

  const newNote = {};
  if(title){newNote.title = title;}
  if(description){newNote.description = description;}
  if(tag){newNote.tag = tag;}

  let note = Note.findById(req.params.id);
  if(!note){res.status(404).send("Not Found")}

  if(note.user.toString() !== req.user.id){{res.status(401).send("Not Allowed")}}

  note = Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
  res.json(note);
})

module.exports = router;