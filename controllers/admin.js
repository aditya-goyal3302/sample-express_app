const User = require('../models/users');
const mongoose = require('mongoose');

exports.getAddUser = (req, res, next) => {
    res.render('add-user',{
        pageTitle:'Add User',
        path:'/adduser',
        editing:false

    });
}
exports.postAddUser = (req, res, next) => {
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
        city: req.body.city
    });
    user
        .save()
        .then(result => {
            console.log('Created User');
            res.redirect('/admin/users');
        })
        .catch(err => {
            console.log(err);
        });
}
exports.getUsers = (req, res, next) => {
    currentPage = +req.query.page || 1;
    perPage = +req.query.limit || 2;
    let totalItems;
    User.find()
    .countDocuments()
    .then(t=>{
        totalItems = t;
        return User.find()
        .skip((currentPage-1)*perPage)
        .limit(perPage)
    })
    
    .then(users=>{
        res.render('users',{
            users:users,
            pageTitle:'Users',
            path:'/users',
            currentPage:currentPage,
            hasNextPage:perPage*currentPage < totalItems,
            hasPreviousPage:currentPage>1,
            nextPage:currentPage+1,
            previousPage:currentPage-1,
            limit:perPage,
        })
        console.log(perPage);
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.getEditUser = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const userId = req.params.userId;
    User.findById(req.params.userId)
    .then(user=>{
        if(!user){
            return res.redirect('/');
        }
        res.render('add-user',{
            pageTitle:'Edit User',
            path:'/edituser',
            editing:true,
            user:user
        });
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.postEditUser = (req, res, next) => {
    console.log(req.body.id);
    User.findById(req.body.id)
    .then(user=>{
        user.email = req.body.email;
        user.name = req.body.name;
        user.age = req.body.age;
        user.city = req.body.city;
        return user.save();
    })
    .then(result=>{
        console.log('Updated User');
        res.redirect('/admin/users');
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.postDeleteUser = (req, res, next) => {
    User.deleteOne({_id:req.body.id})
    .then(()=>{
        console.log('Deleted User');
        res.redirect('/admin/users');
    })
    .catch(err=>{
        console.log(err);
    })
}
