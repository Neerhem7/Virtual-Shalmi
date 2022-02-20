import { Button, Comment, Rate } from 'antd';
import React, { useEffect, useState } from 'react'
import { Avatar, Form } from 'antd';
import moment from 'moment';
import axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';
import { SingleComment } from './SingleComment';
import { ReplyComment } from './ReplyComment';
import { isAuthenticated } from './Auth/auth';
import { Error } from './Messages/messages';
import swal from 'sweetalert';

export const Comments = (props) => {
    const productId = props.productId;
    const user = isAuthenticated();
    const [commentValue, setCommentValue] = useState('');
    const [form] = Form.useForm();
    const [rating, setRating] = useState(5);


    const handleCommentChange = (e) => {
        setCommentValue(e.target.value);
    }

   

    const handleCommentSubmit = async() => {
        isAuthenticated() ? 
       await axios.post(`/api/comments/post`, {productId, commentValue, timeOfSubmit: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), rating, vendorId: props.vendorId}, {headers : {
           'authorization' : 'Bearer ' + localStorage.getItem('token')
         }}).then(res => {
             if(res.status === 200){
           props.refreshFunction(res.data.result);
           setCommentValue("");
          } else {
              console.log('comments post error');
          }
         
          })
          :
          swal('Sorry!','You must be logged in to leave a comment', 'error');
       
   }

   
   const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];
   const handleRateChange = (value) => {
        setRating(value);

   }


    return (
        <div className = 'single-comments'>
              <div>
                <div className = 'text-center mt-4'>
                    <Rate style = {{fontSize: '28px'}} tooltips={desc} onChange={handleRateChange} value = {rating}/>
                    {rating ? <h4 className="ant-rate-text pl-2">{desc[rating - 1]}</h4> : ''}
                </div>
                
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
                             name="login"
                             onFinish={handleCommentSubmit}
                            >
                            <Form.Item onChange = {handleCommentChange}>
                            <TextArea rows={4} value = {commentValue}/>
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
                    
                </div>
                <div>
                    {
                       props.CommentList && props.CommentList.map(com => {
                            return(
                               com && !com.responseTo &&
                                <>
                                <SingleComment comment = {com} updateIt = {props.updateIt} vendorId = {props.vendorId} productId = {productId} refreshFunction = {props.refreshFunction}/>
                                <ReplyComment CommentList = {props.CommentList} updateIt = {props.updateIt} vendorId = {props.vendorId} ParentCommentId = {com._id} productId = {productId} refreshFunction = {props.refreshFunction}/>
                                </>
                            )
                        })
                    }
                </div>
                <div>

            
                </div>
            
        </div>
    )
}
