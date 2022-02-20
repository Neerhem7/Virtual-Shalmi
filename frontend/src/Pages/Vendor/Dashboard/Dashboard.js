import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { VendorLayout } from '../../../Components/Layouts/VendorLayout';
import { Error } from '../../../Components/Messages/messages';
import './Dashboard.css'

export const VendorDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [vendor, setVendor] = useState({});
    const [products, setProducts] = useState([]);

    const getAllOrders = async () => {
        await axios.get(`/api/users/vendor/all-orders/${isAuthenticated()._id}`, {
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

    const getAllProducts = async () => {
        await axios.get(`/api/products/vendor/get/${isAuthenticated()._id}`).then(res => {
            if (res.status === 200) {
                setProducts(res.data);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getAllOrders();
        getVendor();
        getAllProducts();
        return () => {

        }
    }, []);

    var saleStartExp = moment(vendor.saleStartDate);
    var saleStartDuration = moment.duration(saleStartExp.diff(moment())).asMinutes();


    var saleEndExp = moment(vendor.saleEndDate);
    var saleEndDuration = moment.duration(saleEndExp.diff(moment())).asMinutes();
    console.log(saleStartDuration)
    console.log(saleEndDuration)
    const renderer = ({ hours, minutes, seconds, completed }) => {
        console.log(hours, minutes)
        if (completed) {
            return (
                <>

                </>
            )
        } else {
            return (
                <div>
                    <p className='fs-4 text-danger'>Sale Ends: {hours}:{minutes}:{seconds}</p>
                </div>
            )
        }
    };

    return (
        <VendorLayout sidebar>
            <div className='vendor-dashboard'>
                <div className='d-flex justify-content-end mb-2 gap-4'>
                    <div>
                        {
                            vendor.saleStartDate && vendor.saleEndDate && saleStartDuration < 0 && saleEndDuration > 0 &&
                            <Countdown autoStart={saleStartDuration < 0} renderer={renderer} date={vendor.saleEndDate} />
                        }
                    </div>

                </div>
                <div className='summary-conatainer'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <p>Sales</p>
                            <h4>Rs.{Math.round(orders && orders.length > 0 && orders.reduce((a, b) => b.status === '5' && b.product && a + b.product.price * b.product.qty, 0)).toFixed(0)}</h4>
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
                <div className='details-container row mt-5'>
                    <div className='section col-md-6'>
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
                    <div className='section col-md-6'>
                        <div>
                            <h5 className='d-flex justify-content-between'>
                                <span>
                                    Products
                                </span>
                                <Link className='text-dark' to='/vender/create-products'>
                                    Add New Product
                                </Link>

                            </h5>
                            <div className='mx-4'>
                                <div className='columns'>
                                    <div><span>Total</span></div>
                                    <div><span>{products.length}</span></div>
                                </div>
                                <div className='columns'>
                                    <div><span>On Sale</span></div>
                                    <div><span>{products.filter(product => product.salePrice && product.saleStartDate && moment.duration(moment(product.saleStartDate).diff(moment())).asMinutes() < 0 && moment.duration(moment(product.saleEndDate).diff(moment())).asMinutes() > 0).length}</span></div>
                                </div>
                                <div className='columns'>
                                    <div><span>Out Of Stock</span></div>
                                    <div><span className='text-danger'>{products.filter(p => p.qty <= 1).length}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='section col-md-6'>
                        <div>
                            <h5>Customers</h5>
                            <div className='mx-4'>
                                <div className='columns'>
                                    <div><span>Total</span></div>
                                    <div><span>{vendor.customers && vendor.customers.length}</span></div>
                                </div>
                                <div className='columns'>
                                    <div><span>Active</span></div>
                                    <div><span>{vendor.customers && vendor.customers.filter(user => user.status !== 'disabled').length}</span></div>
                                </div>
                                <div className='columns'>
                                    <div><span>Disabled</span></div>
                                    <div><span className='text-danger'>{vendor.customers && vendor.customers.filter(user => user.status === 'disabled').length}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    )
}
