const config = require('../../Config/config.js');
const bcrypt = require('bcryptjs');
const db = require('../../helpers/db');
const User = db.User;

module.exports = {
    getAll,
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


async function create(userParam) {
    // validate
    userParam = await Joi.validate(userParam, userSchema, { abortEarly: false });

    if (await User.findOne({
        email: userParam.email
    })) {
        throw 'Email "' + userParam.email + '"  already exists';
    }

    const user = new User({ email: userParam.email });

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
        delete userParam.password;

    }

    // save user
    return await user.save();
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

    if (user.method.local) {
        if (user.local.email !== userParam.email && await User.findOne({ "local.email": userParam.email })) {
            throw 'Email "' + userParam.email + '" is already registered';
        }
        user.local.email = userParam.email;
        user.local.fullname = userParam.fullname;
        return await user.save();
    }

    if (user.method.facebook) {
        if (user.facebook.email !== userParam.email && await User.findOne({ "facebook.email": userParam.email })) {
            throw 'Username "' + userParam.email + '" is already taken';
        }
        user.facebook.email = userParam.email;
        user.facebook.fullname = userParam.fullname;
        return await user.save();

    }
    if (user.method.google) {


        if (user.google.email !== userParam.email && await User.findOne({ 'google.email': userParam.email })) {
            throw 'Username "' + userParam.email + '" is already taken';
        }
        user.google.email = userParam.email;
        user.google.fullname = userParam.fullname;
        return await user.save();


    }

}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}




