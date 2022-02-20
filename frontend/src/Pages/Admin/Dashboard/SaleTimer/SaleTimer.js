import React, { useState } from 'react';
import { Modal, DatePicker } from 'antd';
import axios from 'axios';
import { Success } from '../../../../Components/Messages/messages';

export const SaleTimer = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [saleStartDate, setSaleStartDate] = useState('');
    const [saleEndDate, setSaleEndDate] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        await axios.post('/api/users/sale-timer', { saleStartDate, saleEndDate }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    return (
        <div className='sale-timer'>
            <button className='btn' onClick={showModal}>
                Add Sale
            </button>
            <Modal footer={false} title="Sale Timer" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <DatePicker showTime onChange={(value, t) => setSaleStartDate(value, t)} format={'DD/MM/YYYY HH:mm'} className='w-100' placeholder='Sale Start Date(Optional)' />
                    </div>
                    <div className="form-group mt-4">
                        <DatePicker showTime onChange={(value, t) => setSaleEndDate(value, t)} format={'DD/MM/YYYY HH:mm'} className='w-100' placeholder='Sale End Date(Optional)' />
                    </div>
                    <div className='text-center mt-4'>
                        <button type='submit' className='btn w-100' style={{ background: '#364c64', color: '#FFFFFF' }}>Submit</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};