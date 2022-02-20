const express = require('express');
const { getProduct, addToCart, updateQuantity, removeProduct, getProducts, updateSize, addToCartFromLS, emptyCart } = require('../controllers/cartControllers');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const upload = require('../middlewares/multer');

const router = express.Router(); 

router.get('/get', AuthenticatorJWT, getProducts); 
router.get('/get-product', getProduct);
router.post('/add-to-cart', AuthenticatorJWT, upload.any(''), addToCart);
router.post('/ls-add-to-cart', AuthenticatorJWT, upload.any(''), addToCartFromLS);
router.put('/update/qty/:id', AuthenticatorJWT, updateQuantity);
router.put('/update/size/:id', AuthenticatorJWT, updateSize);
router.delete('/delete/:id', AuthenticatorJWT, removeProduct);
router.delete('/empty', AuthenticatorJWT, emptyCart);

  
module.exports = router;