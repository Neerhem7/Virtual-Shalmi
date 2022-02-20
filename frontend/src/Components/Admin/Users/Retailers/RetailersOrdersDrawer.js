import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleFilled, EyeOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import { Error } from '../../../Messages/messages';

export const RetailersOrdersDrawer = ({ retailer, vendorId }) => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState({});
    const [data, setData] = useState("null");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const getAllOrders = async () => {
        vendorId ?
            await axios.post(`/api/users/customer/orders/${retailer._id}`, { vendorId }, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.status === 200) {
                    setOrders(res.data);
                }
                else {
                    Error(res.data.errorMessage);
                }
            })
            :
            await axios.get(`/api/users/orders/${retailer._id}`, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.status === 200) {
                    setOrders(res.data);
                }
                else {
                    Error(res.data.errorMessage);
                }
            })
    }

    useEffect(() => {
        getAllOrders();
        return () => {

        }
    }, []);


    /************************************************** Modal ***********************************************/
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    return (
        orders.length > 0 &&
        <>
            <EyeOutlined className='mt-2' onClick={() => showDrawer()} />
            <Drawer
                width={1000}
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
            >
                <div className='orders admin-orders pt-5 mt-5'>

                    {
                        orders && orders.length > 0 && orders.map((order, index) => {
                            return (
                                <div className='table-responsive'>
                                    <table class="table border-0">

                                        <tbody>
                                            <tr className='bg-secondary text-white'>
                                                <th>
                                                    Order #{index + 1}

                                                </th>
                                                <th>
                                                    Order Id : {order._id}
                                                </th>
                                                <th>
                                                    Total Price : Rs.{order.product.price * order.product.qty}
                                                </th>
                                                {
                                                    !vendorId &&
                                                    <th>
                                                        <div>Vendor: {order.vendorId && order.vendorId.shopName}</div>
                                                    </th>
                                                }
                                                <th>
                                                    <Link className='text-white' onClick={() => { showModal(); setUser(order.user); setData(order.data) }}>Customer</Link>
                                                </th>
                                                <th>
                                                    <p className='text-white pt-3'>Status: {order.status === '1' && 'Just Placed'}
                                                        {order.status === '2' && 'Confirmed'}
                                                        {order.status === '3' && 'Prepared'}
                                                        {order.status === '4' && 'Delivered'}
                                                        {order.status === '5' && <CheckCircleOutlined className='fs-5 text-success bg-white rounded-circle' style={{ marginTop: '-10px' }} />}
                                                        {order.status === '0' && <CloseCircleFilled className='fs-5 text-danger bg-white rounded-circle' style={{ marginTop: '-10px' }} />}
                                                    </p>
                                                </th>
                                            </tr>
                                            <div className='text-center mb-4' style={{ width: '100%', position: 'relative' }}>
                                                <th style={{ position: 'absolute', left: '200%', top: '0px', width: '400px' }}>
                                                    <span>Placed At: {order.placed}</span>
                                                </th>
                                            </div>
                                            <tr>
                                                <th>
                                                    <img src={order.product.image} height='71' width='64' alt='image' />
                                                </th>
                                                <th>
                                                    {order.product.name}

                                                </th>
                                                <th>Qty:{order.product.qty}</th>
                                                <th>Rs.{order.product.price * order.product.qty}</th>
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>
                            )
                        })
                    }

                </div>
            </Drawer>
            <Modal footer={false} width={800} title="User Info" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div className="row">
                    <div className="col-md-12 my-4">
                        <h6>Profile Picture:</h6>
                        <img src={user.image} alt='image' width='200' />
                    </div>
                    <div className="col-md-6 my-4">
                        <h6>Full Name:</h6>
                        <b>{user.fname} {user.lname}</b>
                    </div>
                    <div className="col-md-6 my-4">
                        <h6>Email:</h6>
                        <b>{user.email}</b>
                    </div>
                    <div className="col-md-6 my-4">
                        <h6>Address For Delivery:</h6>
                        <b>{user.address}</b>
                    </div>
                </div>
                {
                    data &&
                    <div className="row">
                        <h2>Payment Information:</h2>
                        <div className="col-md-6 my-4">
                            <h6>Paid:</h6>
                            <b>{data.paid ? <span>True</span> : <span>false</span>}</b>
                        </div>
                        <div className="col-md-6 my-4">
                            <h6>Cancelled:</h6>
                            <b>{data.cancelled ? <span>True</span> : <span>false</span>}</b>
                        </div>
                        <div className="col-md-6 my-4">
                            <h6>PayerID:</h6>
                            <b>{data.payerID}</b>
                        </div>
                        <div className="col-md-6 my-4">
                            <h6>Payment ID:</h6>
                            <b>{data.paymentID} </b>
                        </div>
                        <div className="col-md-6 my-4">
                            <h6>Payment Token:</h6>
                            <b>{data.paymentToken} </b>
                        </div>
                        <div className="col-md-6 my-4">
                            <h6>Email:</h6>
                            <b>{data.email}</b>
                        </div>
                    </div>
                }
            </Modal>
        </>
    )
}
