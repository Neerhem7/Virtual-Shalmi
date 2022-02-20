import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Drawer } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Error, Success } from '../../Messages/messages';

export const ProductsDrawer = ({ user }) => {
    const [visible, setVisible] = useState(false);
    const [products, setProducts] = useState([]);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const getAllProducts = async () => {
        await axios.get(`/api/products/vendor/get/${user._id}`).then(res => {
            if (res.status === 200) {
                setProducts(res.data);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getAllProducts()
        return () => {
        }
    }, []);


    const deleteHandler = async(id) => {
        await axios.delete(`/api/products/delete/${id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.status === 200) {
                Success(res.data.successMessage);
                getAllProducts();
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    return (
        <>
            <EyeOutlined className = 'mt-1' style = {{verticalAlign: 'text-top'}} onClick={() => showDrawer()} />
            <Drawer
                width={901}
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
            >
                <div className='pt-5 mt-5'>
                                <div className='table-responsive'>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                products.length > 0 && products.map((product, index) => {
                                                    return (
                                                        <>
                                                            <tr key={product._id} style={{ borderBottom: '1px solid black' }}>
                                                                <th>{index + 1}</th>
                                                                <th scope="col">{product.title}</th>
                                                                <td className='w-50' style={{ wordBreak: 'break-word' }}><div dangerouslySetInnerHTML={{ __html: product.description }}></div></td>
                                                                <th scope="col">Rs.{product.price}</th>
                                                                <th scope="col">{product.qty <= 1 ? <span className = 'text-danger'>Out of Stock!</span> : product.qty}</th>
                                                                <th scope="col">{product.subCategory && product.subCategory.name}</th>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                </div>
            </Drawer>
        </>
    )
}
