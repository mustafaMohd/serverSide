const config = require('../Config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const User = db.User;


module.exports = {
    authenticate,
    getById,
    create,
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


async function getById(id) {
    return await User.findById(id).select('-hash');
}
async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Username "' + userParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
