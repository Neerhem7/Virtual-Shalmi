import { CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { isAuthenticated } from '../../Components/Auth/auth';
import { ProfLayout } from '../../Components/Layouts/ProfileLayout';

export const Orders = () => {
    const user = isAuthenticated();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const getAllOrders = async () => {
        setLoading(true);
        await axios.get(`/api/users/orders/${user._id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setOrders(res.data.filter(d => d.status !== '5'));
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
    }, []);


    return (
        <ProfLayout sidebar>
            <div className='orders pt-2'>
            <h4>Total Amount Spent: Rs. {Math.round(orders && orders.length > 0 && orders.reduce((a, b) => b.status !== '0' && b.product && a + b.product.price * b.product.qty, 0)).toFixed(0)}</h4>

                {/* <h4>{orders && orders.length > 0 && orders.reduce((a, b) => b.product && a + b.product.price * b.product.qty, 0)}</h4> */}
                <table class="table border-0">
                    {
                        orders && orders.length > 0 ? orders.map((order, index) => {
                            return (
                                <>
                                    <tbody className='mb-5'>
                                        <tr className='bg-secondary text-white'>
                                            <th>
                                                Order #{index + 1}
                                            </th>
                                            <th>
                                                Order Id : {order._id}
                                            </th>
                                            <th>
                                                Total Price : {order.product && order.product.price * order.product.qty}
                                            </th>
                                            <th>
                                                {
                                                    order.status === '0' ?
                                                       <div>Status: <CloseCircleFilled className='fs-5 mx-2 text-danger bg-white rounded-circle' style={{ marginTop: '-10px' }} /> </div> 
                                                        :
                                                        <Link className='text-white' to={'/my/orders/track/' + order._id}>Track Order</Link>
                                                }
                                            </th>
                                        </tr>
                                        <div className='text-center mb-4' style={{ width: '100%', position: 'relative' }}>
                                            <th style={{ position: 'absolute', left: '100%', top: '0px', width: '400px' }}>
                                                <span>Placed At: {order.placed}</span>
                                            </th>
                                        </div>
                                        <tr>
                                            <th>
                                                <img src={order.product && order.product.image} height='71' width='64' alt='image' />
                                            </th>
                                            <th>
                                                {order.product && order.product.name}

                                            </th>
                                            <th>Qty:{order.product && order.product.qty}</th>
                                            <th>Rs.{order.product && order.product.price * order.product.qty}</th>
                                        </tr>
                                    </tbody>
                                </>

                            )
                        })

                            :

                            <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '40vh' }}>
                                <p className='fs-4'>No Orders!</p>
                            </div>
                    }

                </table>
            </div>
        </ProfLayout>
    )
}
