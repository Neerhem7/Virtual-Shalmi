const Cart = require('../models/cartModel');

exports.getProducts = async (req, res) => {
    const getCart = await Cart.findOne({}).where('userId').in(req.user._id).exec();
    if (getCart) {
        res.status(200).json(getCart);
    } else { 
        res.status(201).json({ errorMessage: 'No cart found.' });
    }
}

exports.getProduct = async (req, res) => {
    const userId = req.query.userId 
    const productId = req.query.productId
    const getCart = await Cart.findOne({}).where('userId').in(userId).exec();
    if (getCart) {
        const findProduct = await getCart.products.filter(c => c.productId === productId);
        if (findProduct) {
            res.status(200).send(findProduct);
        }
    } else {
        res.status(404).json({ errorMessage: 'No products found.' });
    }
}

exports.addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;
    const result = await Cart.findOne({ userId: userId });
    if (result) {
        const item = result.products.find(c => c.productId === productId);
        if (item) {
            Cart.findOneAndUpdate({ "userId": userId, "products.productId": req.body.productId }, {
                "$set": {
                    "products.$": {
                        ...req.body,
                        qty: req.body.qty
                    }
                }
            }).exec((error, newResult) => {
                if (error) return res.status(400).json({ error })
                if (newResult) {
                    return res.status(200).json({ newResult, successMessage: 'Added to Cart!' });
                }

            });

        } else {
            Cart.findOneAndUpdate({ userId: userId }, {
                "$push": {
                    "products": req.body
                }
            }).exec((error, cart) => {
                if (error) return res.status(400).json({ error });
                if (cart) {
                    return res.status(200).json({ cart, successMessage: 'Added to Cart!' });
                }
            })
        }

    }
    else {
        Cart.create({
            userId: userId,
            products: [{
                productId,
                title: req.body.title,
                price: req.body.price,
                vendorId: req.body.vendorId,
                category: req.body.category,
                image: req.body.image,
                qty: req.body.qty,
                sellBy: req.body.sellBy,
            }]
        });
        res.status(200).json({ successMessage: 'Product added to Cart successfully.' });

    }
}


exports.addToCartFromLS = async (req, res) => {
    console.log(req.body);
    const userId = req.user._id;
    // const { busName, busLogo, from, to, time, date, tickets, price, status } = req.body;
    const result = await Cart.findOne({ userId: userId });
    if (result) {
        Cart.findOneAndUpdate({ userId: userId }, {
            "$push": {
                "products": req.body
            }
        }).exec((error, data) => {
            if (error) {
                res.status(400).json({ errorMessage: 'Failed' });
            }
            else {
                res.status(200).json({ successMessage: 'Added to bag successfully!' });
            }
        })
    }
    else {
        Cart.create({
            userId: userId,
            products: req.body
        });
        res.status(200).json({ successMessage: 'Added to bag successfully!' });

    }
}
exports.removeProduct = async (req, res) => {
    const productId = req.params.id;
    const getCart = await Cart.find().where('userId').in(req.user._id).exec();
    if (getCart) {
        Cart.updateOne(
            { userId: req.user._id },
            { $pull: { products: { productId: productId } } }
        ).then(result => {
            res.status(200).json({ successMessage: 'Product removed from cart.', result });
        })

    } else {
        res.status(404).json({ errorMessage: 'No products in bag' });
    }
}

exports.emptyCart = async (req, res) => {
    const getCart = await Cart.findOneAndRemove().where('userId').in(req.user._id).exec();
    if (getCart) {
        await getCart.remove();
        res.status(200).json({ successMessage: 'Successfully Purchased Items' });
    } else {
        res.status(404).json({ errorMessage: 'No products in bag' });
    }
}


exports.updateQuantity = async (req, res) => {
    const qty = req.body.qty;
    const userId = req.user._id;
    const productId = req.params.id;
    Cart.findOneAndUpdate({ "userId": userId, "products.productId": productId }, {
        "$set": {
            "products.$.qty":
                qty
        }
    })
        .exec((error, newResult) => {
            if (error) return res.status(400).json({ error })
            if (newResult) {
                return res.status(200).json({ newResult, successMessage: 'Qty updated!' });
            }
        });
}

exports.updateSize = async (req, res) => {
    const size = req.body.size;
    const userId = req.user._id;
    const productId = req.params.id;
    Cart.findOneAndUpdate({ "userId": userId, "products.productId": productId }, {
        "$set": {
            "products.$.sizeToShop":
                size
        }
    })
        .exec((error, newResult) => {
            if (error) return res.status(400).json({ error })
            if (newResult) {
                return res.status(200).json({ newResult, successMessage: 'Qty updated!' });
            }
        });
}