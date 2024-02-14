const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const expressSession = require('express-session')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoose = require('mongoose');
/*connect-flash is a middleware for Express.js, a web application framework for Node.js. This middleware provides a way to store and retrieve flash messages in your application. Flash messages are short-lived messages that are typically used to store and display informational or error messages to the user during a redirect.

Here's how connect-flash works in the context of an Express application:

Flash Message Storage: When you set a flash message, it is stored in the session. This is useful when you want to pass a message from one route to another (e.g., after a form submission).

Redirect: After storing a flash message, you often redirect the user to another route. The flash message will be available in the session for the next request.

Flash Message Retrieval: On the redirected route, you can retrieve the flash message from the session and display it to the user. Once the message is retrieved, it is removed from the session, making it a one-time message.*/

//const expressValidator =require('express-validator');
const flash = require('connect-flash')
const passport=require('passport');


const app = express();

mongoose.connect('mongodb://localhost/shopping-cart', { useNewUrlParser: true }, (error) => {
  if (error) {
    console.log(error);
  }
  console.log('Connecting to DB .....')
});

require('./config/passport'); // this because this error Error: Unknown authentication strategy "local-sign-in" to make the appp apple to see the local stratigy

// view engine setup


app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  //this helpers used to define any function want to used in hbs file
  helpers : {
    add : 
    function(value){
      return value +1;
    },
    checkQuantity : function(value) {
      if(value <= 1){
        return true ;
      }else{
        return false;
      }
    }
  
  
  }
    
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(expressValidator());
app.use(cookieParser());


app.use(expressSession({
  //secret is a secret key used to sign the session ID cookie.
//saveUninitialized controls whether to save uninitialized sessions to the store.
//resave controls whether to save the session back to the store, even if it wasn't modified during the request.
  secret :'Shopping-cart_@!',
  saveUninitialized : false,
  resave:true,// to save the session that the user saved
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.hbs', { error: err });
});

module.exports = app;
