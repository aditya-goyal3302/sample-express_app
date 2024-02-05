const mongoose = require("mongoose");
const User = require('../models/users');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: './.env' });

exports.getSignup = (req, res, next) => {
    res.render('add-user',{
        pageTitle:'Signup',
        path:'/Signup',
        editing:false,
        edit:false,
        error: ''
    });
}

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const name = req.body.name;
    const age = req.body.age;
    const city = req.body.city;
    if (password !== password2) {
        return res.status(400).render('add-user',{ error: 'Passwords do not match',
            pageTitle:'Signup', 
            path:'/Signup',
            editing:false,
            edit:true,
            user: {
                email: email,
                name: name,
                age: age,
                city: city
            }
        })
        
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).render('add-user',{ error: 'user already exists! login instead.',
            pageTitle:'Signup', 
            path:'/Signup',
            editing:false,
            edit:true,
            user: {
                email: email,
                name: name,
                age: age,
                city: city
            }
        })
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        age: age,
        city: city
    });
    await user.save();
    res.status(201).redirect('/admin/users');
}

exports.getLogin = (req, res, next) => {
    res.render('login',{
        pageTitle:'Login',
        path:'/Login',
        error: '',
        editing:false,
    });
}
exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email + " " + password);
    const user = await User.findOne({ email:email });
    if (!user) {
        return res.status(400).render('login',{ 
            error: 'Invalid email or password',
            pageTitle:'Login', 
            path:'/admin/Login',
            editing:true,
            email: email,
        })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).render('login',{ 
            error: 'Invalid password',
            pageTitle:'Login', 
            path:'/admin/Login',
            editing:true,
            email: email
        })
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect('/');
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}