import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { isAuthenticated } from '../../Components/Auth/auth';
import { ProfLayout } from '../../Components/Layouts/ProfileLayout';

export const CompletedOrders = () => {
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
                setOrders(res.data.filter(d => d.status === '5'));
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
                <table className="table border-0">
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
                                                <p className='text-white mt-2'>Status: Completed</p>
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
