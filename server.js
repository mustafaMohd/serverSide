require('rootpath')();
var https = require('https');
var app = require('./Config/express');
var fs = require('fs');

var privateKey  = fs.readFileSync('certFiles/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('certFiles/selfsigned.crt', 'utf8');
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;


var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, function () {
    console.log('Server listening on port ' + port);
    console.log('https://localhost:3000');    
});