import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, InputNumber, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { CaretDownOutlined, LoadingOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { useDispatch } from 'react-redux';
import { listProducts } from '../../Redux/Redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { isAuthenticated } from '../../Components/Auth/auth';
import { Error, Success } from '../../Components/Messages/messages';
import { UserLayout } from '../../Components/Layouts/UserLayout';



export const ProductCart = (props) => {
  const userId = isAuthenticated()._id;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [mainProduct, setMainProduct] = useState({});
  const [isQtyModalVisible, setIsQtyModalVisible] = useState(false);
  const [MRP, setMRP] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [qtyToShop, setQtyToShop] = useState('');

  const getCartProducts = async () => {
    setLoading(true);
    await axios.get(`/api/cart/get`, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setProducts(res.data.products);
        setMRP(res.data.products.reduce((a, b) => a + b.qty * b.price.toString(), 0));
        setTotalPrice(res.data.products.reduce((a, b) => a + b.qty * b.price.toString(), 0));
      }
      else if (res.status === 201) {
        setProducts([]);
      } else {
        swal('error', res.data.errorMessage, 'error');
      }
    })


  }

  const getCartProductsFromLocalStorage = async () => {
    setLoading(true);
    const getDATA = localStorage.getItem("product") ? JSON.parse(localStorage.getItem('product')) : [];
    const unique = await Array.from(getDATA.reduce((map, obj) => map.set(obj._id, obj), new Map()).values());
    setProducts(unique);
    setLoading(false);

  }



  const getLocalProductById = (cartId) => {
    console.log(cartId)
    const allProd = JSON.parse(localStorage.getItem('product'));
    const newArray = allProd.filter(item => item._id !== cartId);
    const newProduct = allProd.filter(item => item._id === cartId);
    setProduct(newProduct[0]);
  }

  const getProductById = async (prId) => {
    setLoading(true);
    axios.get(`/api/cart/get-product`, { params: { userId: userId, productId: prId } }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setProduct(res.data && res.data[0]);
        getMainProductById(prId);
      } else {
        Error(res.data.errorMessage);
      }
    });

  }

  const getMainProductById = async (prId) => {
    setLoading(true);
    axios.get(`/api/products/get/${prId}`).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setMainProduct(res.data);
      } else {
        Error(res.data.errorMessage);
      }
    });

  }

  useEffect(() => {
    if (isAuthenticated()) {
      getCartProducts();
    }
    else {
      getCartProductsFromLocalStorage();
    }

    return () => {

    }
  }, []);


  const showQtyModal = () => {
    setIsQtyModalVisible(true);
  };

  const handleQtyOk = () => {
    setIsQtyModalVisible(false);
  };

  const handleQtyCancel = () => {
    setIsQtyModalVisible(false);
  };

  const dispatch = useDispatch();

  const removeById = async (cartId) => {
    const allProd = localStorage.getItem("product") && JSON.parse(localStorage.getItem('product'));
    const newArray = allProd.filter(item => item._id !== cartId);
    await localStorage.setItem('product', JSON.stringify(newArray));
    swal("Great!", 'Product removed from Bag', 'success');
    await getCartProductsFromLocalStorage();

  }

  const removeHandler = async (cartId) => {
    await axios.delete(`/api/cart/delete/${cartId}`, {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        Success(res.data.successMessage)
        dispatch(listProducts(userId));
        getCartProducts();
      } else {
        Error(res.data.errorMessage)
      }
    })

  }


  const saveQtyToLocalStorage = async (cartId) => {
    if (qtyToShop > mainProduct.qty - 1) {
      Error('Product out of stock!')
    } else {
      product.qty = qtyToShop;
      const allProd = localStorage.getItem("product") && JSON.parse(localStorage.getItem('product'));
      const newArray = allProd.filter(item => item._id !== cartId);
      await newArray.push(product);
      localStorage.setItem('product', JSON.stringify(newArray));
      getCartProductsFromLocalStorage();
    }
  }


  const saveQtyToDb = async (productId) => {
    if (qtyToShop > mainProduct.qty - 1) {
      Error('Product out of stock!')
    } else {
      await axios.put(`/api/cart/update/qty/${productId}`, { qty: qtyToShop }, {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(res => {
        if (res.status === 200) {
          Success(res.data.successMessage);
          setIsQtyModalVisible(false);
          getCartProducts();
        } else {
          Error(res.data.errorMessage);
        }
      })
    }
  }


  const moveToAddress = () => {
    if (isAuthenticated().role === 0) {
      localStorage.setItem('MRP', MRP);
      localStorage.setItem('totalPrice', totalPrice);
      localStorage.setItem('totalProducts', products.length);
      props.history.push('/checkout/address');
    } else {
      Error("Only retailers can purchase products")
    }

  }

  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
  return (
    <UserLayout navbar>
      <div className='cart'>
        <div>
          <Helmet>
            <title>Virtual Shalmi | Bag</title>
          </Helmet>
          {
            loading
              ?
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin indicator={antIcon} />
              </div>

              :

              <div className='inner'>
                {
                  products.length === 0 ?
                    <UserLayout navbar>

                      <div className='' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div>
                          <div className='text-muted text-center'>
                            <h4 className='mb-1' style={{ color: '#424553', fontSize: '20px' }}>Hey It feels so light!</h4>
                            <p>There is nothing in your bag. Let's add some items.</p>
                          </div>
                          <a href='/' className='btn w-100' style={{ border: '1px solid #2a3e53', color: '#2a3e53', fontWeight: '682', fontSize: '14px', borderRadius: '2px', textTransform: 'uppercase', padding: '10px' }}>Add</a>
                        </div>
                      </div>
                    </UserLayout>

                    :

                    <>
                      <div className='row'>
                        <div className='col-md-8 pr-4'>
                          <div style={{ background: '#e5f6f2' }}>
                            <h6 className='py-2 pl-2'>You have got {products.length} Item(s) for Rs.{products.reduce((a, b) => a + b.qty * b.price.toString(), 0)}</h6>
                            {
                              products.map(prod => {
                                return (
                                  <div className='row border mb-4' style={{ padding: '10px', background: 'white', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
                                    <div className='col-md-3'>
                                      <img src={isAuthenticated() ? prod.image : prod.pic} className='pl-2' alt={prod.title} width='121' height='121' />
                                    </div>
                                    <div className='col-md-4 ml-4'>
                                      <div>
                                        <h4>{prod.title}</h4>
                                        <p>{prod.subTitle}</p>
                                        {/* <p className='text-muted mt-0 pt-0'>Sold By: Saeed Ahmed</p> */}
                                        <a onClick={() => { isAuthenticated() ? getProductById(prod.productId) : getLocalProductById(prod._id); showQtyModal() }}>
                                          <span className='font-weight-bold'>
                                            {
                                              prod.sellBy === 'quantity' ?
                                                <span>Qty: {prod.qty}</span>
                                                :
                                                <span>Weight: {prod.qty}kg</span>}
                                            <CaretDownOutlined />
                                          </span>
                                        </a>

                                      </div>
                                    </div>
                                    <div className='col-md-4'>Rs. <span className='fw-bold'>{prod.price * prod.qty}</span></div>
                                    <div className=''>
                                      <button className='border border-bottom w-100 mt-2' style={{ border: 'none', background: 'white', height: '40px', fontWeight: 'bolder', color: '#696b79' }} onClick={() => { isAuthenticated() ? removeHandler(prod.productId) : removeById(prod._id) }}>Remove</button>
                                    </div>
                                  </div>
                                )
                              })

                            }
                          </div>
                        </div>

                        <Modal title='Select Amount' footer={false} width={380} visible={isQtyModalVisible} onOk={handleQtyOk} onCancel={handleQtyCancel}>
                          <h4>Select Amount</h4>
                          <InputNumber min={1} max={100000} defaultValue={product.qty} value={qtyToShop} onChange={(value) => setQtyToShop(value)} />
                          <div className='text-center mt-2'>
                            <Button onClick={() => { isAuthenticated() ? saveQtyToDb(product.productId) : saveQtyToLocalStorage(product._id) }}>Save</Button>
                          </div>
                        </Modal>

                        <div className='col-md-4 mt-4'>
                          <h6>Price Details ({products.length} Items)</h6>
                          <div className='row'>
                            <div className='col-md-4'>
                              <h6> Total Amount </h6>
                            </div>
                            <div className='col-md-6' style={{ paddingLeft: '130px' }}>
                              <h6>Rs. {products.reduce((a, b) => a + b.qty * b.price.toString(), 0)}</h6>
                            </div>
                            <div className='col-md-12 my-4'>
                              <Link onClick={() => isAuthenticated() ? totalPrice > 0 ? moveToAddress() : swal('error', 'Please add Amount of products', 'error') : props.history.push('/retailer/login')} className='btn my-2 w-100' style={{ background: '#2a3e53', color: 'white' }}>Place Order</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                }
              </div>
          }
        </div>
      </div>
    </UserLayout>
  )
}
