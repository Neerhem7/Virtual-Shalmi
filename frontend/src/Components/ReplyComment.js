import React from 'react'
import  {SingleComment}  from './SingleComment'

export const ReplyComment = (props) => {

    return (
        <>
          { 
           props.CommentList && props.CommentList.map(com => {
               
            return(
                <>
                {com && com.responseTo === props.ParentCommentId &&
                <div style = {{marginLeft: '41px'}}>
                <SingleComment comment = {com} vendorId = {props.vendorId} productId = {props.productId} updateIt = {props.updateIt} refreshFunction = {props.refreshFunction}/>
                <ReplyComment CommentList = {props.CommentList} vendorId = {props.vendorId} ParentCommentId = {com._id} updateIt = {props.updateIt} productId = {props.productId} refreshFunction = {props.refreshFunction}/>
                </div>
                }
                </>
            )
        })
    }

     </>

    )
}
