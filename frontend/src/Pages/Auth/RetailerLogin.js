import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { UserLayout } from '../../Components/Layouts/UserLayout';
import { Helmet } from 'react-helmet';
import { isAuthenticated, setAuthentication } from '../../Components/Auth/auth';
import { listProducts } from '../../Redux/Redux';
import { useDispatch } from 'react-redux';
import './Login.css';

export const RetailerLogin = (props) => {
  const userId = isAuthenticated()._id
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  const dispatch = useDispatch('');

  const handleCart = async (data) => {
    setLoading(true)
    await axios.post('/api/cart/ls-add-to-cart', data, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        swal('success', 'Product add to Bag successfully', 'success');
        dispatch(listProducts(userId));
        setLoading(false);
      }
      else {
        swal('Error', res.data.errorMessage, 'info');
      }
    })
  }

  const getCartProductsFromLocalStorage = async () => {
    const getDATA = localStorage.getItem("product") ? JSON.parse(localStorage.getItem('product')) : [];
    const unique = await Array.from(getDATA.reduce((map, obj) => map.set(obj._id, obj), new Map()).values());
    handleCart(unique);
  }


  const onFinish = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios.post('/api/users/retailor/login', { email, password }).then(async (res) => {
      setLoading(false);
      if (res.status === 200) {
        setAuthentication(res.data, res.data.token);
        await getCartProductsFromLocalStorage();
        swal('Congrats!', res.data.successMessage, 'success');
        props.history.push('/my/profile');
        window.location.reload();
      }
      else if (res.status === 201) {
        swal('Sorry!', res.data.errorMessage, 'error');
      }
      else {
        swal('Sorry!', res.data.errorMessage, 'warning');
      }
    })

  };


  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;

  return (

    <UserLayout navbar>
      <Helmet>
        <title>Virtual Shalmi | Retailor</title>
      </Helmet>
      <div className='login'>
        <div className='login-inner'>
          {
            loading
              ?
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '200px' }}>
                <Spin indicator={antIcon} />
              </div>

              :
              <>
                <h2 className='title'>Retailor Login</h2>
                <form onSubmit={onFinish}>
                  <div className="floating-label-group">
                    <input onChange={handleChange} name='email' type="text" id="name" className="form-control" autofocus required />
                    <label className="floating-label">Email or Username</label>
                  </div>
                  <div className="floating-label-group">
                    <input onChange={handleChange} name='password' type="password" id="password" className="form-control" autofocus required />
                    <label className="floating-label">Password</label>
                  </div>
                  <div className='text-center'>
                    <button type='submit' className='btn my-2 mt-2 w-100'>
                      Login
                    </button>
                  </div>
                </form>
                <div className='mt-4 bottom-links text-center'>
                  <p>
                    Login as Vendor? <Link to='/vendor/login'>Login</Link>
                  </p>
                  <p>
                    Forgot Password? <Link to='/forgot-password'>Reset</Link>
                  </p>
                  <p>
                    New to Website? <Link to='/retailer/signup'>Register</Link>
                  </p>
                </div>
              </>
          }
        </div>
      </div>
    </UserLayout>

  );
}
