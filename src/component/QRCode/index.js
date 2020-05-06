import React, { useState, useEffect } from 'react';
import '../Payment/styles.css';
import './style.css';
import axios from 'axios';
// import Tick from "../QuoteDetails/img/tick-anim.svg";
import GreenTick from './img/tick-anim.svg';
import RedTick from './img/forbidden.svg';

const QRCode = ({paymentId, link, isStatus, statusData}) => {

    const [payment, setPayment] = useState();
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [isTick, setTick] = useState(false);

    // const listener = async (event) => {
    //     if(event.data.status=="CLOSED") {
    //         console.log('pop closed', event.data)
    //         var url = "/api/getPaymentStatus";
    //         const paymentStatus = await axios.post(process.env.REACT_APP_NUAPAY_API + url, {id: event.data.paymentId});
    //         console.log('payment status ::', paymentStatus.data.data);
    //         setPayment(paymentStatus.data.data);
    //         setPaymentStatus(true);
    //     }
    // }

    useEffect( () => {
        // window.addEventListener("message",listener,false);
        setTimeout(()=> {
           isStatus && setTick(true);
        }, 1200)
    }, [isStatus])
    const redirect = () => {
        console.log(link)
        window.open(link, '_blank');
    }
    return (
        <div className="payment-module">
            {/*{*/}
            {/*    paymentStatus ?*/}
            {/*        <div style={{display: 'flex', justifyContent: 'center'}}>*/}
            {/*            <div>*/}
            {/*                <p>Payment Status</p>*/}
            {/*                <p> {payment && payment.status}</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        :*/}
            {/*        <div style={{display: 'flex', justifyContent: 'center'}}>*/}
            {/*            {*/}
            {/*                <a className="btn pay-btn"*/}
            {/*                   href="#"*/}
            {/*                   onClick={ () => window.NuapayOpenBanking.showUI(paymentId, 'https://sandbox.nuapay.com/tpp-ui/')}*/}
            {/*                >*/}
            {/*                    Pay Now*/}
            {/*                </a>*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*}*/}
            {!isStatus ?
                <div>
                    <div id='svgCon' style={{    width: '12rem', margin: '3rem auto'}}>
                    </div>
                    <br/>
                    <div style={{display: 'flex', justifyContent: 'center' }}>
                        {
                            <button onClick={() => redirect()} className="pay-btn">
                                Pay
                            </button>
                        }
                    </div>
                </div>
                :
                <div>
                    <h2>Payment Status</h2>
                    <br/>
                    <br/>
                    <div>
                        {/*// <table>*/}
                        {/*//     <tr>*/}
                        {/*        <td>Status: </td>*/}
                        {/*        <td>{statusData.status}</td>*/}
                        {/*    </tr>*/}
                        {/*    <tr>*/}
                        {/*        <td>Payment Id: </td>*/}
                        {/*        <td>{statusData.id}</td>*/}
                        {/*    </tr>*/}
                        {/*    <tr>*/}
                        {/*        <td>Amount: </td>*/}
                        {/*        <td>{statusData.amount}</td>*/}
                        {/*    </tr>*/}
                        {/*    <tr>*/}
                        {/*        <td>Currency: </td>*/}
                        {/*        <td>{statusData.currency}</td>*/}
                        {/*    </tr>*/}
                        {/*</table>*/}
                        <p>
                            {
                                statusData.status === 'SETTLEMENT_IN_PROGRESS' && <p>Payment of {statusData.amount} {' '} {statusData.currency} is in Progress.</p>
                            }
                            {
                                statusData.status === 'SETTLEMENT_COMPLETE' && <p>Payment of {statusData.amount} {' '} {statusData.currency} has been successfully completed.</p>
                            }
                            {
                                statusData.status === 'SETTLEMENT_REJECTED' && <p>Payment of {statusData.amount} {' '} {statusData.currency} has been failed.</p>
                            }
                        </p>
                    </div>
                    <div>
                        <br/>
                        <div className="payment">
                            {
                             isTick &&
                             <img
                                 src={statusData.status === 'SETTLEMENT_IN_PROGRESS' || statusData.status === 'SETTLEMENT_COMPLETE' ? GreenTick : RedTick}
                                 className="complete-tick"
                                 alt="tick"/>
                            }
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}

export default QRCode;
