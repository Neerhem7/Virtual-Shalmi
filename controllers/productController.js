const Product = require('../models/productModel');
const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinary');
var fs = require('fs');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate('mainCategory subCategory').exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}
exports.getAllNewArrivalProducts = async (req, res) => {
  const products = await Product.find().limit(4).sort({ "createdAt": '-1' })
    .populate('mainCategory subCategory').exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getAllVendorProducts = async (req, res) => {
  const products = await Product.find({ user: req.params.id })
    .populate('mainCategory subCategory').exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getProductById = async (req, res) => {
  const findProduct = await Product.findOne({ _id: req.params.id }).populate('user').exec();
  if (findProduct) {
    res.status(200).send(findProduct);
  }
}

exports.getProductByCategory = async (req, res) => {
  const findProduct = await Product.find({ $or: [{ mainCategory: req.params.id }, { subCategory: req.params.id }] })
    .populate('mainCategory subCategory').exec();
  if (findProduct) {
    res.status(200).json(findProduct);
  } else {
    res.json({ errorMessage: 'No products found' })
  }
}

exports.uploadProduct = async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'VirtualShalmi/Product')
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path)
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  if (urls && urls.length > 0) {
    productPictures = urls.map(pic => {
      return {
        img: pic.url,
        cloudinary_id: pic.id
      }
    })
  }
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    user: req.user._id,
    price: req.body.price,
    qty: req.body.qty,
    sellBy: req.body.sellBy,
    salePrice: req.body.salePrice,
    saleStartDate: req.body.saleStartDate,
    saleEndDate: req.body.saleEndDate,
    mainCategory: req.body.mainCategory,
    subCategory: req.body.subCategory,
    productPictures
  });

  await product.save(((error, result) => {
    if (error) {
      res.status(400).json({ errorMessage: 'Failed to create product. Please try again', error })
    }
    if (result) {
      res.status(200).send({ successMessage: 'Porduct created successfully', result });
    }

  }))
}



exports.updateProduct = async (req, res) => {
  console.log(req.body.saleEndDate)
  const findProduct = await Product.findById({ _id: req.params.id });
  if (findProduct) {
    if (req.files && req.files.length > 0) {
      const uploader = async (path) => await cloudinary.uploads(path, 'ALVARO/Products')
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath);
        fs.unlinkSync(path);
      }

      let productPictures;
      if (urls && urls.length > 0) {
        productPictures = urls.map(pic => {
          return {
            img: pic.url,
            cloudinary_id: pic.id
          }
        })
      }
      findProduct.title = req.body.title;
      findProduct.description = req.body.description;
      findProduct.price = req.body.price;
      findProduct.user = req.user._id,
        findProduct.qty = req.body.qty;
      findProduct.sellBy = req.body.sellBy;
      findProduct.salePrice = req.body.salePrice;
      findProduct.saleStartDate = req.body.saleStartDate;
      findProduct.saleEndDate = req.body.saleEndDate;
      findProduct.mainCategory = req.body.mainCategory;
      findProduct.productPictures = productPictures;
      findProduct.subCategory = req.body.subCategory;
      findProduct.productPictures = productPictures

      await findProduct.save(((error, result) => {
        if (error) {
          res.status(400).json({ errorMessage: 'Failed to update product. Please try again', error })
        }
        if (result) {
          res.status(200).send({ successMessage: 'Porduct updated successfully', result });
        }

      }))
    } else {
        findProduct.title = req.body.title,
        findProduct.description = req.body.description,
        findProduct.price = req.body.price,
        findProduct.user = req.user._id,
        findProduct.qty = req.body.qty,
        findProduct.sellBy = req.body.sellBy;
        findProduct.salePrice = req.body.salePrice;
        findProduct.saleStartDate = req.body.saleStartDate;
        findProduct.saleEndDate = req.body.saleEndDate;
        findProduct.offer = req.body.offer,
        findProduct.productPictures = findProduct.productPictures;
        findProduct.mainCategory = req.body.mainCategory,
        findProduct.subCategory = req.body.subCategory,
        await findProduct.save(((error, result) => {
          if (error) {
            res.status(400).json({ errorMessage: 'Failed to update product. Please try again', error })
          }
          if (result) {
            res.status(200).send({ successMessage: 'Porduct updated successfully', result });
          }

        }))
    }

  }
  else {
    res.status(404).json({ errorMessage: 'Product not found' });
  }

}


exports.deleteProduct = async (req, res) => {
  let product = await Product.findById({ _id: req.params.id });
  if (product) {
    product.productPictures.map(async pic => {
      const imgUrl = pic.cloudinary_id;
      await cloudinaryCon.uploader.destroy(imgUrl);
    });
    product.remove();
    res.status(200).json({ successMessage: 'Product Deleted Successfully' });


  }
}

exports.getRelatedProducts = async (req, res) => {
  const products = await Product.find({ $or: [{ mainCategory: req.params.id }, { subCategory: req.params.id }] }).exec();
  res.status(200).send(products);
}


