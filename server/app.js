const express = require("express") 
const app = express(); 
const dotenv = require('dotenv').config();

const configRoutes = require('./routes');


const cors = require("cors") 

app.use(express.json());

app.use(cors())

configRoutes(app);

app.listen(process.env.PORT || 3100,() => {
  console.log("We've now got a server!"); 
  console.log('Your routes will be running on http://localhost:3100');
});