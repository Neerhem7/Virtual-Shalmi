const express = require('express');
const upload = require('../middlewares/multer');
const { isAdmin, AuthenticatorJWT } = require('../middlewares/authenticator');
const { getAllProducts, getProductById, updateProduct, deleteProduct, getRelatedProducts, uploadProduct, getProductByCategory, getAllVendorProducts, getAllNewArrivalProducts } = require('../controllers/productController');

const router  = express.Router();

router.get('/get', getAllProducts); 
router.get('/get/new-arrivals', getAllNewArrivalProducts); 
router.get('/vendor/get/:id', getAllVendorProducts); 
router.get('/get/:id', getProductById);
router.get('/cat/:id', getProductByCategory);
router.post('/create', upload.array('file'), AuthenticatorJWT, isAdmin, uploadProduct);
router.post('/update/:id', upload.any('file'), AuthenticatorJWT, isAdmin, updateProduct);
router.get('/get/related/:id', getRelatedProducts);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteProduct);

module.exports = router;