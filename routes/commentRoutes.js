const express = require('express');
const { getCommentsById, postComment, deleteComment, getVenderReviewsById, getUserReviewsById } = require('../controllers/commentController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');

const router = express.Router();

router.get('/get/:id', getCommentsById);
router.get('/get/vender/:id', getVenderReviewsById);
router.get('/get/user/:id', getUserReviewsById);
router.post('/post', AuthenticatorJWT, postComment);
router.post('/delete', AuthenticatorJWT, deleteComment);


module.exports = router;