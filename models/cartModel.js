const mongoonse = require('mongoose');

const cartSchema = new mongoonse.Schema({
    userId: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:
    {
        type: Array,
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        vendorId: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            default: 0
        },
        sellBy: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: { type: mongoonse.Schema.Types.ObjectId, ref: 'Category', required: true }
    }
}, { timestamps: true }
);

const cartModel = new mongoonse.model('cart', cartSchema);

module.exports = cartModel;