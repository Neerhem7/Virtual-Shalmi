const mongoonse = require('mongoose');

const productShema = new mongoonse.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    user: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'User',
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
    salePrice: {
        type: String
    },
    saleStartDate: {
        type: String
    },
    saleEndDate: {
        type: String
    },
    productPictures: {
        type: Array
    },
    mainCategory: { type: mongoonse.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoonse.Schema.Types.ObjectId, ref: 'Category', required: false }
}, { timestamps: true });

const productModel = new mongoonse.model('Product', productShema);
module.exports = productModel;