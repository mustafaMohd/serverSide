const config = require('../Config/config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const User = db.User;


module.exports = {
    authenticate,
    fbOAuth,
    googleOAuth,
    getById,
    create,
    update,
    changePassword,
    delete: _delete
};

async function create(userParam) {
    // validate
    console.log(userParam)

    if (await User.findOne({
        "email": userParam.email
    })) {
        throw 'Email "' + userParam.email + '"  already exists';
    }

    const newUser = new User({
        method: 'local',
        fullname: userParam.fullname,
        email: userParam.email

    });


    // hash password
    if (userParam.password) {
        newUser.local.password = bcrypt.hashSync(userParam.password, 10);
        delete userParam.password;

    }

    // save user
    let user = await newUser.save();

    // console.log(`${user}  new registered user`);


    // const {
    //     local: {   password },
    //     ...userWithoutPassword
    // } = user;
    user = user.toObject();

    delete user.local.password;
    delete user.roles;


    const token = await generateToken(user);

    // const token = jwt.sign({
    //     sub: user.id
    // }, config.JWT_SECRET,{ expiresIn: 60 * 60 * 24 * 7 });
    return {
        user,
        token
    };
}


async function authenticate(user) {

    // const token = jwt.sign({
    //     sub: user.id
    // }, config.JWT_SECRET,{ expiresIn: 60 * 60 * 24 * 7 });
    const token = await generateToken(user);


    user = user.toObject();
    delete user.local.password;
    delete user.roles;

    return {
        user,
        token
    };
}




async function fbOAuth(user) {
    // console.log(`facebook users from service layer ${user}`)
    const token = await generateToken(user);

    // const token = jwt.sign({
    //     sub: user.id
    // }, config.JWT_SECRET,{ expiresIn: 60 * 60 * 24 * 7 });



    user = user.toObject();

    return {
        user,
        token
    };
}


async function googleOAuth(user) {

    console.log(`google user from service layer ${user}`)
    const token = await generateToken(user);

    // const token = jwt.sign({
    //     sub: user.id
    // }, config.JWT_SECRET,{ expiresIn: 60 * 60 * 24 * 7 });



    user = user.toObject();
    return {
        user,
        token
    };
}



async function update(id, userParam) {
    // const id=req.user._id;
    console.log(` from service ${id}`);


    let edituser = await User.findById({_id:id});

    // validate
    if (!edituser) throw 'User not found';

    if (edituser.email !== userParam.email && await User.findOne({ "email": userParam.email })) {
        throw 'Email "' + userParam.email + '" is already registered';
    }
    edituser.email = userParam.email;
    edituser.fullname = userParam.fullname;
    edituser.updatedAt = Date.now();
    let user = await edituser.save();
    user = user.toObject();
    if (user.method === 'local') {

        delete user.local.password;
        delete user.roles;

    }
    const token = await generateToken(user);
    // delete updatedUser.local.password;

    return {
        user,
        token
    }

}








async function changePassword(id, userParam) {
    // const id=req.user._id;
    console.log(` from service ${id}`);

    console.log(` from service userParam  ${userParam.password}, ${userParam.newPassword}`);

    let edituser = await User.findById(id);

    // validate
    if (!edituser) throw 'User not found';
    const passwordMatch = bcrypt.compareSync(userParam.password, edituser.local.password);
    if (!passwordMatch) {
        throw 'Enter a Valid Password ';
    }
    edituser.local.password = bcrypt.hashSync(userParam.newPassword, 10);
    delete userParam;


    edituser.updatedAt = Date.now();
    let user = await edituser.save();
    user = user.toObject();
    // if (user.method==='local'){

    delete user.local.password;
    delete user.roles;

    // }
    const token = await generateToken(user);
    // // delete updatedUser.local.password;

    return {
        user, token
    }

}




async function generateToken(user) {
    return jwt.sign({
        sub: user._id
    }, config.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 })

}





async function getById(id) {

    return await User.findById(id);
}





async function _delete(id) {
    return await User.findByIdAndRemove(id);
}




