import React, { useEffect, useState } from 'react';
import { ProfLayout } from '../../Components/Layouts/ProfileLayout';
import { Steps } from 'antd';
import axios from 'axios';
import { CheckCircleOutlined, HddOutlined, PlusSquareOutlined, RocketOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;


export const TrackOrders = (props) => {
    const orderId = props.match.params.id;
    const [order, setOrder] = useState({});

     const getOrderStatus = async() => {
         await axios.get(`/api/users/get/order/${orderId}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
             console.log(res);
             setOrder(res.data);
             console.log(res.data)
         })

     }
     useEffect(() => {
      getOrderStatus(); 
         
         return () => {
             
         }
     }, [orderId]);


    return (
        <ProfLayout sidebar>
        <div className = 'tracking mx-5'>
        <div style = {{position: 'absolute', right: '100px', top: '300px'}}>
               <h6>
                   Placed At: {order.placed}
               </h6>
                <h6>
                   Last Updated : {order.statusUpdateTime}
                </h6>
            </div>
             <h5 className = 'mb-4 mt-4'>Track Delivery Status</h5>
             <Steps direction="vertical" current = {order.status} size = 'large'>
                <Step title="Order Placed" className = 'pb-4' icon = {<PlusSquareOutlined />}/>
                <Step title="Order Confirmed" className = 'pb-4' icon = {<CheckCircleOutlined />}/>
                <Step title="Preparation" className = 'pb-4' icon = {<HddOutlined />}/>
                <Step title="Out For Delivery" className = 'pb-4' icon = {<RocketOutlined/>}/>
                <Step title="Complete" className = 'pb-4' icon = {<SmileOutlined />}/>
            </Steps>
          
            
        </div>
        </ProfLayout>
    )
}
