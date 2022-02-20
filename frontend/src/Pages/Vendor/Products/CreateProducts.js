import React from 'react'
import 'react-quill/dist/quill.snow.css';
import { CreateProductForm } from '../../../Components/Admin/Forms/CreateProductForm';
import { VendorLayout } from '../../../Components/Layouts/VendorLayout';
import './product.css'

export const VendorCreateProducts = () => {

  return (
    <VendorLayout sidebar>
      <div className='d-flex justify-content-center align-items-center' style={{ marginTop: '10px' }}>
        <CreateProductForm />
      </div>
    </VendorLayout>
  )
}
