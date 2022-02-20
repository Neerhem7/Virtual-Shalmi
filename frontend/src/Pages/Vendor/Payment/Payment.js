import { CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { VendorLayout } from '../../../Components/Layouts/VendorLayout';

export const VendorPayment = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState({});

    const getAllOrders = async () => {
        await axios.get(`/api/users/completed-orders/vendor/${isAuthenticated()._id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setOrders(res.data);
                console.log(res.data);
            }
            else {
                swal('Sorry', 'No orders', 'error');
            }
        })
    }

    const getVendor = async () => {
        await axios.get(`/api/users/get/${isAuthenticated()._id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setUser(res.data);
            }
            else {
                swal('Sorry', 'No orders', 'error');
            }
        })
    }

    useEffect(() => {
        getAllOrders();
        getVendor();
        return () => {

        }
    }, []);


    return (
        <VendorLayout sidebar>
            <h4 className='mt-4'>Total Amount Earned: Rs. {user && user.earnings}</h4>
            {
                orders.length > 0 && orders.some(o => o.status === '5') ? orders.map((order, index) => {
                    return (
                        order.status === '5' &&
                        <div className='table-container'>
                            <table className="table table-borderless">
                                <tbody>
                                    <tr className='text-black'>
                                        <th>
                                            Order Id : {order._id}
                                        </th>
                                        <th>
                                            Total Price : Rs.{order.product.price * order.product.qty}
                                        </th>
                                        <th className='text-success'>
                                            Earned: Rs.
                                            {
                                                order.adminSale ?
                                                    <>{order.product.price * order.product.qty}</>
                                                    :
                                                    <>{order.product.price * order.product.qty * 0.95}</>
                                            }
                                        </th>
                                        <th>
                                            <span>Status : &nbsp;
                                                <CheckCircleOutlined className='fs-5 text-success bg-white rounded-circle' style={{ marginTop: '-10px' }} />
                                            </span>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                })
                    :
                    <div className='d-flex mt-5 justify-content-center align-items-center'>
                        <p className='text-dark fs-4'>No Completed Orders!</p>
                    </div>

            }
        </VendorLayout>
    )
}
