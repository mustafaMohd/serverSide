const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const isAdmin = require('../../middleware/isAdmin');
router.get('/',isAdmin, getAll);
router.post('/', add)
router.get('/:id', getById);

router.put('/changePassword/:id', changePassword)
router.put('/:id',  update);
router.delete('/:id', _delete);


module.exports = router;

async function getAll(req, res, next) {
    const pageSize =    parseInt(req.query.pageSize) || 10; 
    const currentPage =    parseInt(req.query.page)|| 1;

    //const pageSize = +req.query.pageSize || 10;
//const currentPage = +req.query.page || 1 ;
const search= req.query.filter;
console.log(search)

    await userService.getAll(currentPage,pageSize,search)
    .then(user => user ? res.json(user) : res.status(404).json({
        message: 'Error in fetching users!'
    }))    
        .catch(err => next(err));
} 

async function getById(req, res, next) {

    await userService.getById(req.params.id)
    .then(user => user ? res.json(user) : res.status(404).json({
        message: 'User not found !'
    }))
        .catch(err => next(err));
}
async function add(req, res, next) {
    console.log(req.body)
   
   
    await userService.create(req.body)
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


async function update(req, res, next) {
    
    await userService.update(req.params.id, req.body)
    .then(user => user ? res.json(user) : res.status(404).json({
        message: 'User not Updated !'
    }))
        .catch(err => next(err));
    }

async function changePassword(req, res, next) {
   await userService.changePassword(req.params.id, req.body)
        .then(user => user ? res.json(user) : res.status(404).json({
                message: 'email not found !'
            }))
        .catch(err => next(err));
}
async  function _delete(req, res, next) {
    await userService.delete(req.params.id)
        .then((user) => res.json({}))
        .catch(err => next(err));
}