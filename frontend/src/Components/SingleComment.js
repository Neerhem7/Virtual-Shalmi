import { Button, Comment, Rate } from 'antd';
import React, { useState } from 'react'
import { Tooltip, Avatar, Form } from 'antd';
import moment from 'moment';
import axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { isAuthenticated } from './Auth/auth';

export const SingleComment = (props) => {
    const productId = props.productId;
    const comment = props.comment;
    const user = isAuthenticated();
    const [openReply, setOpenReply] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [form] = Form.useForm();
    const [success, setSuccess] = useState(false);

    const handleSingleCommentChange = (e) => {
        setCommentValue(e.target.value);
    }

    const handleSingleCommentSubmit = async () => {
        isAuthenticated() ?
        await axios.post(`/api/comments/post`, { productId, commentValue, responseTo: comment._id, timeOfSubmit: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), vendorId: props.vendorId }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setSuccess(true);
                setCommentValue("");
                setOpenReply(!openReply);
                props.refreshFunction(res.data.result);
                setSuccess(false);
            } else {
                console.log('comments post error');
            }

        })

        :
          swal('Sorry!','You must be logged in to leave a comment', 'error');

    }

    const commentDeleteHanlder = async () => {
        await axios.post('/api/comments/delete', { productId, commentId: comment._id }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                props.updateIt();
            } else {
                swal('error', 'Error in deleting comment', 'error');
            }
        })

    }
    const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];

    return (
        <div className='single-comments'>
            <div>
                <>
                    <Comment style={{ borderTop: '1px solid #eaeaec' }}
                        actions={
                            [
                                <div>
                                    <span> <Link style={{ fontSize: '12px' }} onClick={() => setOpenReply(!openReply)}>Reply</Link> </span>
                                </div>
                            ]
                        }
                        author={<h6>{comment.user.username}</h6>}
                        avatar={
                            <Avatar
                                src={comment.user.userPicture}
                                alt={comment.user.username}
                            />
                        }
                        content={
                            <p>
                                {comment.text}
                            </p>
                        }
                        datetime={
                            <span>
                                {moment(comment.timeOfSubmit, "dddd, MMMM Do YYYY, h:mm:ss a").fromNow()}
                                <span className='ml-5'>
                                    {
                                        !comment.responseTo &&
                                        <Rate style={{ fontSize: '10px' }} tooltips={desc} value={comment.rating} />
                                    }
                                    {
                                        comment.rating ? <span className="ant-rate-text pl-2">{desc[comment.rating - 1]}</span> : ''
                                    }
                                    <span>
                                        {
                                            comment.user._id === user._id && <span style={{ paddingLeft: '100%', fontSize: '15px' }}>
                                                <Link onClick={() => commentDeleteHanlder()}><Tooltip title="Delete"><DeleteOutlined /></Tooltip></Link></span>}
                                    </span>
                                </span>
                            </span>
                        }
                    />

                    {
                        openReply &&

                        <Comment
                            avatar={
                                <Avatar
                                    src={user.userPicture && user.userPicture.url}
                                    alt={user.username}
                                />
                            }
                            content={
                                <>
                                    <Form
                                        form={form}
                                        name="Comment"
                                        onFinish={handleSingleCommentSubmit}
                                    >
                                        <Form.Item onChange={handleSingleCommentChange}>
                                            <TextArea rows={2} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button htmlType="submit">
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </>
                            }
                        />
                    }

                </>



            </div>

        </div>
    )
}
