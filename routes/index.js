// firing up the express
const express = require('express');
const router=express.Router();
const passport = require('passport');

// importing home_controller
const employeeController=require('../controllers/employee_controller');

// using employee controller
router.get('/',employeeController.SignInPage);

// sign up page 
router.get('/signup', employeeController.SignUpPage);

// signing in
router.post('/signin',passport.authenticate('local', { failureRedirect: '/' }),employeeController.SignIn);

// getting info from signup page  
router.post('/create',employeeController.create);

// to logout user
router.get('/logout',passport.checkAuthentication,employeeController.destroy);

// routing to all /employee routes
router.use('/employee',passport.checkAuthentication,require('./student'));

// routing to all /student routes
router.use('/student',passport.checkAuthentication,require('./interview'));


// for listing all the jobs
router.use('/jobs' ,passport.checkAuthentication, require('./jobs'));
// exporting routes
module.exports = router;