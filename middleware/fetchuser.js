const jwt = require('jsonwebtoken');
require('dotenv').config();


const fetchuser = (req,res,next)=>{
  const token = req.header('Auth-Token');
  if(!token){
      res.status(401).send({error: "Token field can't be empty."})
  }

  try {
      const data = jwt.verify(token, process.env.JWT_SIGN);
      req.user = data.user;
      next();
  } catch (error) {
    res.status(401).send({error: "Please authenticate using a valid token."})
  }
}

module.exports = fetchuser;