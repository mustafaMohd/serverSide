const httpError = require('http-errors');

const requireUser = function (req, res, next) {
console.log(req.user);
  const currentUser = req.user;
   const id = parseInt(req.params.id);
  
  if (id === currentUser.sub ) 
    return next();
  const err = new httpError(401);
  return next(err);
}



module.exports = requireUser;

