const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
require('dotenv').config();


//create a new user and save to database. no login required.
router.post(
  "/SignUp",
  [
    body("name", "Must be at least 3 characters long").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
  ],
  async (req, res) => {

    // Finds errors and returns bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user with email already exists.
    let user = await User.findOne({email: req.body.email});
    if(user){
        res.status(400).json({error: "Sorry, a user with this Email already exists."})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    const data = {
        user:{
            id: user.id
        }
    }

    const authToken = jwt.sign(data, process.env.JWT_SIGN);

    res.json(authToken);
 }
);

// Login user with credentials. no login required.
router.post(
  "/login",
  [
    body("email", "Please enter a valid mail address.").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    // Finds errors and returns bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }

    const {email, password} = req.body;
    try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: 'Please login with correct credentials'});
    }

    const passComp = await bcrypt.compare(password, user.password);
    if(!passComp){
      return res.status(400).json({error: 'Please login with correct credentials'});
    }

    const data = {
      user:{
          id: user.id
      }
    }

    const authToken = jwt.sign(data, process.env.JWT_SIGN);
    res.json(authToken);
    }
    catch(error){
      console.error(error);
      res.status(500).send("Some error occured.")
    }

  } 
)

// Get user data. login required.
router.post(
  "/getUser",
  fetchuser,
  async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user);
    } catch(error){
      console.error(error);
      res.status(500).send("Some error occured.")
    }
  }
)
module.exports = router;
