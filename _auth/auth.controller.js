const express = require('express');
const asyncHandler = require('express-async-handler')
const router = express.Router();
const passport = require('passport');


const authService = require('./auth.service');
const jwt = require('../helpers/jwt');
// routes

router.post('/register', register);

router.post('/authenticate', authenticate);

router.get('/current', jwt(), getCurrent);



module.exports = router;



async function authenticate(req, res, next) {


    await authService.authenticate(req.body)
        .then(user => user ?
            res.json(user) : res.status(400).json({
                message: 'Username or password is incorrect'
            }))
        .catch(err => next(err));
}

async function register(req, res, next) {
    console.log(req.body)
    await authService.create(req.body)
        .then(user => user ?
            res.status(201).json({}) : res.status(400).json({
                message: ` Registeration Failed`
            }))
        .catch(err => {
            console.log(err)
            next(err)
        });
}


async function getCurrent(req, res, next) {
    authService.getById(req.user.sub)
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