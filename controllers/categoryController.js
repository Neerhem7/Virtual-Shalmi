const Category = require('../models/categoryModel');

function getAllCategoriesFunction (categories, parentId = null) {
    const categoryList = [];
    let category;
    if(parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for(let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            parentId: cate.parentId,
            children: getAllCategoriesFunction(categories, cate._id)
        })
    }
    return categoryList;
}


exports.getAllCategories = async (req, res) => {
    Category.find({})
    .exec((error, categories) => {
        if(error) {
            res.status(404).json({errorMessage: 'Error in finding categories'});
        }
        if(categories) {
            const categoryList = getAllCategoriesFunction(categories);
            res.status(200).send(categoryList);
        }
    });
}

exports.getAllMainCategories = async (req, res) => {
    Category.find({parentId: null})
        .exec((error, categories) => {
            if (error) {
                res.status(404).json({ errorMessage: 'Error in finding categories' });
            }
            if (categories) {
                res.status(200).send(categories);
            }
        });
}

exports.getAllSubCategories = async (req, res) => {
    Category.find({parentId: {$exists: true}})
        .exec((error, categories) => {
            if (error) {
                res.status(404).json({ errorMessage: 'Error in finding categories' });
            }
            if (categories) {
                res.status(200).send(categories);
            }
        });
}

exports.createMainCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name
    });
    const ifAlreadyExists = await Category.findOne({ name: req.body.name });
    if (ifAlreadyExists) {
        res.status(201).json({ errorMessage: `Category ${req.body.name} already exists` })
    } else {
        const newCategory = category.save();
        if (newCategory) {
            res.status(200).json({ successMessage: `Category ${req.body.name} created successfully` });
        } else {
            res.status(400).json('Category is not created. Please Try Again')
        }
    }
}

exports.createSubCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        parentId: req.body.parentId
    });
    const ifAlreadyExists = await Category.findOne({ name: req.body.name });
    if (ifAlreadyExists) {
        res.status(201).json({ errorMessage: `Category ${req.body.name} already exists` })
    } else {
        const newCategory = category.save();
        if (newCategory) {
            res.status(200).json({ successMessage: `Category ${req.body.name} created successfully` });
        } else {
            res.status(400).json('Category is not created. Please Try Again')
        }
    }
}

exports.getCategoryById = async (req, res) => {
    const editCategory = await Category.findById({ _id: req.params.id });
    if (editCategory) {
        res.status(200).json({ editCategory });
    }
    else {
        res.status(400).json({ errorMessage: 'Category not found. Please try again' });
    }
}

exports.updateCategory = async (req, res) => {
    const editCategory = await Category.findById({ _id: req.params.id });
    if (editCategory) {
        editCategory.name = req.body.name;
        if(req.body.parentId) {
            editCategory.parentId = req.body.parentId;
        }
        const newCategory = editCategory.save();
        if (newCategory) {
            res.status(200).json({successMessage: `Category updated successfully`});
        } else {
            res.status(400).json({errorMessage: 'Category not updated. Please try again'})
        }
    }
    else {
        res.status(400).json({ errorMessage: 'Category not found. Please try again' });
    }
}

exports.deleteCategory = async (req, res) => {
    const deleteCategory = await Category.findById({ _id: req.params.id })
    if (deleteCategory) {
        deleteCategory.remove();
        res.status(200).json({ successMessage: `Category ${deleteCategory.name} has been deleted successfully` });
    } else {
        res.status(400).json({ errorMessage: 'Category could not be deleted. Please try again' });
    }
}
