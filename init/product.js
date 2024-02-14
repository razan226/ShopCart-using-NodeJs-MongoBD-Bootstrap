const Product = require('../models/Product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping-cart', { useNewUrlParser: true }, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Connecting to DB .....')
  }
});

const Products = [
  new Product({
    imagePath: '/images/download.jpg',
    productName: 'Hawawi Y9',
    information: {
      storageCapacity: 64,
      numberOfSIM: 'Dual SIM',
      cameraResolution: 16,
      displaySize: 6.5,
    },
    price: 220,
  }),
  new Product({
    imagePath: '/images/Galaxy Note.jpg',
    productName: 'Galaxy Note ',
    information: {
      storageCapacity: 64,
      numberOfSIM: 'Dual SIM',
      cameraResolution: 16,
      displaySize: 6.5,
    },
    price: 420,
  }),
  new Product({
    imagePath: '/images/iphone-8-gold.jpg',
    productName: 'iphone-8 ',
    information: {
      storageCapacity: 256,
      numberOfSIM: 'Dual SIM',
      cameraResolution: 64,
      displaySize: 6.5,
    },
    price: 520,
  }),
  new Product({
    imagePath: '/images/Samsung-Galaxy-Note-8-e1607090078794.jpeg',
    productName: 'Samsung-Galaxy-Note-8 ',
    information: {
      storageCapacity: 256,
      numberOfSIM: 'Dual SIM',
      cameraResolution: 64,
      displaySize: 6.5,
    },
    price: 520,
  }),
];

var done = 0;

for (var i = 0; i < Products.length; i++) {
  Products[i].save((error, doc) => {
    if (error) {
      console.log(error);
    }
    console.log(doc);
    done++;
    if (done === Products.length) {
      mongoose.disconnect();
    }
  });
}
