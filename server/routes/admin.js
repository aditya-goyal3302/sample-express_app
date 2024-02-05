const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const passport = require('../controllers/passport');

router.get('/adduser', adminController.getAddUser);

// router.post('/adduser', adminController.postAddUser);

router.get('/users', adminController.getUsers);
// router.post('/users', adminController.postUsers);

router.get('/edituser/:userId', adminController.getEditUser);

router.post('/edituser', adminController.postEditUser);

router.post('/deleteuser', adminController.postDeleteUser);

router.get('/search', adminController.getSearch);

router.get('/signup', passport.getSignup);

router.post('/signup', passport.postSignup);

router.get('/login', passport.getLogin);

router.post('/login', passport.postLogin);

router.get('/logout', passport.postLogout);


module.exports = router;   