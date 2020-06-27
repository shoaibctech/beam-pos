import React, { useState, useEffect } from 'react';
import '../Payment/styles.css';
import './style.css';
import GreenTick from './img/tick-anim.svg';
import RedTick from './img/forbidden.svg';

const QRCode = ({ link, isStatus, statusData}) => {
    const [isTick, setTick] = useState(false);

    console.log('status data ::', statusData)
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
        <div className="payment-module">
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
                        <div>
                            {
                                statusData.status === 'SETTLEMENT_IN_PROGRESS' && <p>Payment of {statusData.amount} {' '} {statusData.currency} is in Progress.</p>
                            }
                            {
                                statusData.status === 'SETTLEMENT_COMPLETE' && <p>Payment of {statusData.amount} {' '} {statusData.currency} has been successfully completed.</p>
                            }
                            {
                                statusData.status === 'SETTLEMENT_REJECTED' && <p>Payment of {statusData.amount} {' '} {statusData.currency} has been failed.</p>
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
