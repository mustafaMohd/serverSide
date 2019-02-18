const config = require('../Config/config.js');
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




  async function  googleOAuth(req, res, next)  {
    // Generate token
    var user =req.user;
    const token = jwt.sign({ sub: user.id }, config.JWT_SECRET);
        return {
            token
        };

  }
 
  async function  facebookOAuth (req, res, next) {
    // Generate token
    var user =req.user;
        
    const token = jwt.sign({ sub: user.id }, config.JWT_SECRET);
    
        
    
    return {
        token
        };
  }

  
 
  async function authenticate(req, res, next) {
    const user = req.user;
        
    const token = jwt.sign({ sub: user.id }, config.JWT_SECRET); 
        const { password, ...userWithoutPassword } = user.local.toObject();
   
        return {
            ...userWithoutPassword,
            token
        };
    }


// async function authenticate({ email, password }) {
//     const user = await User.findOne({ "local.email": email });
    
//     if (user && bcrypt.compareSync(password, user.local.password)) {
//         const { password, ...userWithoutPassword } = user.local.toObject();
        
//         const token = jwt.sign({ sub: user.id }, config.JWT_SECRET);
//         return {
//             ...userWithoutPassword,
//             token
//         };
//     }
// }


async function create(userParam) {
    // validate
    
    if (await User.findOne({
        "local.email": userParam.email
        })) {
        throw 'Email "' + userParam.email + '"  already exists';
    }

    const user = new User({
        method: 'local',
      local: {
        email: userParam.email, 
       }
    
    });


    // hash password
    if (userParam.password) {
        user.local.password = bcrypt.hashSync(userParam.password, 10);
        delete userParam.password;
    
    }

    // save user
    await user.save();
   const { password, ...userWithoutPassword } = user.local.toObject();
        
        const token = jwt.sign({ sub: user.id }, config.JWT_SECRET);
        return {
            ...userWithoutPassword,
            token
        };
}






async function getById(id) {
    return await User.findById(id).select('-hash');
}
async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
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
