import React, { useState, useEffect } from 'react';
import '../Payment/styles.css';
import './style.css';
import GreenTick from './img/tick-anim.svg';
import RedTick from './img/forbidden.svg';
import NoPayment from './img/no-payment.png';
import { PaymentStatusMessage, PaymentStatusImage } from "../../utils/Constants/PaymentStatus";
import { makeSecureRequest, getUserData } from "../../utils";
import Loader from "../UI/Loader";

const QRCode = ({ link, isStatus, statusData, amount}) => {
    const [isTick, setTick] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isLinkSending, setIsLinkSeding] = useState(false);
    const [isLinkSent, setIsLinkSent] = useState('');

    useEffect( () => {
        setTimeout(()=> {
            isStatus && setTick(true);
        }, 1200)
    }, [isStatus])
    const redirect = () => {
        console.log(link)
        window.open(link, '_blank');
    }
    const sendMessage = async () => {
        try {
            setIsLinkSeding(true);
            const data = {
                phoneNumber: phone,
                lucieUrl: link,
                merchant: getUserData().name,
                customer: '',
                amount
            }
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/send_lucie_link`, data, 'POST');
            setIsLinkSeding(false);
            setIsLinkSent('success');
        } catch (e){
            console.log('error ');
            setIsLinkSeding(false);
            setIsLinkSent('failed');
        }
    }
    return (
        <div className="payment-module zero-padding-left zero-padding-right">
            {!isStatus ?
                <div>
                    <div className="qrcode-heading">
                        <h3>Scan QR Code or click Pay button to start payment process.</h3>
                    </div>
                    <div className="qrcode-innerbox">
                        <div id='svgCon' style={{ width: '12rem', margin: '52px auto 3rem'}}>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center' }}>
                            <button onClick={() => redirect()} className="pay-btn" style={{marginTop: '0'}}>
                                <span>Pay with <strong style={{fontSize: '25px'}}>Lucie.</strong></span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="qrcode-innerbox">
                            <br />
                            <div className="phone-field">
                                <p><label>Phone#</label></p>
                                <p>
                                    <input
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        type="text"
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </p>
                                <p style={{color: 'red'}}>{phoneError ? phoneError: ''}</p>
                            </div>
                            <br />
                            <div style={{display: 'flex', justifyContent: 'center' }}>
                                <button className="pay-btn" onClick={sendMessage}>
                                    {isLinkSending ? <Loader size="2rem" color="secondary"/> : 'Send LuciePay Link'}
                                </button>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center' }}>
                                { isLinkSent === 'success' && <p style={{color: 'green', margin: '1rem 0'}}>Payment link successfully sent through sms.</p>}
                                { isLinkSent === 'failed' && <p style={{color: '#5956e8', margin: '1rem 0', width: 'calc(25vw + 150px)'}}>Message service is currently down.
                                    Please scan Qr Code or click "Pay with Lucie." button to continue.</p>}
                            </div>
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
