const connectToMongo  = require('./db.js');
const express = require('express');

connectToMongo();  // connected to database
const app = express()
const port = 3000

app.use(express.json()); 

app.use('/api/auth', require('./routes/auth')); //Authentication endpoints.
app.use('/api/notes', require('./routes/notes')); // Notes CRUD endpoints.


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
