var express = require('express');
var router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');

/* GET home page. */
router.get('/', function (req, res, next) {
  var totalProducts = null;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      totalProducts = req.user.cart.totalQuantity;
    }
    else {
      totalProducts = 0;
    }

  }

  // Find and display the elements in the DB
  Product.find({}, (error, doc) => {
    if (error) {
      console.log(error);
    }

    // Create a grid of products with 3 columns
    var productGrid = [];
    var colGrid = 3;

    for (var i = 0; i < doc.length; i += colGrid) {
      productGrid.push(doc.slice(i, i + colGrid));
    }

    // Pass the productGrid array and checkUser to the template
    console.log(doc.length)
    res.render('index', { title: 'Express', products: productGrid, checkUser: req.isAuthenticated(), totalProducts: totalProducts });
  });
});

router.get('/addToCart/:id/:price/:name', (req, res, next) => {
  console.log(req.params.id);
  const cartID = req.user._id;
  console.log(cartID);
  const newProduct = {
    _id: req.params.id,
    price: parseInt(req.params.price, 10),
    name: req.params.name,
    quantity: 1
  };

  Cart.findById(cartID, (error, cart) => {
    if (error) {
      console.log(error);
    }

    if (!cart) { // if the cart does not exist, create a new one
      const newCart = new Cart({
        _id: cartID,
        totalQuantity: 1,
        totalPrice: parseInt(req.params.price, 10),
        selectProduct: [newProduct]
      });

      newCart.save((error, doc) => {
        if (error) {
          console.log(error);
        }
        console.log(doc);
      });
    } else {
      // Check if the product already exists in the cart
      const indexOfProduct = cart.selectProduct.findIndex(item => item._id === req.params.id);

      if (indexOfProduct >= 0) {
        // If the product exists, update its quantity and total price
        cart.selectProduct[indexOfProduct].quantity += 1;
        cart.selectProduct[indexOfProduct].price += parseInt(req.params.price, 10);
        cart.totalQuantity += 1;
        cart.totalPrice += parseInt(req.params.price, 10);
      } else {
        // If the product does not exist, add it to the cart
        cart.totalQuantity += 1;
        cart.totalPrice += parseInt(req.params.price, 10);
        cart.selectProduct.push({
          _id: req.params.id,
          quantity: 1,
          price: parseInt(req.params.price, 10),
          name: req.params.name
        });
      }

      // Save the cart after making modifications
      Cart.findByIdAndUpdate(cartID, cart, { new: true }, (error, doc) => {
        if (error) {
          console.log(error);
        }
        console.log(doc);
        res.redirect('/')
      });
    }
  });
});


router.get('/shoppingCart', (req, res, next) => {

  /*this to be sure that the cart is saved in the session which we will use
  console.log(req.user.cart);*/


  //to check if user not logged in go to sign in
  if (!req.isAuthenticated()) {
    res.redirect('users/signIn');

  }
  //to check if user don't have cart  go to cart
  if (!req.user.cart) {
    res.redirect('/')
    return;
  }

  const userCart = req.user.cart;
  res.render('user/shoppingCart', { userCart: userCart, checkUser: true, totalProducts: req.user.cart.totalQuantity })
});


router.get('/increaseProduct/:index', (req, res, next) => {
  const index = req.params.index;// same index of the product was pressed
  const userCart = req.user.cart; //this was saved in the session

  const productPrice = userCart.selectProduct[index].price / userCart.selectProduct[index].quantity;

  userCart.selectProduct[index].quantity = userCart.selectProduct[index].quantity + 1;
  userCart.selectProduct[index].price = userCart.selectProduct[index].price + productPrice;

  userCart.totalQuantity = userCart.totalQuantity + 1;
  userCart.totalPrice = userCart.totalPrice + productPrice;
  //console.log(userCart.selectProduct[index]);
  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, doc) => {
    if (err) {
      console.log(err);
    }
    console.log(doc);
    res.redirect('/shoppingCart');
  });
});


router.get('/decreaseProduct/:index', (req, res, next) => {
  const index = req.params.index;// same index of the product was pressed
  const userCart = req.user.cart; //this was saved in the session

  const productPrice = userCart.selectProduct[index].price / userCart.selectProduct[index].quantity;

  userCart.selectProduct[index].quantity = userCart.selectProduct[index].quantity - 1;
  userCart.selectProduct[index].price = userCart.selectProduct[index].price + productPrice;

  userCart.totalQuantity = userCart.totalQuantity - 1;
  userCart.totalPrice = userCart.totalPrice - productPrice;
  //console.log(userCart.selectProduct[index]);
  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, doc) => {
    if (err) {
      console.log(err);
    }
    console.log(doc);
    res.redirect('/shoppingCart');
  });
});


router.get('/delete/:index', (req, res, next) => {
  const index = req.params.index;
  const userCart = req.user.cart;

  console.log(userCart);

  if (userCart.selectProduct.length <= 1) {
    Cart.deleteOne({ _id: userCart._id }, { $set: userCart }, (err, doc) => {
      if (err) {
        console.log(err);
      }
      console.log(doc);
      res.redirect('/shoppingCart');
    });
  } else {

    userCart.totalPrice = userCart.totalPrice - userCart.selectProduct[index].price;
    userCart.totalQuantity = userCart.totalQuantity - userCart.selectProduct[index].quantity;

    userCart.selectProduct.splice(index, 1);
    Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, doc) => {
      if (err) {
        console.log(err);
      }
      console.log(doc);
      res.redirect('/shoppingCart');
    });
  }

})


router.get('/checkOut' , (req , res , next) =>{
  //check user of course true because no check our if there is no cart
  //and no user check because no shopping cart without sign in 
res.render('user/checkOut' , {checkUser: true, totalProducts: req.user.cart.totalQuantity , totalPrice: req.user.cart.totalPrice})

})

module.exports = router;
