const express = require('express');
const { addItemToCart, addToCart, getCartItems } = require('../controller/cart');
const { requireSignin, userMiddleware } = require('../common-middleware');
const router = express.Router();


router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart);
//router.post('/user/cart/addToCartByLogin', requireSignin, userMiddleware, addToCart);
router.post('/user/getCartItems', requireSignin, userMiddleware, getCartItems);

module.exports = router;