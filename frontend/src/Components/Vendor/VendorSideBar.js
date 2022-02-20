import React from 'react'
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { logout } from '../Auth/auth';
import './Sidebar.css'

export const VendorSideBar = () => {
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
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['/vendor/dashboard']} selectedKeys={[location.pathname]}>
                    <Menu.Item key="/vendor/dashboard">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-th-large"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/vendor/dashboard'>Dashboard</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/stats">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-chart-area"></i>
                            </div>
                            <div>
                                <NavLink to='/vendor/stats'> Stats and Reports </NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/get-products">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-shopping-bag"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/vendor/get-products'>Products</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/orders">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/vendor/orders'> Order Management</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/payment">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/vendor/payment'> Payment</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/customers">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-users"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/vendor/customers'> Customers</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/reviews">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-comment-alt"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/vendor/reviews'> Reviews</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/profile">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/vendor/profile'> Profile</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/vendor/logout">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                            <div>
                                <a href='/vendor/login' onClick={() => { logout(() => { }) }}>
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
