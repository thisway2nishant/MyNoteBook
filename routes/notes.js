const express = require("express");
const Note = require("../models/Notes");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require("express-validator");

// GET: Getting all notes saved by user.Endpoint: /api/notes/getNotes. Login Required
router.get('/getNotes', fetchuser, async (req, res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch(error){
        console.error(error);
        res.status(500).send("Some error occured.")
      }
})
//=--------------------------------------------------------------------------------------//

// POST: Adding a new note by user.Endpoint: /api/notes/addNote. Login Required
router.post('/addNote', [
    body("title", "Title must be at least 3 characters long").isLength({ min: 3 }),
    body("description", "Description must be at least 6 characters long").isLength({ min: 6 }),
  ], fetchuser, async (req, res)=>{

    // Finds errors IN VALIDATION and returns bad request.
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

//-----------------------------------------------------------------------------------------//

//PUT: Updating a note by the user. Endpoint: /api/notes/updateNote. LOGIN required.
router.put('/updateNote/:id', fetchuser, async (req, res)=>{
  const {title, description, tag} = req.body;
try {

  const newNote = {};
  if(title){newNote.title = title;}
  if(description){newNote.description = description;}
  if(tag){newNote.tag = tag;}

  // FInd if the note exists.
  let note = await Note.findById(req.params.id);
  if(!note){res.status(404).send("Not Found")}

  //find if the note is of the same user that is logged in.
  if(note.user.toString() !== req.user.id){{res.status(401).send("Not Allowed")}}

  //update note.
  note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
  res.json(note);
 } catch(error){
  console.error(error);
  res.status(500).send("Some error occured.")
}
})

//--------------------------------------------------------------------------------------//

// DELETE: Delete a note by the user. Endpoint: /api/notes/deleteNote/:id. Login Required.
router.delete('/deleteNote/:id', fetchuser, async (req,res)=>{
  try {

  // check if the note exists.
  let note = await Note.findById(req.params.id);
  if(!note){res.status(404).send("Not Found")}

  //check if the note is by the same user which is logged in.
  if(note.user.toString() !== req.user.id){{res.status(401).send("Not Allowed")}}
  
  // delete note.
  note = await Note.findByIdAndDelete(req.params.id);
  res.json({"Success": "Note has been deleted", note: note});
  }  catch(error){
    console.error(error);
    res.status(500).send("Some error occured.")
  }
})
//---------------------------------------------------------------------------------------------//

module.exports = router;