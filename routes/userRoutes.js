const express = require('express');
const upload = require('../middlewares/multer');
const { isAdmin, AuthenticatorJWT } = require('../middlewares/authenticator');
const { getAllUsers, getUserById, deleteUser, getAllOrdersByUserId, deleteOrder, getAllOrders, VendorSignUp, RetailorSignUp, vendorLogin, RetailorLogin, adminLogin, sendConfirmationEmail, confirmEmail, saveAddress, placeOrderCOD, placeOrderPaypal, getAllVendorOrders, setOrderStatus, getAllOrderById, updateVendor, updateUser, changePassword, getAllRetailers, getAllVenders, giveStar, enableUser, resetPasswordLink, updatePassword, getAllCustomerOrdersById, getAllCompletedOrders, getAllVendorCompletedOrders, PostSaleTimer, getLastWeekOrders, getLastMonthOrders } = require('../controllers/userController');

const router = express.Router();

router.get('/get', AuthenticatorJWT, getAllUsers);
router.get('/get/venders', AuthenticatorJWT, getAllVenders);
router.get('/get/retailers', AuthenticatorJWT, getAllRetailers);
router.get('/get/:id', getUserById);
router.post('/vendor/signup', upload.single('file'), VendorSignUp);
router.post('/retailor/signup', upload.single('file'), RetailorSignUp);
router.post('/vendor/login', vendorLogin);
router.post('/retailor/login', RetailorLogin);
router.post('/admin/login', adminLogin);
router.put('/upadate', AuthenticatorJWT, upload.single('file'), updateVendor);
router.put('/user/upadate', AuthenticatorJWT, upload.single('file'), updateUser);
router.post('/change/password', AuthenticatorJWT, changePassword);
router.post('/give/star/:id', AuthenticatorJWT, isAdmin, giveStar);
router.delete('/enable/:id', AuthenticatorJWT, isAdmin, enableUser);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteUser);

router.post('/send/confirm-mail', upload.any(''), sendConfirmationEmail);
router.post('/confirm/email', confirmEmail);

router.post('/send/forgot-email', resetPasswordLink);
router.post('/update/password', updatePassword);


router.post('/address/post', AuthenticatorJWT, saveAddress);
router.get('/orders/last-week', AuthenticatorJWT, getLastWeekOrders);
router.get('/orders/last-month', AuthenticatorJWT, getLastMonthOrders);
router.post('/place-order-cod', AuthenticatorJWT, placeOrderCOD);
router.post('/place-order-paypal', AuthenticatorJWT, placeOrderPaypal);
router.get('/orders/:id', AuthenticatorJWT, getAllOrdersByUserId);
router.get('/get/order/:id', AuthenticatorJWT, getAllOrderById);
router.post('/set/status', AuthenticatorJWT, isAdmin, setOrderStatus);
router.get('/all-orders', AuthenticatorJWT, getAllOrders);
router.get('/completed-orders', AuthenticatorJWT, getAllCompletedOrders);
router.get('/completed-orders/vendor/:id', AuthenticatorJWT, getAllVendorCompletedOrders);
router.get('/vendor/all-orders/:id', AuthenticatorJWT, getAllVendorOrders);
router.post('/customer/orders/:id', AuthenticatorJWT, getAllCustomerOrdersById);
router.delete('/order/delete/:id', AuthenticatorJWT, deleteOrder);


router.post('/sale-timer', AuthenticatorJWT, isAdmin, PostSaleTimer);


module.exports = router;