require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/error-handler');
const helmet = require('helmet');
const passport=require('passport');
var fs = require('fs');
var https = require('https');



var privateKey  = fs.readFileSync('certFiles/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('certFiles/selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
// use JWT auth to secure the api
// app.use(jwt());

// api routes

// app.use('/post', require('./users/user.controller'));
app.use('/auth', require('./_auth/auth.controller'));

app.use('/users', require('./_users/user.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;

// var httpsServer = https.createServer(credentials, app);

// httpsServer.listen(port, function () {
//     console.log('Server listening on port ' + port);
//     console.log('https://localhost:3000');    
// });