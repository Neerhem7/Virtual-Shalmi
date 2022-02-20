import { Rate } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { VendorLayout } from '../../../Components/Layouts/VendorLayout'

export const VendorReviews = () => {
    const [reviews, setReviews] = useState([]);

    const getComments = async () => {
        await axios.get(`/api/comments/get/vender/${isAuthenticated()._id}`).then(res => {
            if (res.status === 200) {
                setReviews(res.data);
            } else {
                setReviews('');
            }
        })
    }


    useEffect(() => {
        getComments();
        return () => {

        }
    }, [])

    const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];

    return (
        <VendorLayout sidebar>
            <div className='table-container'>
                <div className='table-responsive'>
                    <table className="table table-borderless">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Product</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Comment</th>
                                <th scope="col">By</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reviews.length > 0 && reviews.map((review, index) => {
                                    return (
                                        <>
                                            <tr key={review._id} style={{ borderBottom: '1px solid black' }}>
                                                <th>{index + 1}</th>
                                                <th scope="col">{review.productId && review.productId.title}</th>
                                                <th scope="col"><Rate style={{ fontSize: '10px', minWidth: '100px' }} tooltips={desc} value={review.rating} /></th>
                                                <th scope="col" style={{ wordBreak: 'break-word' }}>{review.text}</th>
                                                <th scope="col">{review.user && review.user.username}</th>
                                                <th>
                                                    <Link to={`/product/${review.productId && review.productId._id}`} className='btn btn-outline-dark'>Reply</Link>
                                                </th>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </VendorLayout>
    )
}
