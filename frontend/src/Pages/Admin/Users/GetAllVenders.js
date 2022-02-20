import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CheckSquareFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { GetReviews } from '../../../Components/Admin/GetReviews';
import { UserDrawer } from '../../../Components/Admin/Users/Drawer';
import { Layout } from '../../../Components/Layouts/Layout';
import { GetNuOfOrders } from '../../../Components/Admin/Users/Venders/GetNuOfOrders';
import { OrdersDrawer } from '../../../Components/Admin/Users/Venders/OrdersDrawer';
import { GetNuOfProducts } from '../../../Components/Admin/Products/GetNuOfProducts';
import { ProductsDrawer } from '../../../Components/Admin/Products/ProductsDrawer';
import { Button, Modal, Rate, Select } from 'antd';
import { Error, Success } from '../../../Components/Messages/messages';

const { Option } = Select;

export const GetAllVenders = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState('');
    const [star, setStar] = useState('');
    const [isStarModalVisible, setIsStarModalVisible] = useState(false);

    useEffect(() => {
        getUsers();
        return () => {

        }
    }, [success]);

    const getUsers = async () => {
        setLoading(true);
        await axios.get('/api/users/get/venders', {
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


    const showStarModal = (id) => {
        setIsStarModalVisible(true);
        setUserId(id);
    };

    const handleQtyOk = () => {
        setIsStarModalVisible(false);
    };

    const handleQtyCancel = () => {
        setIsStarModalVisible(false);
    };

    const saveStarToDb = async () => {
        await axios.post(`/api/users/give/star/${userId}`, { star }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                setIsStarModalVisible(false);
                getUsers();
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    return (
        <Layout sidebar>
            <div className='table-container'>
                <div className='table-responsive'>
                    <table className="table table-borderless">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Picture</th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Username</th>
                                <th scope="col">E-mail</th>
                                <th scope="col">Products</th>
                                <th scope="col">Orders</th>
                                <th scope="col">Reviews</th>
                                <th scope="col">Stars</th>
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
                                            <td className='pt-4'><GetNuOfProducts user={user} /> <ProductsDrawer user={user} /></td>
                                            <td className='pt-4 d-flex gap-2'><GetNuOfOrders vendor={user} /> <OrdersDrawer vendor={user} /></td>
                                            <td className='pt-4'><GetReviews id={user._id} /></td>
                                            <td className='pt-4'>
                                                <span className='mx-1'>
                                                    <Rate count={3} value={user.star} />
                                                </span>
                                                <span>
                                                    <EditOutlined onClick={() => showStarModal(user._id)} />
                                                    <Modal footer={false} width={380} visible={isStarModalVisible} onOk={handleQtyOk} onCancel={handleQtyCancel}>
                                                        <div className='text-center'>
                                                            <h4>Give Star</h4>
                                                            <Select className='w-50' defaultValue={user.star} onChange={(value) => setStar(value)}>
                                                                <Option value="1">1</Option>
                                                                <Option value="2">2</Option>
                                                                <Option value="3">3</Option>
                                                            </Select>
                                                            <div className='mt-2'>
                                                                <Button onClick={saveStarToDb}>Save</Button>
                                                            </div>
                                                        </div>
                                                    </Modal>
                                                </span>
                                            </td>
                                            <td className='pt-4'>
                                                <div className='d-flex align-items-center gap-2'>
                                                    <UserDrawer user={user} />
                                                    {
                                                        user.status && user.status === 'disabled' ?
                                                            <h6 className='text-danger mb-1 d-flex align-items-center gap-2'>Disabled <CheckSquareFilled className='text-success' onClick={() => { enableHandler(user._id); setSuccess(true); }} style={{cursor: 'pointer'}}/></h6>
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
            </div>
        </Layout>
    )
}
