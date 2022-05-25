const connectToMongo  = require('./db.js');
const express = require('express');

connectToMongo();
const app = express()
const port = 3000

app.use(express.json());

app.use('/api/auth/SignUp', require('./routes/auth'));
app.use('/api/auth/login', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
