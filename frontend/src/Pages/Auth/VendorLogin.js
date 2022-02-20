import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { UserLayout } from '../../Components/Layouts/UserLayout';
import { Helmet } from 'react-helmet';
import { setAuthentication } from '../../Components/Auth/auth';
import './Login.css';

export const VendorLogin = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',

  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }


  const onFinish = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios.post('/api/users/vendor/login', { email, password }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setAuthentication(res.data, res.data.token);
        swal('Congrats!', res.data.successMessage, 'success');
        props.history.push('/vendor/dashboard');
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
        <title>Virtual Shalmi | Vendor</title>
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
                <p className='title'>Vendor Login</p>
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
                    Login as Retailer? <Link to='/retailer/login'>Login</Link>
                  </p>
                  <p>
                    Forgot Password? <Link to='/forgot-password'>Reset</Link>
                  </p>
                  <p>
                    New to Website? <Link to='/vendor/signup'>Register</Link>
                  </p>
                </div>
              </>
          }
        </div>
      </div>

    </UserLayout>

  );
}
