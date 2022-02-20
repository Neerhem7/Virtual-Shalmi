import { StarFilled } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const GetReviews = ({id}) => {
    const [reviews, setReviews] = useState([]);

    const getComments = async () => {
        await axios.get(`/api/comments/get/vender/${id}`).then(res => {
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
    }, []);
    return (
        <div>
            <p className='fs-6'>
                ({reviews.length})
                {
                    reviews.length > 0 &&
                    <span className=''>
                        ({Math.round(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)}<StarFilled style={{ verticalAlign: 'text-bottom', marginBottom: '2px', color: '#fadb14' }} />)
                    </span>
                }
               &nbsp; reviews
            </p>
        </div>
    )
}
