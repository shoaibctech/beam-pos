import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PaymentStatusImage } from '../../utils/Constants/PaymentStatus';
import moment from "moment";
import useViewPort from '../../utils/useViewPort/useViewPort';

import './styles.css';
import Logo from './img/Dark.png';

const Receipt = () => {
    const [step, setStep] = useState(0);
    const {amount, merchant_name, payer_name, bank_name, trans_date, status, currency} = useParams();
    const { width } = useViewPort();

    const getNameAcronym = (name) => {
        return name.match(/\b(\w)/g).join('').substr(0, 2);
    }
    return (

        <div className="main_container">
            <div>
                <img className="logo_pos" src={Logo} alt={"Pos icon"}/>
            </div>
            {
                step === 0
                &&
                <div>
                    {
                        PaymentStatusImage[status] ?
                            <React.Fragment>
                                <div className="main_head">
                                    <h2>Your payment is complete.</h2><br/>
                                </div>
                                <div className="p_set">
                                    <h5>{amount && parseFloat(amount).toFixed(2)} {currency} has been sent to <span
                                        style={{color: "limegreen"}}>{merchant_name}.</span></h5>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className="main_head">
                                    <h2>Payment failed.</h2><br/>
                                </div>
                                <div className="p_set">
                                    <h5 className="text-center">
                                        Sorry, we are unable to process your
                                        { width < 768 ? <br/> : ' '}
                                        payment. Please try again.
                                    </h5>
                                </div>
                            </React.Fragment>
                    }
                    {
                        PaymentStatusImage[status] ?
                            <div className="circle">
                                <div className="inner-circle">
                                    <strong>{payer_name ? getNameAcronym(payer_name) : '??'}</strong>
                                    <div className="fill-box">
                                        <div className="tick-sign"></div>
                                    </div>
                                </div>
                                <div className="vertical-line"></div>
                                <div className="small-circle">
                                    <div className="small-inner">
                                        <div className="check-box"></div>
                                    </div>
                                    <div className="down-line"></div>
                                </div>
                                <div className="down-circle">
                                    <div className="down-c">
                                        <strong>{getNameAcronym(merchant_name)}</strong>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="failed-c">
                                <div className="f-inner-c">
                                    <strong>{payer_name ? getNameAcronym(payer_name) : '??'}</strong>
                                    <div className="f-cross">
                                        <span className="cross-small"><i className="fas fa-times"></i></span>
                                    </div>
                                </div>
                                <div className="f-line"></div>
                                <div className="f-small-in">
                                    <div className="f-small-c">
                                        <div className="big-cross"><i className="fas fa-times"></i></div>
                                    </div>
                                    <div className="down-line"></div>
                                </div>
                                <div className="down-circle">
                                    <div className="down-c">
                                        <strong>{getNameAcronym(merchant_name)}</strong>
                                    </div>
                                </div>
                            </div>
                    }
                    <div className="set_btn">
                        <button className="btn_set" onClick={() => setStep(1)}>
                            View Details
                        </button>
                    </div>
                </div>
            }
            {
                step === 1
                &&
                <div>
                    <div>
                        {PaymentStatusImage[status] ?
                            <div className="view-detail detail-h">
                                <span className="fill-tick"><i style={{color: 'limegreen'}}
                                                               className="far fa-check-circle"></i></span>
                                <h2 className="light-text">Payment Sent</h2>
                            </div>
                            :
                            <div className="view-detail detail-h">
                                <span className="fill-tick"><i style={{color: 'red'}}
                                                               className="far fa-times-circle"></i></span>
                                <h2 className="light-text">Payment Failed</h2>
                            </div>
                        }
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
                                    <td><span className="d-light-text"
                                              style={{textTransform: "uppercase"}}>{merchant_name}</span></td>
                                </tr>
                                <tr>
                                    <td>Amount:</td>
                                    <td><span className="d-light-text">??{amount && parseFloat(amount).toFixed(2)}</span>
                                    </td>
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
                                    <td><span
                                        className="d-light-text">{trans_date && moment(trans_date).format('Do MMM YYYY')}</span>
                                    </td>
                                </tr>
                                {
                                    payer_name &&
                                    <tr>
                                        <td>Payer Name:</td>
                                        <td><span className="d-light-text">{payer_name}</span></td>
                                    </tr>
                                }
                            </table>
                        </div>
                    </div>
                    <div className="hide-btn">
                        <button className="btn_set" onClick={() => setStep(0)}>Hide Details</button>
                    </div>
                </div>
            }

        </div>
    );
}
export default Receipt;