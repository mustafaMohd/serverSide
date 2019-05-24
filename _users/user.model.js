const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  roles: [{
    type: String,
  }]
});

// userSchema.pre('save', async function(next) {
//   try {
//     console.log('entered');
//     if (this.method !== 'local') {
//       next();
//     }

//     // Generate a salt
//     const salt = await bcrypt.genSalt(10);
//     // Generate a password hash (salt + hash)
//     const passwordHash = await bcrypt.hash(this.local.password, salt);
//     // Re-assign hashed version over original, plain text password
//     this.local.password = passwordHash;
//     console.log('exited');
//     next();
//   } catch(error) {
//     next(error);
//   }
// });

// userSchema.methods.isValidPassword = async function(newPassword) {
//   try {
//     return await bcrypt.compare(newPassword, this.local.password);
//   } catch(error) {
//     throw new Error(error);
//   }
// }

// Create a model
const User = mongoose.model('user', userSchema);

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
