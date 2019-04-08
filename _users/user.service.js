const config = require('../Config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    insert,
    update,
    delete: _delete
};

const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
 
})


 
async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.jwtSecret);
        return {
            ...userWithoutHash,
            token
        };
    }
}
async function insert(user) {
    user = await Joi.validate(user, userSchema, { abortEarly: false });
  
    if (await User.findOne({
        email: user.email
    })) {
    throw 'Email "' + user.email + '"  already exists';
}
    user = await Joi.validate(user, userSchema, { abortEarly: false });
    if (user.password) {
        user.hash = bcrypt.hashSync(user.password, 10);
        delete user.password;
    
    }


    return await new User(user).save();
  }
  


async function create(userParam) {
    // validate
    userParam = await Joi.validate(userParam, userSchema, { abortEarly: false });
  
    if (await User.findOne({
            email: userParam.email
        })) {
        throw 'Email "' + userParam.email + '"  already exists';
    }

    const user = new User({email:userParam.email});

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
        delete userParam.password;
    
    }

    // save user
    await user.save();
}
async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}
async function update(id, userParam) {
    const user = await User.findById(id);
    
    // validate
    if (!user) throw 'User not found';

    if (user.method.local){
        if (user.local.email !== userParam.email && await User.findOne({ "local.email": userParam.email })) {
            throw 'Email "' + userParam.email + '" is already registered';
        }
        user.local.email=userParam.email;
        user.local.fullname= userParam.fullname;
      await user.save();
    }

   if(user.method.facebook){
    if (user.facebook.email !== userParam.email && await User.findOne({ "facebook.email": userParam.email })) {
        throw 'Username "' + userParam.email + '" is already taken';
    }
    user.facebook.email=userParam.email;
    user.facebook.fullname= userParam.fullname;
    await user.save();

   } 
   if(user.method.google){
   
   
   if (user.google.email !== userParam.email && await User.findOne({ 'google.email': userParam.email })) {
        throw 'Username "' + userParam.email + '" is already taken';
    }
    user.google.email=userParam.email;
    user.google.fullname= userParam.fullname;
    await user.save();


}
    // // copy userParam properties to user
    // Object.assign(user, userParam);

    // await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}




// async function registerSocial(userParam) {
//     // validate
    
//     if (await User.findOne({ email: userParam.email })) {
//        throw 'Email "' + userParam.email + '"  already exists';
//     }
   

//     const user = new User({
//         provider: user.provider,
//         email: user.email,
//         profile_picture: user.profile_picture,
//         email_verified: true,
//         social: user.meta,
//     }
        
//         );

   
//     // save user
//    await user.save();
// }


