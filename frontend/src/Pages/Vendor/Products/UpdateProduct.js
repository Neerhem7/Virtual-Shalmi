import React from 'react'
import { UpdateProductForm } from '../../../Components/Admin/Forms/UpdateProductForm';
import './product.css'
import { VendorLayout } from '../../../Components/Layouts/VendorLayout';

export const VendorUpdateProduct = (props) => {
  const productId = props.match.params.id;

  return (
    <VendorLayout sidebar>
      <div className='d-flex justify-content-center align-items-center' style={{ marginTop: '10px' }}>
        <UpdateProductForm  productId = {productId}/>
      </div>
    </VendorLayout>
  )
}
