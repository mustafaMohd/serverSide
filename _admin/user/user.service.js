const config = require('../../Config/config.js');
const bcrypt = require('bcryptjs');
const db = require('../../helpers/db');
const User = db.User;

module.exports = {
    getAll,
    getById,
    create,
    update,
    changePassword,
    delete: _delete
};

const Joi = require('joi');

const userSchema = Joi.object({
    fullname: Joi.string().required(),

    email: Joi.string().email().required(),
    password: Joi.string().required(),

})
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
        //newUser.roles.push(Role.User);

    }

    // save user
    let user = await newUser.save();


    user = user.toObject();

    delete user.local.password;
    //delete user.roles;




    // const token = jwt.sign({
    //     sub: user.id
    // }, config.JWT_SECRET,{ expiresIn: 60 * 60 * 24 * 7 });
    return {
        user
    };
}

// async function create(userParam) {
//     // validate
//     userParam = await Joi.validate(userParam, userSchema, { abortEarly: false });

//     if (await User.findOne({
//         email: userParam.email
//     })) {
//         throw 'Email "' + userParam.email + '"  already exists';
//     }

//     //const user = new User({ email: userParam.email });
//     const newUser = new User({
//         method: 'local',
//         fullname: userParam.fullname,
//         email: userParam.email

//     });

//     // hash password
//     if (userParam.password) {
//         user.hash = bcrypt.hashSync(userParam.password, 10);
//         delete userParam.password;

//     }

//     let user = await newUser.save();
//     user = user.toObject();
//     if (user.method === 'local') {

//         delete user.local.password;
//         // delete user.roles;

//     }

//     // save user
//     return user;
// }
async function getAll(currentPage, pageSize, search) {
    //if (pageSize && currentPage) {
    let userlist;

    if (search) {

        const users = User.find({ fullname: { '$regex': search, '$options': 'i' } }).skip(pageSize * (currentPage - 1)).limit(pageSize)

            .then(x => {
                userlist = x;
                return User.find({ fullname: { '$regex': search, '$options': 'i' } }).countDocuments();

            }).then(count => {
                return { userlist, count }
            }

            )
        return await users;
    }


    const users = User.find().skip(pageSize * (currentPage - 1)).limit(pageSize)

        .then(x => {
            userlist = x;
            return User.find().countDocuments();

        }).then(count => {
            return { userlist, count }
        }

        );

    return await users;

}

async function getById(id) {
    return await User.findById(id);
}

async function update(id, userParam) {
    let user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';

    if (user.method === 'local') {
        if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
            throw 'Email "' + userParam.email + '" is already registered';
        }
        user.email = userParam.email;
        user.fullname = userParam.fullname;

       let UpdatedUser = await user.save();
        UpdatedUser = UpdatedUser.toObject();
 

        delete UpdatedUser.local.password;
        // delete user.roles;


        return UpdatedUser;
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


async function changePassword(id, userParam) {
    // const id=req.user._id;
    console.log(` from service ${id}`);

    console.log(` from service userParam ${userParam.newPassword}`);

    let edituser = await User.findById(id);

    // validate
    if (!edituser) throw 'User not found'
    edituser.local.password = bcrypt.hashSync(userParam.newPassword, 10);
    delete userParam;


    edituser.updatedAt = Date.now();
    
    let UpdatedUser = await edituser.save();
    UpdatedUser = UpdatedUser.toObject();


    delete UpdatedUser.local.password;
    delete UpdatedUser.roles;
    // delete user.roles;


    return UpdatedUser;
    

}


async function _delete(id) {
    await User.findByIdAndRemove(id);
}




