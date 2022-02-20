import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CheckSquareFilled, DeleteOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { UserDrawer } from '../../../Components/Admin/Users/Drawer';
import { Layout } from '../../../Components/Layouts/Layout';
import { GetRetailersNuOfOrders } from '../../../Components/Admin/Users/Retailers/RetailerNuOfOrders';
import { RetailersOrdersDrawer } from '../../../Components/Admin/Users/Retailers/RetailersOrdersDrawer';



export const GetAllRetailers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getUsers();
        return () => {

        }
    }, [success]);

    const getUsers = async () => {
        setLoading(true);
        await axios.get('/api/users/get/retailers', {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setUsers(res.data);
            } else {
                setUsers('');
            }
        })
    }

    const deleteHandler = async (userId) => {
        setLoading(true);
        await axios.delete(`/api/users/delete/${userId}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setSuccess(true);
                swal('Success', res.data.successMessage, 'success');
                setSuccess(false);
            } else {
                swal('Error', 'Error in deleting User', 'error');
            }
        })
    }

    const enableHandler = async (userId) => {
        setLoading(true);
        await axios.delete(`/api/users/enable/${userId}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setSuccess(true);
                swal('Success', res.data.successMessage, 'success');
                setSuccess(false);
            } else {
                swal('Error', 'Error in deleting User', 'error');
            }
        })
    }


    return (
        <Layout sidebar>
            <div className='table-container'>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Picture</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Username</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Orders</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => {
                                return (
                                    <tr>
                                        <th className='pt-4' scope="row">{index + 1}</th>
                                        <td><img width='60' height='64' src={user.userPicture.url} alt={user.firsName} /></td>
                                        <td className='pt-4'>{user.firstName} {user.lastName}</td>
                                        <td className='pt-4'>{user.username}</td>
                                        <td className='pt-4'>{user.email}</td>
                                        <td className='pt-4 d-flex gap-2'><GetRetailersNuOfOrders user={user} /> <RetailersOrdersDrawer retailer={user} /></td>
                                        <td className='pt-4'>
                                            <div className='d-flex align-items-center gap-2'>
                                                <UserDrawer user={user} />
                                                {
                                                    user.status && user.status === 'disabled' ?
                                                        <h6 className='text-danger mb-1 d-flex align-items-center gap-2'>Disabled <CheckSquareFilled className='text-success mb-' onClick={() => { enableHandler(user._id); setSuccess(true); }} style={{ cursor: 'pointer' }} /></h6>
                                                        :
                                                        <a onClick={() => { deleteHandler(user._id); setSuccess(true); }}><DeleteOutlined className='mb-2' /></a>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

        </Layout>
    )
}
