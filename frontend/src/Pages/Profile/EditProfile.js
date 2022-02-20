import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { isAuthenticated } from '../../Components/Auth/auth';
import { ProfLayout } from '../../Components/Layouts/ProfileLayout';
import './Profile.css'

export const EditProfile = () => {
    const token = localStorage.getItem('token');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');
    const [image, setImage] = useState('');
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        country: '',
        username: '',
        email: '',
        shopAddress: '',
        postalCode: '',
        shopName: ''
    });
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '', 
    });

    const { firstName, lastName, phone, country, city, username, email, shopAddress, postalCode, shopName } = user;

    const handleProfileChnage = (e) => {
        setUser({ 
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleImageChange = (e) => {
        setFile(
            e.target.files[0]

        )
    }

    const removeImage = () => {
        setImage('');
    }


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePasswordChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        });
    }


    const getUser = async () => {
        setLoading(true);
        await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
            setLoading(false);
            if(res.status === 200) {
                setUser(res.data);
                setImage(res.data.userPicture && res.data.userPicture.url) 
            } else {
                setUser('');
            }
           
        })
    }

    const submitEditHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = new FormData();
        data.append('firstName', firstName);
        data.append('lastName', lastName);
        data.append('email', email);
        data.append('username', username);
        data.append('phone', phone);
        data.append('postalCode', postalCode);
        data.append('city', city);
        data.append('country', country);
        if(file) {
            data.append('file', file);
        }
        data.append('image', image);
        await axios.put(`/api/users/user/upadate`, data, {
            headers: {
                'authorization': 'Bearer ' + token
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                swal('Congrats!', res.data.successMessage, 'success');
            } else {
                swal('Sorry!', res.data.errorMessage, 'error');
            }
        });

    }

    const submitPasswordHandler = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmNewPassword) {
            swal('Sorry', 'The passwords do not match.', 'error');
        } else {
            await axios.post(`/api/users/change/password`, { oldPassword: password.oldPassword, newPassword: password.newPassword, confirmNewPassword: password.confirmNewPassword }, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    swal('Congrats!', res.data.successMessage, 'success');
                } else if (res.status === 201) {
                    swal('Sorry!', res.data.errorMessage, 'error');
                } else {
                    swal('Sorry!', 'Failed to change password.', 'error');
                }
            });
        }
    }

    useEffect(() => {
        getUser();
        return () => {

        }
    }, []);

    const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
    return (
        <ProfLayout sidebar>
            {
                loading ?
                    <div className='text-center fixed-top' style={{ marginTop: '50vh' }}>
                        <Spin indicator={antIcon} />
                    </div>

                    :
                    <div className='edit-profile'>
                        <form className='border mb-5' onSubmit={submitEditHandler}>
                            <div className="row p-3" style={{ marginLeft: '10px' }}>
                                <div className="col-xs-4 col-xs-offset-4 mr-4">

                                    <div>
                                        {
                                            image &&
                                            <>
                                                <div>
                                                    <DeleteOutlined onClick={() => removeImage()} style={{ paddingLeft: '180px' }} />
                                                </div>
                                                <img src={image} className='mb-4' width='180' height='200' />
                                            </>
                                        }
                                        {
                                            !image &&
                                            <div className="custom-file my-4" style={{ marginLeft: '120px' }}>
                                                <input type="file" name='file' required multiple onChange={handleImageChange} />
                                                <label className="custom-file-label" for="customFile"></label>
                                            </div>
                                        }

                                    </div>
                                    <div className="floating-label-group">
                                        <input onChange={handleProfileChnage} onInput = {(e) => e.target.value = e.target.value.slice(0, 11)} value={phone} name='phone' type="number" id="phone" className="form-control" autofocus required />
                                        <label className="floating-label">Phone</label>
                                    </div>
                                    <div>
                                        <div className="floating-label-group">
                                            <input onChange={handleProfileChnage} value={firstName} name='firstName' type="text" id="firstName" className="form-control" autofocus required />
                                            <label className="floating-label">First Name</label>
                                        </div>
                                        <div className="floating-label-group">
                                            <input onChange={handleProfileChnage} value={lastName} name='lastName' type="text" id="lastName" className="form-control" autofocus required />
                                            <label className="floating-label">Last Name</label>
                                        </div>                                        
                                    </div>
                                    <div className="floating-label-group">
                                        <input onChange={handleProfileChnage} value={city} name='city' type="text" id="City" className="form-control" autofocus required />
                                        <label className="floating-label">City</label>
                                    </div>
                                    <div className="floating-label-group">
                                        <input onChange={handleProfileChnage} value={postalCode} name='postalCode' type="text" className="form-control" autofocus required />
                                        <label className="floating-label">Postal Code</label>
                                    </div>
                                    <div className="floating-label-group">
                                        <input onChange={handleProfileChnage} value={country} name='country' type="text" id="country" className="form-control" autofocus required />
                                        <label className="floating-label">Country</label>
                                    </div>

                                </div>

                            </div>
                            <div className='px-5'>
                                <button className='btn submit-btn' type='submit'>Save Details</button>
                            </div>
                            <div className='px-5 my-4'>
                                <Link onClick={showModal} className='btn submit-btn bg-white border-secondary text-dark font-weight-bolder'>Change Passsword</Link>
                            </div>
                            <div className='px-5 my-4'>
                                <Link to = '/my/profile' className='btn submit-btn bg-white border-secondary text-dark font-weight-bolder'>Cancel</Link>
                            </div>
                        </form>

                        <Modal width={460} footer={false} title="Change Password" visible={isModalVisible} onCancel={handleCancel}>
                            <div className='edit-profile password-modal mx-4'>
                                <form onSubmit={submitPasswordHandler}>
                                    <div className="floating-label-group">
                                        <Input.Password onChange={handlePasswordChange} name='oldPassword' className="form-control" />
                                        <label className="floating-label">Old Password*</label>
                                    </div>
                                    <div className="floating-label-group">
                                        <Input.Password onChange={handlePasswordChange} name='newPassword' className="form-control" />
                                        <label className="floating-label">New Password*</label>
                                    </div>
                                    <div className="floating-label-group">
                                        <Input.Password onChange={handlePasswordChange} name='confirmNewPassword' className="form-control" autofocus required />
                                        <label className="floating-label">Confirm New Password*</label>
                                    </div>
                                    <div className=''>
                                        <button className='btn submit-btn' type='submit'>Change</button>
                                    </div>
                                    <div className='mt-4'>
                                        <Link onClick={() => setIsModalVisible(false)} className='btn submit-btn bg-white border-secondary text-dark font-weight-bolder'>Cancel</Link>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    </div>
            }
        </ProfLayout>
    )
}
