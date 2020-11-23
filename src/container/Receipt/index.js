import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Tick from '../../component/QRCode/img/tick-anim.svg';
import UploadIcon from './img/upload.png';
import FillTick from './img/black-tick.png';
import moment from "moment";

import './styles.css';

const Receipt = () => {
    const [step, setStep] = useState(0);
    const { amount, merchant_name, payer_name, bank_name, trans_date, status } = useParams();

    if (step === 0) {
        return (
            <div className="root">
                <div>
                    <h2 className="text-center receipt-h">Payment Made</h2>
                    <div className="text-center">
                        <img src={Tick} alt="tick" />
                    </div>
                    <div className="receipt-container">
                        <div className="content-block">
                            <p className="mobile-p light-text">Success</p>
                            <p className="mobile-p receipt-msg">Your payment of <strong>£{amount && parseFloat(amount).toFixed(2)}</strong> to <strong>{merchant_name}</strong> has been made.</p>
                        </div>
                        <div className="content-block">
                            <div className="mobile-p view-detail d-link">
                                <img className="upload-icon" src={UploadIcon} alt="upload" />
                                <p className="light-text" onClick={() => setStep(1)}>View detail</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-bottom">
                    <button className="view-btn" onClick={() => setStep(1)} >View Detail</button>
                </div>
            </div>
        );
    } else if (step === 1) {
        return (
            <div className="root">
                <div>
                    <h1 className="text-center receipt-h">Preview</h1>
                </div>
                <div className="receipt-block">
                    <div className="view-detail detail-h">
                        <img src={FillTick} alt="fill tick" className="fill-tick" />
                        <p className="light-text">Payment Sent</p>
                    </div>
                    <div className="receipt-table">
                        <table>
                            {
                                payer_name &&
                                <tr>
                                    <td>From:</td>
                                    <td><span className="d-light-text">{payer_name}</span></td>
                                </tr>
                            }
                            <tr>
                                <td>To:</td>
                                <td><span className="d-light-text">{merchant_name}</span></td>
                            </tr>
                            <tr>
                                <td>Amount:</td>
                                <td><span className="d-light-text">£{amount && parseFloat(amount).toFixed(2)}</span></td>
                            </tr>
                            {/*<tr>*/}
                            {/*    <td>Reference:</td>*/}
                            {/*    <td><span>{refrence}</span></td>*/}
                            {/*</tr>*/}
                            <tr>
                                <td>Bank:</td>
                                <td><span className="d-light-text">{bank_name}</span></td>
                            </tr>
                            <tr>
                                <td>Date:</td>
                                <td><span className="d-light-text">{trans_date && moment(trans_date).format('Do MMM YYYY')}</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="flex-bottom">
                    <button className="view-btn" onClick={() => setStep(0)} >Hide Detail</button>
                </div>
            </div>
        );
    }
}
export default Receipt;