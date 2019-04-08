const express = require('express');
const app = express();
const path=require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('../helpers/error-handler');
const helmet = require('helmet');
const passport = require('passport');





app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
var distDir ='../../ClientSide/dist/ClientSide/'; 
app.use(express.static(path.join(__dirname, distDir)))
app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, distDir + '/index.html'));
});


// use JWT auth to secure the api
// app.use(jwt());

// api routes

// app.use('/post', require('./users/user.controller'));
app.use('/api/auth', require('../_auth/auth.controller'));

app.use('/api/users', require('../_users/user.controller'));

// global error handler
app.use(errorHandler);


module.exports = app;