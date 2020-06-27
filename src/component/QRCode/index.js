import React, { useState, useEffect } from 'react';
import '../Payment/styles.css';
import './style.css';
import GreenTick from './img/tick-anim.svg';
import RedTick from './img/forbidden.svg';

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

                                <p className="text-center">
                                    Payment of <strong>{statusData.amount} {' '} {statusData.currency} {' '}</strong>
                                    {statusData.status === 'SETTLEMENT_IN_PROGRESS' &&
                                    'is in Progress.'
                                    }
                                    {
                                        statusData.status === 'SETTLEMENT_COMPLETE' &&
                                            'has been successfully completed.'
                                    }
                                    {
                                        statusData.status === 'SETTLEMENT_REJECTED' &&
                                        'has been failed.'
                                    }
                                </p>
                            }
                        </div>
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
