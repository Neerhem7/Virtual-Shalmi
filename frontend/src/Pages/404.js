import { Button, Result } from 'antd'
import React from 'react'

export const DefaultComp = (props) => {
    return (
        <div className = 'text-center'>
         <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button onClick = {() => props.history.push('/')} type="primary">Back Home</Button>}
        />
            
            
                   
         </div>
    )
}
