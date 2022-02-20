import React from 'react'
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { logout } from '../Auth/auth';

export const AdminSideBar = () => {
    const location = useLocation();
    return (
        <div className='sidebar'>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                }}
            >
                <div><Link to='/' className='logo'>Virtual Shalmi</Link></div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['/admin/dashboard']} selectedKeys={[location.pathname]}>
                    <Menu.Item key="/admin/dashboard">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-th-large"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/dashboard'> Dashboard </NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/stats">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-chart-area"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/stats'> Stats and Reports </NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/vendors">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-store"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/vendors'> Vendors </NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/retailers">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-user-friends"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/retailers'> Retailers </NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/all-categories">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-th-list"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/all-categories'>List of Categories</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/get-products"><div className='sidebar-links'>
                        <div>
                            <i className="fas fa-chart-pie"></i>
                        </div>
                        <div>
                            <NavLink to='/admin/get-products'>Products</NavLink>
                        </div>
                    </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/orders">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/orders'> Order Management</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/payment">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/payment'> Payment</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/logout">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                            <div>
                                <a href='/admin/login' onClick={() => { logout(() => { }) }}>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </Menu.Item>
                </Menu>
            </Sider>
        </div>
    )
}
