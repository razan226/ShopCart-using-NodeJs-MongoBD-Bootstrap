
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('../models/user');
const Cart = require('../models/Cart');

/*The serializeUser function determines which data of the user object should be stored in the session. 
Its primary purpose is to store just enough information in the session to uniquely identify the user when the user logs in.
 The user's unique identifier (usually the user ID) is serialized into the session.*/

 
passport.serializeUser((user , done)=>{

    return done(null, user.id);
});
/*The deserializeUser function is used to retrieve the user's information from the database based on the information stored
  in the session. It takes the serialized user ID from the session and finds the corresponding user in the database.*/

passport.deserializeUser((id , done)=>{
    /*if i sent the user like this this will make the admin able to see the password so 
    we have to custmize what should be able to be seen
    User.findById(id , (err,user)=>{ 
        return done (err , user)
    })*/

    //only email
    User.findById(id ,('email'), (err,user)=>{ 
      Cart.findById(id , (err, cart)=>{
        if(!cart){
          return done(err , user);
        }

        user.cart =cart;
        return done (err , user)
      })

        
    })
})

passport.use('local-sign-in', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email: email }); //i saved what the find method return in a const 

    if (!user) {
      console.log('This user was not found.');
      return done(null, false, req.flash('signinError', 'This user was not found.'));// done is a function that returns to the passport authintication take err , user if it exist
    
    // this condition if there is no user found like the one entered in the DB
      
    }

    // Call the comparePassword method on the user instance
    const isPasswordMatch = user.comparePassword(password);

    if (!isPasswordMatch) {
      console.log('Incorrect password.');
      return done(null, false, req.flash('signinError', 'Incorrect password.'));//if the user not found we return a flash msg
    }

    console.log('User authenticated successfully.');
    return done(null, user);// if there is no error the user was saved will be returned
  } catch (err) {
    console.log(err);
    return done(err);
  }
}));


passport.use('local-sign-up', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return done(null, false, req.flash('signUpError', 'This email is already in use.'));
    }

    const newUser = new User({
      email: email,
      password: new User().hashPassword(password),
    });

    newUser.save((err, user) => {
      if (err) {
        return done(err);
      }

      return done(null, user);
    });
  } catch (error) {
    return done(error);
  }
}));



/*const passport=require('passport');
const localStrategy =require('passport-local');
const User =require('../models/user')


passport.use('local-sign-in', new localStrategy({
usernameField :' email' ,
passwordField: 'password',
passReqToCallback : true ,

} , ( req , email , password ,done)=>{
   
    User.findOne({email : email}, (err, user)=>{
        if(err){
            console.log(err)
            return done(err);// done is a function that returns to the passport authintication take err , user if it exist
        }
        // this condition if there is no user found like the one entered in the DB
        if(!user) {
            console.log('this user not found')

            return done(null , false , req.flash('signinError' ,  'this user not found')) ; //if the user not found we return a flash msg
            

        }

        if( ! User.comparePassword(password)){
            console.log('wrong password')
            return done (null , false , req.flash('signinError' , 'wrong password'));
        }

        return done(null,user); // if there is no error the user was saved will be returned
        console.log('done')
    })
    
}))*/
