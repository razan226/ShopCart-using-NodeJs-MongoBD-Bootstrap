var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const user = require('../models/user');
const User = require('../models/user');
const { log } = require('handlebars');
const flash = require('connect-flash')
const passport = require('passport');

const csurf =require('csurf');
//csurf is a popular Node.js middleware designed to help prevent CSRF attacks by implementing and verifying CSRF tokens. 
//It integrates with Express.js, a popular web application framework for Node.js
//when we define it in the users we have to use it to the whole router
//we send the tokens in the get req and have to receive it in the post req
router.use(csurf());



/* GET users listing. */
router.get('/signUp', isNotSignin,function (req, res, next) {
  var messagesError = req.flash('signUpError')
  res.render('user/signUp', { massage: messagesError ,tokens : req.csrfToken()});
});

router.post('/signUp', [
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter a valid email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({ min: 5 }).withMessage('please enter a valid password'),
  check('Confirm-password').custom((value, { req }) => {

    if (value !== req.body.password) {
      throw new Error('Password and Confirm-password not matched')

    }
    return true;
  })



], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    var validationMassages = [];
    for (var i = 0; i < errors.errors.length; i++) {
      validationMassages.push(errors.errors[i].msg);
    }

    //console.log(validationMassages);  // Fixed typo in console.log
    req.flash('signUpError', validationMassages);
    res.redirect('signUp')
    return;
  }

  next();

}, passport.authenticate('local-sign-up', {
  session: false,
  successRedirect: '/users/signIn',
  failureRedirect: '/users/signUp',
  failureFlash: true,
}));

router.get('/profile',isSignin, (req, res, next) => {
  
  console.log(req.session);// print the cookie and the passport
  console.log(req.user) //print the obj of the user the email

  if(req.user.cart){
    totalProducts = req.user.cart.totalQuantity;
  }
  else 
  totalProducts =0;

  res.render('user/profile', {checkUser: true , checkProfile : true, totalProducts: totalProducts }) // checkUser: used to show the profile and logout in sign in case
  //checkProfile  used to prevent show the profile rout in profile page 
});

router.get('/signIn',isNotSignin, (req, res, next) => {
  var messagesError = req.flash('signinError');
  res.render('user/signIn', { massages: messagesError , tokens : req.csrfToken() })
}


);


router.post('/signIn', [
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter a valid email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({ min: 5 }).withMessage('please enter a valid password'),]
  , (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      var validationMassages = [];
      for (var i = 0; i < errors.errors.length; i++) {
        validationMassages.push(errors.errors[i].msg);
      }

      //console.log(validationMassages);  // Fixed typo in console.log
      req.flash('signinError', validationMassages);
      res.redirect('signIn')
      return;
    }

    next();

  },
  //next()
  passport.authenticate('local-sign-in', {
    //session: false,
    successRedirect: '/users/profile',
    failureRedirect: '/users/signIn',
    failureFlash: true,
  }), (req, res) => {
    console.log(flash);
  });


  router.get('/logout',isSignin, (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/'); //if the user is  signed in then require logout will fo to /
    });
  });
  

//to make sure when make logout the user not sign in
  function isSignin( req , res , next){
       //this return true if the user sign in 
    if(! req.isAuthenticated()){
      res.redirect('signIn') //if the user id not signed in then require logout will fo to sign in
      return
    }
next();
  }

//used to prevent user go to sign in and up page when it already make a sign in
  function isNotSignin( req , res , next){
    //this return true if the user sign in 
 if( req.isAuthenticated()){
   res.redirect('/')
   return
 }
next();
}





module.exports = router;
