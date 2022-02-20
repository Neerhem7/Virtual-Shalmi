import React, { useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { UserLayout } from '../../Components/Layouts/UserLayout';
import './Home.css'
import { Carousel } from 'antd';
import { Error } from '../../Components/Messages/messages';
import { ProductCard } from '../../Components/Products/ProductCard';
import { ProductsByCategory } from '../../Components/Home/ProductsByCategory';
import { RightOutlined } from '@ant-design/icons';
import { SaleProductCard } from '../../Components/Products/SaleProductCard';
import moment from 'moment';

export const Home = () => {
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchNewArrivals = async () => {
        await axios.get('/api/products/get/new-arrivals').then(res => {
            if (res.status === 200) {
                setNewArrivals(res.data);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    const getAllMainCategories = async () => {
        await axios.get('/api/categories/main/get').then(res => {
            if (res.status === 200) {
                setMainCategories(res.data);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }
    const getAllCategories = async () => {
        await axios.get(`/api/categories/get`).then(res => {
            if (res.status === 200) {
                setCategories(res.data);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }


    const getAllProducts = async () => {
        await axios.get(`/api/products/get`).then(res => {
            if (res.status === 200) {
                setProducts(res.data);
                const filter = res.data.filter(product => moment.duration(moment(product.saleStartDate).diff(moment())).asMinutes() < 0 &&  moment.duration(moment(product.saleEndDate).diff(moment())).asMinutes() > 0);
                setSaleProducts(filter);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        fetchNewArrivals();
        getAllMainCategories();
        getAllCategories();
        getAllProducts();
        return () => {

        }
    }, []);


    return (
        <UserLayout navbar>
            <Helmet>
                <title>Virtual Shalmi</title>
            </Helmet>
            <div className='homepage'>
                <div className='row'>
                    <div className='col-md-2 pl-2 mt-4'>
                        <div>
                            <div className='mb-2 pl-1'>
                                <Link to='/all-products' className='btn'>All Categories</Link>
                            </div>

                            {
                                categories.length > 0 && categories.map(category => {
                                    return (
                                        <div id="menuContainer">
                                            <div className="menuItem first d-flex justify-content-between px-3 pr-">
                                                <div className="text">{category.name}</div>
                                                <RightOutlined className='text-dark' />
                                            </div>
                                            <div id="settingsMenu" className=''>
                                                {
                                                    category.children && category.children.length > 0 && category.children.map(sub => {
                                                        return (
                                                            <button className="menuItem btn mx-2">
                                                                <button className='btn' onClick={() => {
                                                                    history.push({
                                                                        pathname: '/all-products',
                                                                        search: category._id,
                                                                        state: {
                                                                            update: false,
                                                                        },
                                                                    });
                                                                    window.location.reload()
                                                                }}>{sub.name}</button>
                                                            </button>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='col-md-10'>
                        <header className='d-block'>
                            <Carousel autoplaySpeed={2000} autoplay>
                                <div>
                                    <img alt='img' src='/assets/slide4.jpg' />
                                </div>
                                <div>
                                    <img alt='img' src='/assets/slide8.jpg' />
                                </div>
                                <div>
                                    <img alt='img' src='/assets/slide7.jpg' />
                                </div>

                            </Carousel>
                        </header>
                    </div>
                </div>
                <div className='sections' style={{ marginTop: '100px' }}>
                    <h4 className='title'>New Arrivals </h4>
                    <div className='row mx-4'>
                        {
                            newArrivals && newArrivals.map(product => {
                                return (
                                    <div className='col-md-3 mt-4'>
                                        <ProductCard product={product} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='sections' style={{ marginTop: '100px' }}>
                    <h4 className='title'>On Sale </h4>
                    <div className='row mx-4'>
                        {
                            saleProducts && saleProducts.slice(0, 4).map((product, index) => {
                                console.log(product, index);

                                return (
                                    <div className='col-md-3 mt-4'>
                                        <SaleProductCard product={product} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='mx-4 mt-0 pt-0'>
                    {
                        mainCategories.map(data => {
                            return (
                                <div className='sections'>
                                    <a className='title' onClick={() => {
                                        history.push({
                                            pathname: '/all-products',
                                            search: data._id,
                                            state: {
                                                update: false,
                                            },
                                        });
                                        window.location.reload()
                                    }}>{data.name}</a>
                                    <ProductsByCategory category={data} />
                                </div>
                            )
                        })


                    }
                </div>
            </div>
        </UserLayout >
    )
}