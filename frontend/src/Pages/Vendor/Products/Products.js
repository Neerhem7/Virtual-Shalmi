import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { VendorLayout } from '../../../Components/Layouts/VendorLayout';
import { Error, Success } from '../../../Components/Messages/messages';
import { SharedProducts } from '../../../Components/Shared/Products';

const { TabPane } = Tabs;
export const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const getAllProducts = async () => {
        await axios.get(`/api/products/vendor/get/${isAuthenticated()._id}`).then(res => {
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
        <VendorLayout sidebar>
            <div className='d-flex justify-content-end mb-2'>
                <Link to='/vender/create-products' className='btn px-4' style={{ background: '#364c64', color: 'white', borderRadius: '23px' }}>Create Product</Link>
            </div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="All" key="1">
                    <SharedProducts update={getAllProducts} products={products} />
                </TabPane>
                <TabPane tab="Out Of Stock" key="2">
                    <SharedProducts update={getAllProducts} products={products} outOfStock = {1} />
                </TabPane>
                <TabPane tab="On Sale" key="3">
                    <SharedProducts update={getAllProducts} products={products} onSale = {1} />
                </TabPane>
            </Tabs>
        </VendorLayout>
    )
}
