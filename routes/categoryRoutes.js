const express = require('express');
const { AuthenticatorJWT, isAdmin } = require('../middlewares/authenticator');
const { getAllCategories, getAllSubCategories, getAllMainCategories, createMainCategory, createSubCategory, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const upload = require('../middlewares/multer');

const router = express.Router(); 

router.get('/get', getAllCategories);
router.get('/get/sub-categories', getAllSubCategories);
router.get('/main/get', getAllMainCategories);
router.post('/main/create', AuthenticatorJWT, isAdmin, upload.any(''), createMainCategory);
router.post('/sub/create', AuthenticatorJWT, isAdmin, upload.any(''), createSubCategory);
router.post('/edit/:id', getCategoryById);
router.put('/update/:id', AuthenticatorJWT, isAdmin, upload.any(''), updateCategory);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteCategory);

 
module.exports = router;