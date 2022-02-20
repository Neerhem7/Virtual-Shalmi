import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { isAuthenticated } from '../../Components/Auth/auth';
import { UserLayout } from '../../Components/Layouts/UserLayout';
import { Success } from '../../Components/Messages/messages';
import './Address.css'

export const Address = (props) => {
    const [created, setCreated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sendingAddress, setSendingAddress] = useState({});
    const [data, setData] = useState({
        name: '',
        mobile: '',
        address: '',
        pinCode: '',
        city: '',
        state: ''
    });

    const { name, mobile, address, pinCode, city, state } = data;

    const handleAddressChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post('/api/users/address/post', { name, mobile, address, pinCode, city, country: state }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setLoading(false);
                setSendingAddress(res.data.result.address);
                Success(res.data.successMessage);
                setCreated(true);
            } else {
                Error(res.data.errorMessage);
            }
        });

    }

    const moveToPayment = async () => {
        await localStorage.setItem('addressInfo', JSON.stringify(sendingAddress));
        isAuthenticated() ? props.history.push('/checkout/payment') : props.history.push('/login')
    }


    useEffect(() => {
        created && moveToPayment();
        return () => {

        }
    }, [created])



    const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;


    return (
        <UserLayout navbar>
            <div>
                <Helmet>
                    <title>Virtual Shalmi | Address</title>
                </Helmet>
            </div>
            {
                loading
                    ?
                    <div className='text-center fixed-top' style={{ marginTop: '50vh' }}>
                        <Spin indicator={antIcon} />
                    </div>

                    :
                    <div>
                        <div className='address'>
                            <div>
                                <form className='border' onSubmit={submitHandler}>
                                    <div className="row p-3">
                                        <div className="col-xs-4 col-xs-offset-4 ">
                                            <div>
                                                <h6>Contact Details:</h6>
                                                <div className="floating-label-group">
                                                    <input onChange={handleAddressChange} name='name' type="text" id="name" className="form-control" autocomplete="off" autofocus required />
                                                    <label className="floating-label">Name</label>
                                                </div>
                                                <div className="floating-label-group">
                                                    <input onChange={handleAddressChange} onInput={(e) => e.target.value = e.target.value.slice(0, 11)} name='mobile' type="number" id="Mobile no." className="form-control" autocomplete="off" autofocus required />
                                                    <label className="floating-label">Mobile no.</label>
                                                </div>
                                            </div>

                                            <div></div>
                                            <h6>Address:</h6>
                                            <div className="floating-label-group">
                                                <input onChange={handleAddressChange} name='pinCode' type="number" id="Pin-Code" className="form-control" autocomplete="off" autofocus required />
                                                <label className="floating-label">Pin Code</label>
                                            </div>
                                            <div className="floating-label-group">
                                                <input onChange={handleAddressChange} name='address' type="text" id="Address" className="form-control" autocomplete="off" autofocus required />
                                                <label className="floating-label">Address(House No, Building, Street, Area)</label>
                                            </div>
                                            <div className="floating-label-group">
                                                <input onChange={handleAddressChange} name='city' type="text" id="City" className="form-control" autocomplete="off" autofocus required />
                                                <label className="floating-label">City</label>
                                            </div>
                                            <div className="floating-label-group">
                                                <input onChange={handleAddressChange} name='state' type="text" id="State" className="form-control" autocomplete="off" autofocus required />
                                                <label className="floating-label">Country</label>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='submit-btn-container'>
                                        <button className='btn submit-btn' type='submit'>ADD ADDRESS</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
            }
        </UserLayout>

    )
}
