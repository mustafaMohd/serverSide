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
    delete: _delete
};

async function create(userParam) {
    // validate
    console.log(userParam)

    if (await User.findOne({
            "local.email": userParam.email
        })) {
        throw 'Email "' + userParam.email + '"  already exists';
    }

    const newUser = new User({
        method: 'local',
        fullname: userParam.fullname,
            
    
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
    console.log(`facebook user from service layer ${user}`)
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






async function generateToken(user){
    return jwt.sign({
        sub: user.id
    }, config.JWT_SECRET,{ expiresIn: 60 * 60 * 24 * 7 })

}





async function getById(id) {

    return await User.findById(id);;
}


async function update(id, userParam) {
   
    const user = await User.findById(id);
    
    // validate
    if (!user) throw 'User not found';
    user.fullname= userParam.fullname;
    if (user.method.local){
        if (user.local.email !== userParam.email && await User.findOne({ "local.email": userParam.email })) {
            throw 'Email "' + userParam.email + '" is already registered';
        }
        user.local.email=userParam.email;
        
    let updatedUser= await user.save();
    }
    user.fullname= userParam.fullname;
   if(user.method.facebook){
    if (user.facebook.email !== userParam.email && await User.findOne({ "facebook.email": userParam.email })) {
        throw 'Username "' + userParam.email + '" is already taken';
    }
    user.facebook.email=userParam.email;
    user.fullname= userParam.fullname;
    let updatedUser= await user.save();

   } 
   if(user.method.google){
   
    user.fullname= userParam.fullname;
   if (user.google.email !== userParam.email && await User.findOne({ 'google.email': userParam.email })) {
        throw 'Username "' + userParam.email + '" is already taken';
    }
    user.google.email=userParam.email;
    
    let updatedUser= await user.save();


}
const token = await generateToken(user);
return { updatedUser ,token}
}

async function _delete(id) {
    return  await User.findByIdAndRemove(id);
}


// async function update(id, userParam) {
//     const user = await User.findById(id);

//     // validate
//     if (!user) throw 'User not found';
//     if (user.email !== userParam.email && await User.findOne({
//             email: userParam.email
//         })) {
//         throw 'Email "' + userParam.email + '" is already taken';
//     }

//     // hash password if it was entered
//     if (userParam.password) {
//         userParam.hash = bcrypt.hashSync(userParam.password, 10);
//     }

//     // copy userParam properties to user
//     Object.assign(user, userParam);

//     await user.save();
// }



// async function googleOAuth(req, res, next) {
//     // Generate token
//     var user = req.user;
//     const token = jwt.sign({
//         sub: user.id
//     }, config.JWT_SECRET);
//     return {
//         token
//     };

// }
// async function facebookOAuth(req, res, next) {
//     // Generate token
//     var user = req.user;

//     const token = jwt.sign({
//         sub: user.id
//     }, config.JWT_SECRET);



//     return {
//         token
//     };
// }
