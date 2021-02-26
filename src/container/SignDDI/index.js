import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import AntiClockLoader from '../../component/UI/AnitClockLoader';
import {makeRequest} from "../../utils";
import {getUserData } from "../../utils";
import Logo from '../../component/Header/img/Light-Logo.png';
import DirectDebitLogo from './img/directdebit.png';
import './styles.css';

const SignDDI = () => {
    const { paymentId } = useParams();
    const [loading, setLoading] = useState(false);
    const [paymentObj, setPaymentObj] = useState({});
    const [step, setStep] = useState(0);
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState(false);

    useEffect( () => {
        getPaymentDetail()
    }, []);

    const getPaymentDetail = async () => {
        try {
            setLoading(true);
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/directdebit/payment`,
                {
                    paymentId,
                    merchantId: getUserData().merchant_id
                }, 'POST');

            console.log('req :: ', req.data);
            setPaymentObj(req.data.paymentDetail.data);
            setLoading(false);
        } catch (e) {
            console.log('error :: ', e);
        }
    }
    const showLegalDocument = (isShow) => {
        console.log('req :: ', isShow);
        isShow ? setStep(1) : setStep(0);
    }
    const handleSignRequest = () => {
        setError(true);
    }
    return (
        <div>
            {loading &&
            <div className="loader bank-bg-color">
                <AntiClockLoader  message={'processing'} color="black"/>
            </div>
            }
            {
                !loading && step === 0 &&
                    <div className="sign-dd-container">
                        <div className="sign-logo-container">
                            <img src={Logo} alt="beam" className="sign-logo"/>
                        </div>
                        {
                            paymentObj &&
                                <div>
                                    <div className="sign-container">
                                        <p className="text-center">Personal Details</p>
                                        <div>
                                            <label> First Name:<br/>
                                                <input type="text" value="John" disabled/>
                                            </label>
                                            <label> Last Name:<br/>
                                                <input type="text" value="Doe" disabled/>
                                            </label>
                                            <label className="email-input"> Email:<br/>
                                                <input type="email" value={paymentObj.email} disabled/>
                                            </label>
                                        </div>
                                        <div className="text-center">
                                            <p>Payment Received: {paymentObj.amount ? paymentObj.amount.toFixed(2) : paymentObj.amount}</p>
                                            <p>Reference:  43559083</p>
                                            <br/>
                                            <p>Future Direct Debits will be taken from</p>
                                            <p>Account Number: 12345678</p>
                                            <p> Bank Sort Code: 462517</p>
                                        </div>
                                        <br/>
                                        <div>
                                            <label>
                                                <input type="checkbox" checked={checked} onChange={(e) => {
                                                    setChecked(e.target.checked);
                                                    setError(false);
                                                }} /> <sup>*</sup>Tick To Accept Direct Debit Instruction
                                            </label>
                                            {error && <p className="text-left error_text">This field is required!</p>}
                                        </div>
                                        <div>
                                            <p>You will be notified via e-mail once your Direct Debit Instruction has been activated.
                                                The notification will be sent within 3 working days or no later than 5
                                                working days before the first collection.</p>
                                        </div>
                                        <div className="dd-btn-block">
                                            <button className="btn btn-primary dd-btn" onClick={handleSignRequest} >Sign</button>
                                        </div>
                                        <h3>beam.</h3>
                                        <h4>Address</h4>
                                        <div>
                                           <p>
                                               Your payments are protected by the
                                               <span className="dd-link" onClick={() => showLegalDocument(true)}>
                                                   {' '}Direct Debit Guarantee.
                                                </span>
                                           </p>
                                        </div>
                                        <div className="text-right">
                                            <img src={DirectDebitLogo} width='114' />
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
            }
            {
                !loading && step === 1 &&
                <div className="sign-dd-container">
                    <div className="sign-logo-container">
                        <img src={Logo} alt="beam" className="sign-logo"/>
                    </div>
                    <p>Direct Debit Guarantee</p>
                    <div className="text-right">
                        <img src={DirectDebitLogo} alt="Direct Debit Logo" width="114" />
                    </div>
                    <ul>
                        <li>This Guarantee is offered by all banks and building societies that accept instructions to pay Direct Debits</li>
                        <li>If there are any changes to the amount, date or frequency of your Direct Debit Beam will notify you 10 working days in advance of your account being debited or as otherwise agreed. If your request Beam to collect a payment, confirmation of the amount and date will be given to you at the time of the request</li>
                        <li>If an error is made in the payment of your Direct Debit by Beam or your bank or building society, you are entitled to a full and immediate refund of the amount paid from your bank or building society</li>
                        <li>If you receive a refund you are not entitled to, you must pay it back when Beam asks you to</li>
                        <li>You can cancel a Direct Debit at any time by simply contacting your bank or building society. Written confirmation may be required. Please also notify us.</li>
                    </ul>
                    <div className="dd-btn-block">
                        <button className="btn btn-primary dd-btn" onClick={() => showLegalDocument(false)} >Back</button>
                    </div>
                </div>
            }
        </div>
    );
}
export default SignDDI;