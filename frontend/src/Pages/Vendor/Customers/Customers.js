import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../../../Components/Auth/auth';
import { VendorLayout } from '../../../Components/Layouts/VendorLayout';
import { GetRetailersNuOfOrders } from '../../../Components/Admin/Users/Retailers/RetailerNuOfOrders';
import { RetailersOrdersDrawer } from '../../../Components/Admin/Users/Retailers/RetailersOrdersDrawer';



export const Customers = () => {
    const [users, setUsers] = useState({});

    useEffect(() => {
        getUserById();
        return () => {

        }
    }, []);

    const getUserById = async () => {
        await axios.get(`/api/users/get/${isAuthenticated()._id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setUsers(res.data);
            } else {
                setUsers('');
            }
        })
    } 

    return (
        <VendorLayout sidebar>
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
                        </tr>
                    </thead>
                    <tbody>
                        {
                           users.customers && users.customers.length > 0 && users.customers.map((user, index) => {
                                return (
                                    <tr>
                                        <th className='pt-4' scope="row">{index + 1}</th>
                                        <td><img width='60' height='64' src={user.userPicture.url} alt={user.firsName} /></td>
                                        <td className='pt-4'>{user.firstName} {user.lastName}</td>
                                        <td className='pt-4'>{user.username}</td>
                                        <td className='pt-4'>{user.email}</td>
                                        <td className='pt-4 d-flex gap-2'><GetRetailersNuOfOrders user={user} vendorId = {users._id} /> <RetailersOrdersDrawer retailer={user} vendorId = {users._id} /></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

        </VendorLayout>
    )
}
