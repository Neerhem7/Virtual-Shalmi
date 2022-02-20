import { Button, message } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'
import { logout } from '../../../Components/Auth/auth';
import { UserLayout } from '../../../Components/Layouts/UserLayout';
import { Error, Success } from '../../../Components/Messages/messages';

export const ConfirmEmail = (props) => {
  const [loading, setLoading] = useState(false);
  const handleVerification = async () => {
    setLoading(true)
    await axios.post('/api/users/confirm/email', { token: props.match.params.token }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        Success(res.data.successMessage);
        setTimeout(() => {
          logout(() => { });
          props.history.push('/retailer/login');
          window.location.reload();
        }, 2000);
      }
      else {
        Error(res.data.errorMessage)
      }
    })
  }
  return (
    <UserLayout navbar>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh' }}>
        <h6>
          Kindly click on the button to confirm your email
          <br />
          <div className='text-center'>
            <Button type='primary' loading={loading} style={{ marginTop: '23px' }} onClick={handleVerification}>Verify Now</Button>
          </div>
        </h6>
      </div>
    </UserLayout>
  )
}
