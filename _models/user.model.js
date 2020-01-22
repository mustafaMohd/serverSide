const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new Schema({
 
  method: {type: String, enum: ['local', 'google', 'facebook'],required: true},
  fullname: {type:String, required:false},
  email: {type: String,lowercase: true}
  ,
  local: {
    // email: {  type: String,lowercase: true},
    password: {type: String}
  },
  google: {  id: {type: String},
    // email: {type: String,lowercase: true}
  },
facebook: {id: {type: String},
  // email: {type: String,lowercase: true}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    
  },
  resetPasswordToken:{type:String, required:false},
  resetPasswordExpires:{type:Date, required:false},  
  
  roles: [{
    type: String,
  }]
});

userSchema.plugin(mongoosePaginate);
// Create a model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;











// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     email: { type: String, unique: true, required: true },
//     hash: { type: String, required: true },

//     createdDate: { type: Date, default: Date.now }
// });

// userSchema.set('toJSON', { virtuals: true });

// module.exports = mongoose.model('User', userSchema);
