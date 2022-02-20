import axios from 'axios';
import React, { useState } from 'react'
import { Drawer, Col, Row } from 'antd';
import { EyeOutlined } from '@ant-design/icons';


export const UserDrawer = ({user}) => {
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
      };
    
      const onClose = () => {
        setVisible(false);
      };
    

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ marginBottom: '0px', fontWeight: 'bolder', marginTop: '19px' }}>{title}:</p>
            {content}
        </div>
    );
    return (
        <>
         <EyeOutlined onClick = {() => showDrawer()} />
            <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
            >
                <p className="site-description-item-profile-p" style={{ marginTop: '80px', fontWeight: 'bold' }}>
                    User Profile
                </p>
                <Row>
                    <Col span={12} className='text-center'>
                        <img width='200' src={user.userPicture.url} alt={user.firstName} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Full Name" content={<span>{user.firstName}  {user.lastName}</span>} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="E-mail" content={user.email} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Username" content={user.username} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Phone" content={user.phone} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="City" content={user.city} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Country" content={user.country} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="postalCode" content={user.postalCode} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Role" content={user.role} />
                    </Col>
                </Row>
            </Drawer>
        </>
    )
}
