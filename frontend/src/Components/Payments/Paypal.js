import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

export const Paypal = (props) => {
    console.log('akdalaldlaklakd')
    const onSuccess = (payment) => {
        console.log("The payment was succeeded!", payment);
        props.onSuccess(payment);
    }

    const onCancel = (data) => {
        console.log('The payment was cancelled!', data);
    }

    const onError = (err) => {
        console.log("Error!", err);

    }

    let env = 'sandbox';
    let currency = 'USD';
    let total = props.toPay;
    const client = {
        sandbox: 'AUpL1Gs0zYxjvK8DPipH21S7JXrf-E7gTDDhMI16RN9iblvonYEXDESBdY8qV6uUGUbtPXK2btQsrWPT',
        production: 'YOUR-PRODUCTION-APP-ID',
    }

    return (
        <PaypalExpressBtn
            env={env}
            client={client}
            currency={currency}
            total={total}
            shipping={1}
            onError={onError}
            onSuccess={onSuccess}
            onCancel={onCancel}
            style={{
                size: 'large',
                color: 'blue',
                shap: 'rect',
                label: 'checkout'
            }}
        />
    );
}