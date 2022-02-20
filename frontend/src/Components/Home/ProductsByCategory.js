import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Error } from '../Messages/messages';
import { ProductCard } from '../Products/ProductCard';

export const ProductsByCategory = ({ category }) => {
    const [products, setProducts] = useState([]);

    const getProductsByCategory = async (id) => {
        await axios.get(`/api/products/cat/${category._id}`).then(res => {
            if (res.status === 200) {
                setProducts(res.data);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getProductsByCategory();
        return () => {
        }
    }, []);

    return (
        <div className='row'>
            {
                products.length > 0 && products.slice(0, 4).map(product => {
                    return (
                        <div className='col-md-3'>
                            <ProductCard product={product} />
                        </div>
                    )
                })
            }
        </div>
    )
}
