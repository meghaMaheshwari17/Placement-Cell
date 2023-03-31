//setting up passport js 
const passport=require('passport');
//strategy property from passport-local
const LocalStrategy = require('passport-local').Strategy;

const Employee=require('../models/employee');

//need to tell passport to use this localStrategy property for authentication
passport.use(new LocalStrategy(
   {
    usernameField:'email',
    passReqToCallback:true //allows us to have the first argument as req for flash messages 
   },
   function(req,email,password,done){//callback function
      //find employee and establish the identity
      Employee.findOne({email:email},function(err,employee){/*right email is the value which is passed on*/
          if(err){
              req.flash('error',err);
              return done(err); //will report an error to passport
            }

            if(!employee || employee.password!=password){ //if user is not found or password passed on doesn't match
            req.flash('error','Invalid Email/Password');
             return done(null,false);//first argument is error but there is none here, but the authentication is not done so second argument is false
            }

            return done(null,employee); //if user is authenticated
      })
   }
))

//serialize user function:- need to put user id into the cookie and not the whole info because that is only thing you need to encrypt
//serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(employee,done){
    done(null,employee.email);
})

//deserialize user function:- when the cookie is sent back to the server and we are establishing the identity of which user is there from the database we are using that id to find the user 
//deserializing the user from the key in the cookies
passport.deserializeUser(function(email,done){
    Employee.findOne({email:email},function(err,employee){
        if(err){
            console.log('error in finding user -->Passport');
             return done(err);
        }
        return done(null,employee);
    })
});

//  check if the user is authenticated
  //we made the function checkAuthentication to be used as middleware
passport.checkAuthentication=function(req,res,next){
   if(req.isAuthenticated()){//checks whether the user is authenticated or not
        return next(); //then passing onto next function 
   }
   //if the user is not authenticated
   return res.redirect('/');
}

//set the user for the views 
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user info from the session cookie and we are just sending this to the locals for the views 
        res.locals.user=req.user;
    } 
    next();
}



module.exports =passport;