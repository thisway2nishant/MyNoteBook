const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const privateKey = "pagalhaikya";

router.post(
  "/",
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

    const authToken = jwt.sign(data, privateKey);

    res.json(authToken);
 }
);

module.exports = router;
