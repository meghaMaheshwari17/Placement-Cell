const validator = require('validator'); //for validating email
const Employee = require('../models/employee');

// displaying SignIn page
module.exports.SignInPage = async function (req, res) {
  return res.render('signIn', { title: 'Sign In' });
};

// displaying SignUp page
module.exports.SignUpPage = async function (req, res) {
  return res.render('signUp', { title: 'Sign Up' });
};

// signing user in :- authentication done by passport
module.exports.SignIn = function (req, res) {
    req.flash('success','Successfully signed in!')
    return res.redirect('/employee/dashboard');
};

// get the sign up data from signup page
module.exports.create =function (req, res) {
  // validations
  if(!validator.isEmail(req.body.email)){
    req.flash('error','Enter valid email')
    return res.redirect('back');
  }else if(req.body.password.length<2){
    req.flash('error','Password must be longer than 2 characters')
    return res.redirect('back');
  }
  // check if employee is already present in the database
  Employee.findOne({ email: req.body.email }, function (err, employee) {
    if (err) {
      console.log('finding user in signing up failed');
      return;
    }

    if (!employee) {
      //if user is not present in the database then create it
      Employee.create(req.body, function (err, employee) {
        if (err) {
          console.log('creating user failed');
          return;
        }
        req.flash('success','Successfully signed up!')
        return res.redirect('/');
      });
    } else {
      //if user is present in the database
      req.flash('error','Email already exists!')
      return res.redirect('back');
    }
  });
};

// logging out the employee
module.exports.destroy = function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
  });
}

