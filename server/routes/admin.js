const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/adduser', adminController.getAddUser);

router.post('/adduser', adminController.postAddUser);

router.get('/users', adminController.getUsers);
// router.post('/users', adminController.postUsers);

router.get('/edituser/:userId', adminController.getEditUser);

router.post('/edituser', adminController.postEditUser);

router.post('/deleteuser', adminController.postDeleteUser);

router.get('/search', adminController.getSearch);




module.exports = router;   