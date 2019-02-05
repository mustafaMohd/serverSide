


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose =require( 'passport-local-mongoose') ;

const userSchema = new Schema({
    email: { type: String,required: true, 
        trim: true ,unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  

     },
     facebookProvider: {
        type: {
              id: String,
              token: String
        },
        select: false
  },

    //  provider: { type: String },
     

    // profile_picture: { type: String },

    hash: { type: String, required: true },
    email_verified: { type:Boolean },
        
    createdDate: { type: Date, default: Date.now }
});

userSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('User', userSchema);






















//Tested Code
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     email: { type: String, unique: true, required: true },
//     hash: { type: String, required: true },
    
//     createdDate: { type: Date, default: Date.now }
// });

// userSchema.set('toJSON', { virtuals: true });

// module.exports = mongoose.model('User', userSchema);
