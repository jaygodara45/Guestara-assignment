// importing required modules
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDb } = require('./config/db');

// configure dotenv file
dotenv.config();

// connect to database
connectDb();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

// routes for category, subcategory and item
app.use('/api/v1/category', require('./routes/categoryRoutes'));
app.use('/api/v1/subcategory', require('./routes/subcategoryRoutes'));
app.use('/api/v1/item', require('./routes/itemRoutes'));

// route
app.get('/', (req, res)=>{
    return res.status(200).send("<h1>Welcome to NodeJS server </h1> <p>Developed by <b>Jay Godara</b> as an assignment by <b>Guestara</b></p>");
});

// port 
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`.bgMagenta);
})