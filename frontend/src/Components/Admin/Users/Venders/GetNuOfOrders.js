import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';

export const GetNuOfOrders = ({ vendor }) => {
    const [orders, setOrders] = useState([]);

    const getAllOrders = async () => {
            await axios.get(`/api/users/vendor/all-orders/${vendor._id}`, {
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
        <div>
            <p className='fs-6'>
                ({orders.length})
            </p>
        </div>
    )
}
