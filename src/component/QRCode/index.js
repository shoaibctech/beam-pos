import React, { useState, useEffect } from 'react';
import '../Payment/styles.css';
import './style.css';
import GreenTick from './img/tick-anim.svg';
import RedTick from './img/forbidden.svg';
import NoPayment from './img/no-payment.png';
import { PaymentStatusMessage, PaymentStatusImage } from "../../utils/Constants/PaymentStatus";

const QRCode = ({ link, isStatus, statusData}) => {
    const [isTick, setTick] = useState(false);

    useEffect( () => {
        setTimeout(()=> {
           isStatus && setTick(true);
        }, 1200)
    }, [isStatus])
    const redirect = () => {
        console.log(link)
        window.open(link, '_blank');
    }
    return (
        <div className="payment-module zero-padding-left zero-padding-right">
            {!isStatus ?
                <div>
                    <div className="qrcode-heading">
                        <h3>Scan QR Code or click Pay button to start payment process.</h3>
                    </div>
                   <div className="qrcode-innerbox">
                       <div id='svgCon' style={{    width: '12rem', margin: '52px auto 3rem'}}>
                       </div>
                       <div style={{display: 'flex', justifyContent: 'center' }}>
                           {
                               <button onClick={() => redirect()} className="pay-btn" style={{marginTop: '0'}}>
                                   <span>Pay with <strong style={{fontSize: '25px'}}>Lucie.</strong></span>
                               </button>
                           }
                       </div>
                   </div>
                </div>
                :
                <div>
                    <div className="qrcode-heading">
                        <h2>Payment Status</h2>
                    </div>
                    <br/>
                    <br/>
                    <div>
                        <div>
                            {

                                <p className="text-center" style={{padding: '1rem'}}>
                                    Payment of <strong>{statusData.amount.toFixed(2)} {' '} {statusData.currency} {' '}</strong> {PaymentStatusMessage[statusData.status]}
                                </p>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="payment">
                            {
                             isTick &&
                             <img
                                 src={PaymentStatusImage[statusData.status] ? GreenTick : NoPayment}
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
