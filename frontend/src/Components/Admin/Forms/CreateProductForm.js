import { DatePicker, Radio, Spin, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import { Error, Success, Warning } from "../../Messages/messages";
import { antIcon } from "../../Loading/Loading";
import { Link } from 'react-router-dom';

const { TreeNode } = TreeSelect;

export const CreateProductForm = () => {
    const [file, setFile] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [mainCat, setMainCat] = useState('');
    const [subCat, setSubCat] = useState('');
    const [loading, setLoading] = useState(false);
    const [sellBy, setSellBy] = useState('quantity');
    const [saleStartDate, setSaleStartDate] = useState('');
    const [saleEndDate, setSaleEndDate] = useState('');
    const [productData, setProductData] = useState({
        title: '',
        price: '',
        qty: '',
        salePrice: ''
    });

    const { title, price, qty, salePrice } = productData;

    /***********************************************onChange *******************************************/
    const handleProductChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        });
    }

    const handleImageChange = (e) => {
        setFile([
            ...file,
            e.target.files[0]

        ])
    }

    const handleRemoveUploadedImage = name => {
        setFile(file => file.filter(item => item.name !== name.name))
    }

    const onMainCatChange = value => {
        setMainCat(value);
    };
    const onSubCatChange = value => {
        setSubCat(value);
    };


    /************************************************ Submit **********************************************/

    const submitHandler = (e) => {
        e.preventDefault();
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (
            !title ||
            !subCat ||
            !mainCat ||
            !price ||
            !description ||
            !file
        ) {
            Warning('All fields are required');
        }
        else if (parseInt(salePrice) > parseInt(price)) {
            Warning("Sale Price can't be greater than original price");
        }
        else if (format.test(salePrice)) {
            Warning("Only numbers are allowed in sale price input!");
        }
        else {
            setLoading(true);
            let data = new FormData();
            data.append('title', title);
            data.append('description', description);
            data.append('price', price);
            data.append('qty', qty);
            data.append('sellBy', sellBy);
            data.append('salePrice', salePrice);
            data.append('saleStartDate', saleStartDate);
            data.append('saleEndDate', saleEndDate);
            data.append('mainCategory', mainCat);
            data.append('subCategory', subCat);
            for (let pic of file) {
                data.append('file', pic);
            }
            axios.post('/api/products/create', data, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.status === 200) {
                    setLoading(false);
                    Success(res.data.successMessage);
                }
                else {
                    Error(res.data.errorMessage);
                }
            })
        }
    }

    /****************************************** Get Categories *******************************************/
    const fetchCategories = () => {
        axios.get('/api/categories/get').then(res => {
            if (res.status === 200) {
                setCategories(res.data);
            }
            else {
                Error(res.data.errorMessage);
            }
        })
    }


    useEffect(() => {
        fetchCategories();
        return () => {
        }
    }, []);

    return (
        <div className='w-75 p-4 products mb-4' style={{ marginTop: '10px', paddingTop: '47px', background: '#FFFFFF', boxShadow: '10px 10px 30px rgba(197, 200, 213, 0.76)', borderRadius: '20px' }}>
            {
                loading
                    ?
                    <div className='text-center'>
                        <Spin indicator={antIcon} />
                    </div>

                    :
                    <div>
                        <form onSubmit={submitHandler}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h4 className='mb-5'>Create a Product</h4>
                                </div>
                                <div>
                                    <Link to='/vendor/get-products' type="button" className="btn-close" aria-label="Close"></Link>
                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <input type="text" className="form-control mb-2" id='title' name='title' placeholder="Enter Your Product Title" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <input type="Number" className="form-control mb-2" id='price' name='price' placeholder="Enter Product's Price in Rs." onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <h4>Sell By:</h4>
                                <div class="form-check form-check-inline">
                                    <input checked={sellBy === 'quantity'} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="quantity" onChange={() => setSellBy('quantity')} />
                                    <label className="form-check-label" for="inlineRadio1">Quantity</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input checked={sellBy === 'weight'} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="weight" onChange={() => setSellBy('weight')} />
                                    <label defaultChecked={sellBy === 'weight'} className="form-check-label" for="inlineRadio2">Weight</label>
                                </div>
                                <input type="Number" className="form-control mb-y" id='qty' name='qty' placeholder="Enter Amount" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <input type="Number" className="form-control mb-2" id='salePrice' name='salePrice' placeholder="Enter Sale Price" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <DatePicker showTime onChange={(value, t) => setSaleStartDate(value, t)} format={'DD/MM/YYYY HH:mm'} className='w-100' placeholder='Sale Start Date(Optional)' />
                            </div>
                            <div className="form-group mt-4">
                                <DatePicker showTime onChange={(value, t) => setSaleEndDate(value, t)} format={'DD/MM/YYYY HH:mm'} className='w-100' placeholder='Sale End Date(Optional)' />
                            </div>
                            <div className='mt-3'>
                                <ReactQuill placeholder="Product Description" theme="snow" value={description} onChange={setDescription} />
                            </div>
                            <div className='my-3'>
                                <input type="file" name='file' multiple onChange={handleImageChange} />
                                <ul className='list-unstyled'>
                                    {
                                        file.length > 0 ?
                                            file.map(pic => {
                                                return (
                                                    pic &&
                                                    <li key={pic.name}>
                                                        {pic.name}
                                                        <a onClick={() => handleRemoveUploadedImage(pic)}><DeleteOutlined style={{ marginLeft: '10px', color: 'black' }} /> </a>
                                                    </li>

                                                )
                                            })
                                            :
                                            null
                                    }
                                </ul>
                            </div>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select main category"
                                allowClear
                                treeDefaultExpandAll
                                onChange={onMainCatChange}
                                className='mb-3'
                            >
                                {
                                    categories.map(mainCat => {
                                        return (
                                            <TreeNode value={mainCat._id} title={mainCat.name} />
                                        )
                                    })
                                }
                            </TreeSelect>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select sub category"
                                allowClear
                                treeDefaultExpandAll
                                onChange={onSubCatChange}
                            >
                                {
                                    categories.map(mainCat => {
                                        return (
                                            <TreeNode value={mainCat._id} title={mainCat.name}>
                                                {
                                                    mainCat.children.map(subCat => {
                                                        return (
                                                            <TreeNode value={subCat._id} title={subCat.name}>
                                                                {
                                                                    subCat.children.map(childCat => {
                                                                        return (
                                                                            <TreeNode value={childCat._id} title={childCat.name} />

                                                                        )
                                                                    })
                                                                }
                                                            </TreeNode>
                                                        )
                                                    })
                                                }
                                            </TreeNode>
                                        )
                                    })
                                }
                            </TreeSelect>
                            <button type="submit" size='large' className="btn btn-dark w-100 mt-4">Submit</button>
                        </form>
                    </div>
            }
        </div>
    )
}
