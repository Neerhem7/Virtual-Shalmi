const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: '0'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userPicture: {
        type: Object,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    expireToken: {
        type: String
    },
    shopName: {
        type: String
    },
    shopAddress: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    postalCode: {
        type: String
    },
    verification: {
        type: Boolean,
        default: false
    },
    orders: {
        type: Array
    },
    customers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    earnings: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
    },
    star: {
        type: String
    },
    saleStartDate: {
        type: String
    },
    saleEndDate: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    }

}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
