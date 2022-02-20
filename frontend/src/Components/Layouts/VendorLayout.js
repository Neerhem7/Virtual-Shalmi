import React from 'react'
import { VendorSideBar } from '../Vendor/VendorSideBar';
import { isAuthenticated } from '../Auth/auth';

export const VendorLayout = (props) => {
  const user = isAuthenticated();
  return (
    <div>
      {
        props.sidebar ?
          <div className='row layouts'>
            <div className='col-lg-2'>
              <VendorSideBar />
            </div>

            <div className='col-lg-10 bg-light'>
              <div className='admin-layout'>
                <div className='bg-white border-bottom p-4 pb-2' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><h5>Dashboard </h5></div>
                  <div><img src={user.userPicture && user.userPicture.url} className='rounded-circle' width='43' height='43' /></div>
                </div>
              </div>
              <div className='px-5 mt-4'>
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
