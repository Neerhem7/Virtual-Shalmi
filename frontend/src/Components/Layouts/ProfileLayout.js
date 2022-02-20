import React, { useEffect, useState } from 'react'
import { Navbar } from '../Navbar';
import { ProfileSideBar } from '../Profile/ProfileSideBar';
import axios from 'axios';
import { isAuthenticated } from '../Auth/auth';

export const ProfLayout = (props) => {

  const [user, setUser] = useState({});

  const getUser = async() => {
    await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
        setUser(res.data);
      
      })
  }

  useEffect(() => {
      getUser();
      return () => {
          
      }
  }, []);
    return (
        <div>
           {
               props.sidebar ? 
               <>
                <div>
                    <Navbar/>
                </div>
                <div style = {{ marginLeft: '180px' }}> 
                <b className = 'mb-0 pb-0'>Account</b>
                <p className = 'mb-3'>{user.firstName} {user.lastName}</p>
                </div> 
               <div className = 'row' style = {{borderTop: '1px solid #d4d5d9', marginLeft: '180px', marginRight: '200px'}}>
              <div className = 'col-md-3'>
                <ProfileSideBar/>
              </div>
              <div className = 'col-md-9'>
                {props.children}
              </div>
              </div>
              </>
            :
            props.children
           }
            
        </div>
    )
}
