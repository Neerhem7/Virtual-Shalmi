import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import { Layout } from '../../../Components/Layouts/Layout';
import axios from 'axios';
import swal from 'sweetalert';
import { Order } from '../../../Components/Shared/Order';

const { TabPane } = Tabs;


export const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);

    const getAllOrders = async () => {
        await axios.get(`/api/users/all-orders`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setOrders(res.data);
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
    }, []);

    return (
        <Layout sidebar>
            <div className='orders admin-orders pt-5'>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Active" key="1">
                        <Order orders={orders} />
                    </TabPane>
                    <TabPane tab="Completed" key="2">
                        <Order orders={orders} status={'5'} />
                    </TabPane>
                    <TabPane tab="Cancelled" key="3">
                        <Order orders={orders} status={'0'} />
                    </TabPane>
                </Tabs>
            </div>
        </Layout>
    )
}
