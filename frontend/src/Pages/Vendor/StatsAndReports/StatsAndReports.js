import React, { useEffect, useState } from 'react'
import { VendorLayout } from '../../../Components/Layouts/VendorLayout'
import { Error } from '../../../Components/Messages/messages';
import axios from 'axios';
import './Stats.css';
import { Select } from 'antd';
import { isAuthenticated } from '../../../Components/Auth/auth';

const { Option } = Select;

export const VendorStatsAndReports = () => {
    const [orders, setOrders] = useState([]);
    const [value, setValue] = useState('1');
    const [vendor, setVendor] = useState({});

    const getVendor = async () => {
        await axios.get(`/api/users/get/${isAuthenticated()._id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setVendor(res.data);
            }
            else {
                Error(res.data.errorMessage);
            }
        })
    }

    const getOrders = async () => {
        value === '1' ?
            await axios.get(`/api/users/all-orders`, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(async (res) => {
                if (res.status === 200) {
                    await setOrders(res.data && res.data.filter(order => order.vendorId && order.vendorId._id === isAuthenticated()._id));
                }
                else {
                    Error(res.data.errorMessage);
                }
            })
            :
            value === '2' ?
                await axios.get(`/api/users/orders/last-week`, {
                    headers: {
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    if (res.status === 200) {
                        setOrders(res.data && res.data.filter(order => order.vendorId === isAuthenticated()._id));
                    }
                    else {
                        Error(res.data.errorMessage);
                    }
                })
                :
                value === '3' &&
                await axios.get(`/api/users/orders/last-month`, {
                    headers: {
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    if (res.status === 200) {
                        setOrders(res.data && res.data.filter(order => order.vendorId === isAuthenticated()._id));
                    }
                    else {
                        Error(res.data.errorMessage);
                    }
                })
    }


    console.log(orders);
    useEffect(() => {
        getOrders();
        getVendor();
        return () => {

        }
    }, []);



    function handleChange(value) {
        setValue(value);
    }

    return (
        <VendorLayout sidebar>
            <div className='StatsAndReports'>
                <div className='d-flex justify-content-end my-4 gap-3'>
                    <div>
                        <Select defaultValue="1" style={{ minWidth: '100px' }} onChange={handleChange}>
                            <Option value="1">All Time</Option>
                            <Option value="2">Last Week</Option>
                            <Option value="3">Last Month</Option>
                        </Select>
                    </div>
                    <div>
                        <button className='btn py-1' onClick={getOrders}>Filter</button>
                    </div>
                </div>
                <div className='summary-conatainer'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <p>Sales</p>
                            <h4>Rs.{Math.round(orders && orders.filter(order => order.status === '5').reduce((a, b) => a + b.product.price * b.product.qty, 0)).toFixed(0)}</h4>
                        </div>
                        <div className='col-md-4'>
                            <p>Earnings</p>
                            <h4>Rs.{vendor && vendor.earnings}</h4>
                        </div>
                        <div className='col-md-4'>
                            <p>Orders</p>
                            <h4>{orders && orders.length}</h4>
                        </div>
                    </div>
                </div>
                <div className='details-container mt-5'>
                    <div className='section'>
                        <div>
                            <h5>Orders</h5>
                            <div className='mx-4'>
                                <div className='columns'>
                                    <div><span>Total</span></div>
                                    <div><span>{orders.length}</span></div>
                                </div>
                                <div className='columns'>
                                    <div><span>Completed</span></div>
                                    <div><span>{orders.filter(o => o.status === '5').length}</span></div>
                                </div>
                                <div className='columns'>
                                    <div><span>Pending</span></div>
                                    <div><span>{orders.filter(o => o.status !== '5' && o.status !== '0').length}</span></div>
                                </div>
                                <div className='columns'>
                                    <div><span>Cancelled</span></div>
                                    <div><span>{orders.filter(o => o.status === '0').length}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout >
    )
}
