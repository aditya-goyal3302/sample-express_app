const express = require('express');
const MONGODB_URI =
  'mongodb+srv://agdoie-app:0ISZL1RJpYp6FDUM@cluster0.7hawrym.mongodb.net/sample';
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const User = require('./models/users');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));

app.get('/adduser', (req, res, next) => {
    res.render('add-user');
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
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
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

