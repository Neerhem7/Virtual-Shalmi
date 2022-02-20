import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Layout } from '../../../Components/Layouts/Layout';
import { Error } from '../../../Components/Messages/messages';
import './product.css'

export const Products = () => {
    const [products, setProducts] = useState([]);
    const getAllProducts = async () => {
        await axios.get('/api/products/get').then(res => {
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

    return (
        <Layout sidebar>
            <div className='admin-products table-container table-responsive'>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Picture</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Weight</th>
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
                                            <th scope="col"><img src = {product.productPictures && product.productPictures[0].img} className='rounded' width= '62' height= '62' alt='product' /></th>
                                            <th scope="col">{product.title}</th>
                                            <td className='w-50' style={{ wordBreak: 'break-word' }}><div className='para' dangerouslySetInnerHTML={{ __html: product.description }}></div></td>
                                            <th scope="col">Rs. {product.price}</th>
                                            <th scope="col">{product.qty <= 1 ? <span className='text-danger'>Out of Stock!</span> : product.sellBy === 'quantity' && product.qty}</th>
                                            <th scope="col">{product.qty <= 1 ? <span className='text-danger'>Out of Stock!</span> : product.sellBy === 'weight' && product.qty + 'kg'}</th>
                                            <th scope="col">{product.subCategory && product.subCategory.name}</th>
                                        </tr>
                                    </>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}
