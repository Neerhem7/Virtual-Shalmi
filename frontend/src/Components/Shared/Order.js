import { CheckCircleOutlined, CloseCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Success } from '../Messages/messages';

const { Option } = Select;

export const Order = (props) => {
    const [user, setUser] = useState({});
    const [data, setData] = useState("null");
    const [orderStatus, setOrderStatus] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

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



    function handleChange(value) {
        setOrderStatus(value);
    }


    const orderStatusHandler = async (orderId) => {
        await axios.post("/api/users/set/status", { status: orderStatus, orderId, updateTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a") }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                swal('Congrats!', res.data.successMessage, 'success');
                props.update && props.update();
            } else {
                swal('Sorry!', 'Failed to set Order Status.', 'error');
            }
        })
    }


    /************************************************** Cancel Orders ***********************************************/
    const deleteHandler = async (orderId) => {
        await axios.delete(`/api/users/order/delete/${orderId}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                props.update && props.update();
            }
            else {

                Error(res.data.errorMessage)
            }
        })
    }


    function cancel(e) {
        Error('Request Cancelled!')
    }


    return (
        <div>
            {
                props.orders && props.orders.length > 0 && props.orders.map((order, index) => {
                    return (
                        props.status ?
                            order.status === props.status && order.product &&
                            <div className='table-container'>
                                <table className="table table-borderless">
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
                                            <th>
                                                <Link className='text-white' onClick={() => { showModal(); setUser(order.user); setData(order.data) }}>Customer</Link>
                                            </th>
                                            <th>
                                                <Link className='text-white'>Vendor: {order.vendorId && order.vendorId.shopName}</Link>
                                            </th>
                                            <th>
                                                <span>Status : &nbsp;
                                                    {order.status === '1' && 'Just Placed'}
                                                    {order.status === '2' && 'Confirmed'}
                                                    {order.status === '3' && 'Prepared'}
                                                    {order.status === '4' && 'Delivered'}
                                                    {order.status === '5' && <CheckCircleOutlined className='fs-5 text-success bg-white rounded-circle' style={{ marginTop: '-10px' }} />}
                                                    {order.status === '0' && <CloseCircleFilled className='fs-5 text-danger bg-white rounded-circle' style={{ marginTop: '-10px' }} />}
                                                </span>
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
                                            {
                                                props.vendor && props.vendor === 1 ?
                                                    <th className='text-success'>Earned: Rs.
                                                        {
                                                            order.adminSale ?
                                                                <>{order.product.price * order.product.qty}</>
                                                                :
                                                                <>{order.product.price * order.product.qty * 0.95}</>
                                                        }
                                                    </th>
                                                    :
                                                    <th className='text-success'>Earned: Rs.
                                                        {
                                                            order.adminSale ?
                                                                <>{order.product.price * order.product.qty * 0}</>
                                                                :
                                                                <>{order.product.price * order.product.qty * 0.05}</>
                                                        }
                                                    </th>
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            order.status !== "0" && order.status !== "5" && order.product &&
                            <div className='table-container'>
                                <table className="table table-borderless">
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
                                            <th>
                                                <Link className='text-white' onClick={() => { showModal(); setUser(order.user); setData(order.data) }}>Customer</Link>
                                            </th>
                                            <th>
                                                <Link className='text-white'>Vendor: {order.vendorId && order.vendorId.shopName}</Link>
                                            </th>
                                            <th>
                                                <span>Status : &nbsp;
                                                    {order.status === '1' && 'Just Placed'}
                                                    {order.status === '2' && 'Confirmed'}
                                                    {order.status === '3' && 'Prepared'}
                                                    {order.status === '4' && 'Delivered'}
                                                    {order.status === '5' && <CheckCircleOutlined className='fs-5 text-success bg-white rounded-circle' style={{ marginTop: '-10px' }} />}
                                                    {order.status === '0' && <CloseCircleFilled className='fs-5 text-danger bg-white rounded-circle' style={{ marginTop: '-10px' }} />}
                                                </span>
                                            </th>
                                            {
                                                props.vendor && props.vendor === 1 && props.status != '5' && props.status != '0' &&
                                                <>
                                                    <th>
                                                        <div className='d-flex align-items-center'>
                                                            <div>
                                                                <Select defaultValue={order.status} onChange={handleChange}>
                                                                    <Option value="1">Just Placed</Option>
                                                                    <Option value="2">Confirmed</Option>
                                                                    <Option value="3">Prepared</Option>
                                                                    <Option value="4">Delivered</Option>
                                                                    <Option value="5">Complete</Option>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Button onClick={() => orderStatusHandler(order._id)}>Set</Button>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <Popconfirm
                                                            title="Are you sure?"
                                                            onConfirm={() => deleteHandler(order._id)}
                                                            onCancel={cancel}
                                                            placement='topLeft'
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <span className='text-white'><DeleteOutlined /></span>
                                                        </Popconfirm>

                                                    </th>
                                                </>
                                            }
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
                                            {/* {
                                                props.vendor && props.vendor === 1 ?
                                                    <th className='text-success'>Earned: Rs.{order.product.price * order.product.qty * 0.95}</th>
                                                    :
                                                    <th className='text-success'>Earned: Rs.{order.product.price * order.product.qty * 0.05}</th>
                                            } */}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    )
                })
            }

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
        </div>
    )
}
