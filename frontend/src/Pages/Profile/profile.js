import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../Components/Auth/auth';
import { ProfLayout } from '../../Components/Layouts/ProfileLayout';
import { Error } from '../../Components/Messages/messages';
import './Profile.css'

export const Profile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
        setLoading(true);
        await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
            if (res.status === 200) {
                setUser(res.data);
                setLoading(false);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getUser();
        return () => {

        }
    }, []);

    return (
        <ProfLayout sidebar>
            <div className='profile'>
                <div className='inner' style={{ marginTop: '10px', paddingTop: '47px', border: '1px solid #d4d5d9' }}>
                    <div>
                        <h4>Profile Details</h4>
                        <div className='profile-data mt-4 pb-5' style={{ borderTop: '1px solid #d4d5d9' }}>
                            <div className='items'>
                                <div>
                                    <p> Full Name</p>
                                </div>
                                <div>
                                    <p>{user.firstName} {user.lastName}</p>
                                </div>
                            </div>
                            <div className='items'>
                                <div>
                                    <p> Mobile Number</p>
                                </div>
                                <div>
                                    <p>{user.phone}</p>
                                </div>
                            </div>
                            <div className='items'>
                                <div>
                                    <p>Email ID</p>
                                </div>
                                <div>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <div className='items'>
                                <div>
                                    <p>Location</p>
                                </div>
                                <div>
                                    <p>{user.city} {user.country}</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-3'>
                            <Link to={`/my/profile/update/${user._id}`} className='btn btn-dark w-100'>Edit</Link>
                        </div>
                    </div>
                </div>
            </div>

        </ProfLayout>
    )
}
