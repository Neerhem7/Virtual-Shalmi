import React, { useEffect, useState } from 'react'
import { DollarOutlined, WalletOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Spin, Tabs } from 'antd';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { UserLayout } from '../Components/Layouts/UserLayout';
import { Error, Success } from '../Components/Messages/messages';
import { listProducts } from '../Redux/Redux';
import { isAuthenticated } from '../Components/Auth/auth';
import { Paypal } from '../Components/Payments/Paypal'
const { TabPane } = Tabs;

export const Payment = (props) => {
  const dispatch = useDispatch('');
  const user = isAuthenticated();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCartProducts = async () => {
    await axios.get(`/api/cart/get`, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        setProducts(res.data.products);
      } else {
        Error(res.data.errorMessage);
      }
    })


  }


  useEffect(() => {
    getCartProducts();
    return () => {

    }
  }, []);


  const address = JSON.parse(localStorage.getItem('addressInfo'));
  const totalPrice = JSON.parse(localStorage.getItem('totalPrice'));

  const emptyCart = async () => {
    await axios.delete(`/api/cart/empty`, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        Success(res.data.successMessage);
        dispatch(listProducts());
      } else {
        Error(res.data.errorMessage)
      }
    })
  }

  const cashOnDeliveryHandler = async () => {
    setLoading(true);
    await axios.post('/api/users/place-order-cod', { placed: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), totalPrice: totalPrice, image: user.userPicture.url, phone: user.phone, fname: user.firstName, lname: user.lastName, email: user.email, cartProducts: products, address: address }
      , {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
      .then(res => {
        setLoading(false);
        if (res.status === 200) {
          emptyCart();
          Success(res.data.successMessage);
          setTimeout(() => {
            props.history.push('/my/orders')
          }, 2000);
        } else {
          Error(res.data.errorMessage)
        }
      })

  }
  const transactionSuccess = async (data) => {
    await axios.post('/api/users/place-order-paypal', { placed: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), totalPrice: totalPrice, image: user.userPicture.url, phone: user.phone, fname: user.firstName, lname: user.lastName, email: user.email, cartProducts: products, address: address, paymentData: data }
      , {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          emptyCart();
          Success(res.data.successMessage);
          setTimeout(() => {
            props.history.push('/my/orders')
          }, 2000);
        } else {
          Error(res.data.errorMessage)
        }
      })

  }
  const transactionError = () => {

  }
  const transactionCanceled = () => {

  }

  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
  return (
    <div>
      <UserLayout navbar>
        <Helmet>
          <title>Virtual Shalmi | Payment</title>
        </Helmet>
        <div className='row payment' style={{ marginLeft: '100px' }}>
          <div className='col-md-8 pr-4'>
            <div style={{ width: '100%' }}>
              <p className='mt-5 ml-3' style={{ fontSize: '16px', fontWeight: '600', color: '#424553' }}>Choose Payment Mode</p>
              <div className='jumbotron jumbotron-fluid mt-4 border payment'>
                <Tabs tabPosition='left'>
                  <TabPane tab={<span><WalletOutlined />CASH ON DELIVERY</span>} key="1">
                    <div className='mt-5 pt-5 text-center'>
                      {
                        loading
                          ?
                          <div>
                            <Spin indicator={antIcon} />
                          </div>

                          :
                          <>
                            <h4 className=''>Get Product & Then Pay</h4>
                            <Link onClick={cashOnDeliveryHandler} className='btn mb-5 p-2' style={{ width: '50%', background: '#2a3e53', color: 'white', borderRadius: '23px', height: '45px' }}>Place Order</Link>
                          </>
                      }

                    </div>
                  </TabPane>
                  <TabPane tab={<span><DollarOutlined />CREDIT/DEBIT CARD</span>} key="2">
                    <div className='mt-5 text-center'>
                      <h4>Pay with Paypal</h4>
                      <div className='my-5'>
                        <Paypal
                          toPay={localStorage.getItem('totalPrice')}
                          onSuccess={transactionSuccess}
                          transactionError={transactionError}
                          transactionCanceled={transactionCanceled}
                        />
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
          <div className='col-md-4 mt-5 pl-4' style={{ borderLeft: '1px solid #dddde6' }}>
            <h6 className='text-muted'>PRICE DETAILS ({localStorage.getItem('totalProducts')} Items)</h6>
            <div className='row w-100'>
              <div className='col-md-7 mb-2'>
                Total MRP
              </div>
              <div className='col-md-4'>
                <h6>Rs. {localStorage.getItem('MRP')}</h6>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-4 my-2'>
                <h6> Total Amount </h6>
              </div>
              <div className='col-md-6 mt-2' style={{ paddingLeft: '102px' }}>
                <h6>Rs. {localStorage.getItem('totalPrice')}</h6>
              </div>

            </div>
          </div>
        </div>
      </UserLayout>
    </div>
  )
}
