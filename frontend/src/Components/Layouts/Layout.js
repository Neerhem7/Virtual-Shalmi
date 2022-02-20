import React from 'react'
import { AdminSideBar } from '../Admin/adminSideBar'
import { isAuthenticated } from '../Auth/auth';

export const Layout = (props) => {
  const user = isAuthenticated();
  return (
    <div className='sidebar'>
      {
        props.sidebar ?
          <div className='row layouts'>
            <div className='col-md-2'>
              <AdminSideBar />
            </div>
            <div className='col-md-10 bg-light'>
              <div className='admin-layout'>
                <div className='bg-white border-bottom p-4 pb-2' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><h5>Dashboard </h5></div>
                  <div><img src={user.userPicture && user.userPicture.url} className='rounded-circle' width='43' height='43' /></div>
                </div>
              </div>
              <div className='px-5'>
                {props.children}
              </div>
            </div>

          </div>
          :
          props.children
      }

    </div>
  )
}
