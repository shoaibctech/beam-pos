import React, { useState } from 'react';
import '../Payment/styles.css';
import axios from 'axios';

const QRCode = ({paymentId}) => {

    const [payment, setPayment] = useState();
    const [paymentStatus, setPaymentStatus] = useState(false);

    const listener = async (event) => {
        if(event.data.status=="CLOSED") {
            console.log('pop closed', event.data)
            var url = "/api/getPaymentStatus";
            const paymentStatus = await axios.post(process.env.REACT_APP_NUAPAY_API + url, {id: event.data.paymentId});
            console.log('payment status ::', paymentStatus.data.data);
            setPayment(paymentStatus.data.data);
            setPaymentStatus(true);
        }
    }

    window.addEventListener("message",listener,false);

    console.log('ddddddddddddddd', payment)
    console.log('ddddddddddddddd', payment && payment.status)
    console.log('ddddddddddddddd', paymentStatus)
    return (
        <div className="payment-module">
            {
                paymentStatus ?
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div>
                            <p>Payment Status</p>
                            <p> {payment && payment.status}</p>
                        </div>
                    </div>
                    :
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        {
                            <a className="btn pay-btn"
                               href="#"
                               onClick={ () => window.NuapayOpenBanking.showUI(paymentId, 'https://sandbox.nuapay.com/tpp-ui/')}
                            >
                                Pay Now
                            </a>
                        }
                    </div>
            }
        </div>
    );
}

export default QRCode;
