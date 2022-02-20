import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Error } from '../../Messages/messages';

export const GetNuOfProducts = ({ user }) => {
    const [products, setProducts] = useState([]);

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


    return (
        <>
            <span className='fs-6'>
                ({products.length})
            </span>
        </>
    )
}
