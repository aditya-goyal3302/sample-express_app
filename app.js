const express = require('express');
const path = require('path')
const MONGODB_URI =
  'mongodb+srv://agdoie-app:0ISZL1RJpYp6FDUM@cluster0.7hawrym.mongodb.net/sample';
const mongoose = require('mongoose');
const app = express();
const port = 2984;
const User = require('./models/users');
const adminroutes = require('./routes/admin');
errorController = require('./controllers/error-controller');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"Public")));

app.use('/admin', adminroutes)

app.get('/',(req,res,next)=>{
    res.render('index');
})

app.use(errorController.get404);

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

