const config = require('../Config/config.js');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(config.connectionString,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;


module.exports = {
    User: require('../users/user.model')
};