'use strict';
const express = require('express')
const exphbs    = require('express-handlebars')
const dotenv  = require('dotenv');
const hbs  = require('./helpers/handlebars.helper.js')(exphbs);

// Intialise the express app
const app = express();
dotenv.config();

// Initiaze templating engine
app.set('views', require('path').join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Set static
app.use(express.static(require('path').join(__dirname, '/public')));

// Set routes
app.use('/images', require('./services/images'));

app.get('/', (req, res) => {
  res.redirect('/images');
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;