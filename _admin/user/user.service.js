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
async function getAll(currentPage,pageSize , search) {
    //if (pageSize && currentPage) {
        let userlist;

     if(search){
        
        const users= User.find({ fullname : { '$regex' : search, '$options' : 'i' } }).skip(pageSize * (currentPage - 1)).limit(pageSize)
        
        .then(x=>{
        userlist=x;
           return  User.find({ fullname : { '$regex' : search, '$options' : 'i' } }).countDocuments();    
        
        }).then( count=>{
            return {userlist,count}
        }
        
        )
return await users;
     }
    
    
const users= User.find().skip(pageSize * (currentPage - 1)).limit(pageSize)
        
.then(x=>{
userlist=x;
   return  User.find().countDocuments();    

}).then( count=>{
    return {userlist,count}
}

);

console.log((await users).userlist );

return await users;








//    if (search!=="" )
      
        //const usersQuery = await User.find({ fullname: search });
       // const usersQuery = await User.find({ fullname: new RegExp(search, 'i')}).skip(pageSize * (currentPage - 1)).limit(pageSize);
        //find( { 'fullname' : { '$regex' : "Muhammad ", '$options' : 'i' } } )
    
    //     return await User.paginate({ fullname : { '$regex' : search, '$options' : 'i' } }, 
    //         { page: currentPage, limit: pageSize });

    //     // const usersQuery = await User.find({ fullname : { '$regex' : search, '$options' : 'i' } })
    //     // .skip(pageSize * (currentPage - 1)).limit(pageSize);
        
        
    //     // const usersQueryResult=usersQuery.then(result =>result);
       
           
    // //     usersQuery =User.paginate( {},{ page: currentPage, limit: pageSize }).exec();;


    // }
    

  //  return User.paginate( { },{ page: currentPage, limit: pageSize }).then(x=>{console.log(x.docs)}   );

    // const usersQuery =User.find({ fullname : { '$regex' : search, '$options' : 'i' } })
    // .skip(pageSize * (currentPage - 1)).limit(pageSize);
    
    
 //const usersQueryResult= usersQuery.then(result =>  result);
    
           
    // return usersQuery;



//     const usersQuery = await User.find().skip(pageSize * (currentPage - 1)).limit(pageSize);
//          usersQuery
//          .then(fetchedUsers => {
//             if (!fetchedUsers) throw 'error in fetching users';
//             users =  fetchedUsers;  
//         })
// const totalAmount= User.countDocuments();

//      return {users,totalAmount}
    

     
    }










async function getById(id) {
    return await User.findById(id);
}






async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';

    if (user.method.local) {
        if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
            throw 'Email "' + userParam.email + '" is already registered';
        }
        user.email = userParam.email;
        user.fullname = userParam.fullname;
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




