import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { VendorLayout } from '../../../Components/Layouts/VendorLayout';
import { Tabs } from 'antd';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { Order } from '../../../Components/Shared/Order';

const { TabPane } = Tabs;

export const VendorOrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const getAllOrders = async () => {
        setLoading(true);
        await axios.get(`/api/users/vendor/all-orders/${isAuthenticated()._id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setOrders(res.data);
                setLoading(false);
            }
            else {
                swal('Sorry', 'No orders', 'error');
            }
        })
    }


    useEffect(() => {
        getAllOrders();
        return () => {

        }
    }, [success]);


 
    const update = () => {
        getAllOrders();
    }

    return (
        <VendorLayout sidebar>
            <div className='orders admin-orders pt-5'>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Active" key="1">
                        <Order update = {update} vendor = {1} orders={orders} />
                    </TabPane>
                    <TabPane tab="Completed" key="2">
                        <Order vendor = {1} orders={orders} status={'5'} />
                    </TabPane>
                    <TabPane tab="Cancelled" key="3">
                        <Order vendor = {1} orders={orders} status={'0'} />
                    </TabPane>
                </Tabs>
            </div>
        </VendorLayout>
    )
}
