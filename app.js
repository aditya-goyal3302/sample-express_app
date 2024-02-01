const express = require('express');
const path = require('path')
const MONGODB_URI =
  'mongodb+srv://agdoie-app:0ISZL1RJpYp6FDUM@cluster0.7hawrym.mongodb.net/sample';
const mongoose = require('mongoose');
const app = express();
const port = 2984;
const User = require('./models/users');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"Public")));

app.get('/adduser', (req, res, next) => {
    res.render('add-user',{
        pageTitle:'Add User',
        path:'/adduser',
    });
})

app.post('/adduser', (req, res, next) => {
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
            res.redirect('/adduser');
        })
        .catch(err => {
            console.log(err);
        });
})


app.get('/users',(req,res,next)=>{
    currentPage = +req.query.page || 1;
    perPage = 2;
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
            totalItems:totalItems,
            currentPage:currentPage,
            hasNextPage:perPage*currentPage < totalItems,
            hasPreviousPage:currentPage>1,
            nextPage:currentPage+1,
            previousPage:currentPage-1,
            lastPage:Math.ceil(totalItems/perPage),
        })
    })
    .catch(err=>{
        console.log(err);
    })
})


app.get('/',(req,res,next)=>{
    res.render('index');
})

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.log(err);
    });

