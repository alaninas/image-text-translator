'use strict';
const express = require('express')
const hbs     = require('express-handlebars')
const dotenv  = require('dotenv');

// Intialise the express app
const app = express();
dotenv.config();

// Initiaze templating engine
app.set('views', require('path').join(__dirname, 'views'));
app.engine('hbs', hbs());
app.set('view engine', 'hbs');

// Set routes
app.use('/images', require('./services/crud'));

app.get('/', (req, res) => {
  res.redirect('/images');
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;