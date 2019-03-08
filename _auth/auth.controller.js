const express = require('express');

// const asyncHandler = require('express-async-handler')
const passport=require('passport');
const router = express.Router();
const passportConf = require('../helpers/passport');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
// const fbAuth= passport.authenticate('facebookToken', { session: false });
const fbAuth= passport.authenticate('facebook-token', { session: false });
const googleAuth= passport.authenticate('google-token', { session: false });

const authService = require('./auth.service');
const jwt = require('../helpers/jwt');
// routes

router.post('/register', register );

router.post('/authenticate',passportSignIn, authenticate);
router.post('/oauth/facebook',fbAuth, fbOAuth);
router.post('/oauth/google',googleAuth, googleOAuth);





router.get('/current', passportJWT, getCurrent);



module.exports = router;






async function register(req, res, next) {
    console.log(req.body)
   await authService.create(req.body)
        .then(user => user ?
            res.status(201).json(user) 
             : res.status(400).json({
                message: ` Registeration Failed`
            }))
        .catch(err => {
            console.log(err)
            next(err)
        });
}


async function authenticate(req, res, next) {

    
    await authService.authenticate(req.user)
        .then(userData => userData ?
            res.json(userData) : res.status(400).json({
                message: 'Username or password is incorrect'
            }))
        .catch(err => next(err));
}




async function fbOAuth(req, res, next) {
    console.log(`fb user from controller layer ${req.user}`)

    await authService.fbOAuth(req.user)
        .then(userData => userData ?
            res.json(userData) : res.status(400).json({
                message: 'Something is went wrong !'
            }))
        .catch(err => next(err));
}

async function googleOAuth(req, res, next) {

    console.log(` google user from controller layer => ${req.user}`)
    await authService.googleOAuth(req.user)
        .then(userData => userData ?
            res.json(userData) : res.status(400).json({
                message: 'Something is went wrong !'
            }))
        .catch(err => next(err));
}





async function getCurrent(req, res, next) {
 await authService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


// function update(req, res, next) {
//     userService.update(req.params.id, req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function _delete(req, res, next) {
//     userService.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }