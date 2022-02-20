import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Dropdown, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../Redux/Redux';
import { isAuthenticated, logout } from './Auth/auth';
import { ShoppingCartOutlined, ProfileOutlined } from '@ant-design/icons';




export const Navbar = () => {
  const productsList = useSelector(state => state.productsList);
  const { productsInCart } = productsList;
  const cart = productsInCart && productsInCart ? productsInCart.products && productsInCart.products.length : 0;
  const getDATA = localStorage.getItem("product") ? JSON.parse(localStorage.getItem('product')) : [];
  const uniqueCart = Array.from(getDATA.reduce((map, obj) => map.set(obj._id, obj), new Map()).values());
  const localCartProducts = uniqueCart;

  const userId = isAuthenticated()._id;
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(listProducts(userId));
    }


    return () => {

    }
  }, [userId]);


  const menu = (
    <div className='navMenu' >
      {
        isAuthenticated()
          ?
          <Menu style={{ paddingTop: '10px', paddingBottom: '10px' }}>
            <Menu.Item>
              <p className='pt-2'>
                <h6>Hello {isAuthenticated().firstName}</h6> <br />
              </p>
              <div style={{ borderBottom: '1px solid #eaeaec', paddingTop: '0px' }}></div>
            </Menu.Item>
            <Menu.Item>
              <Link to={isAuthenticated().role === 1 ? "/admin/dashboard" : isAuthenticated().role === 0.5 ? '/vendor/dashboard' : '/my/profile'}>
                Dashboard
              </Link>
            </Menu.Item>
            <div style={{ borderBottom: '1px solid #eaeaec', paddingTop: '20px' }}></div>
            <Menu.Item>
              <a href='/retailer/login' onClick={() => { logout(() => { }) }}>
                Logout
              </a>
            </Menu.Item>
          </Menu>

          :
          <Menu style={{ padding: '10px', paddingBottom: '100px' }}>
            <h6>Welcome</h6>
            <p>To access account and manage orders</p>
            <div className='mt-5 text-center'>
              <Link to="/vendor/login" className='px-4 py-2' style={{ border: '1px solid #000' }}>
                Vendor Login
              </Link>
            </div>
            <div className='mt-5 text-center'>
              <Link to="/retailer/login" className='px-4 py-2' style={{ border: '1px solid #000' }}>
                Retailer Login
              </Link>
            </div>
          </Menu>
      }
    </div>
  );


  return (
    <div className='main-nav pb-5 mb-5' >
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
        <Link className="navbar-brands" to="/"><img src = '/assets/Logo.png' alt='logo' width= '123'/></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto list-unstyle pt-3 mx-4" style={{ fontSize: '12px' }}>
            <li className='nav-item profile ml-5' style={{ fontWeight: 'normal' }}>
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  <ProfileOutlined style={{ fontSize: '21px', paddingLeft: '10px' }} />
                  <br />
                  <span style={{ fontSize: '14px' }}>Profile</span>
                </a>
              </Dropdown>

            </li>

            <li className='ml-2'>
              <Badge count={isAuthenticated() ? cart : localCartProducts.length}>
                <Link to='/cart'><ShoppingCartOutlined style={{ fontSize: '24px', paddingBottom: '1px' }} /><br /><span style={{ fontSize: '14px' }}>
                  Bag
                </span>
                </Link>

              </Badge>

            </li>

          </ul>
        </div>
      </nav>
    </div>
  )
}
