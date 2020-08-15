const express = require('express');
const { addItemToCart } = require('../controller/cart');
const { requireSignin, userMiddleware } = require('../common-middleware');
const router = express.Router();


router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart);

module.exports = router;