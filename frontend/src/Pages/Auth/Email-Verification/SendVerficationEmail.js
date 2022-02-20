import { Button } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { isAuthenticated } from '../../../Components/Auth/auth';
import { UserLayout } from '../../../Components/Layouts/UserLayout';
import { Error, Success } from '../../../Components/Messages/messages';

export const SendVerficationEmail = () => {
  const [loading, setLoading] = useState(false);
  const handleVerification = async () => {
    setLoading(true)
    await axios.post('/api/users/send/confirm-mail', { email: isAuthenticated().email }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        Success(res.data.successMessage)
      }
      else {
        Error(res.data.errorMessage);
      }
    })
  }
  return (
    <UserLayout navbar>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: '20vh' }}>
        <h6>
          Kindly Verify your email to use Website
          <br />
          <div className='text-center'>
            <Button type='primary' loading={loading} style={{ marginTop: '23px' }} onClick={handleVerification}>Send E-mail</Button>
          </div>
        </h6>
      </div>
    </UserLayout>
  )
}
