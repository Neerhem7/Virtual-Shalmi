const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: Object,
        default: {}
    },
    userId: {
        type: String,
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    data: {
        type: Object,
        default: {}
    },
    product: {
        type: Object,
    },
    status: {
        type: String,
        default: "1"
    },
    placed: {
        type: String,
        default: ''
    },
    statusUpdateTime: {
        type: String,
        default: "---"
    },
    adminSale: {
        type: Boolean,
        default: false
    }
  
}, {timestamps: true}
);

const orderModel = new mongoose.model('Order', orderSchema);
module.exports = orderModel;
