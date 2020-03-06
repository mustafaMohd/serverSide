const express = require('express');
const app = express();
const path=require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('../helpers/error-handler');
const helmet = require('helmet');
const passport = require('../helpers/passport');
const passportJWT = passport.authenticate('jwt', { session: false });







app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
const distDir ='../../ClientSide/dist/ClientSide'; 
app.use(express.static(path.join(__dirname, distDir)))
app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, distDir + '/index.html'));
});


// use JWT auth to secure the api
// app.use(jwt());

// api routes

// app.use('/post', require('./users/user.controller'));
app.use('/api/auth', require('../_auth/auth.controller'));

app.use('/api/admin/users',passportJWT, require('../_admin/user/user.controller'));

// global error handler
app.use(errorHandler);


module.exports = app;
