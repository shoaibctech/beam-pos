import React, { useState, useEffect } from "react";
import Loader from "../UI/Loader";
import { makeSecureRequest, getUserData } from "../../utils";
import './style.css';

const RefundForm = ({ getRefundList, paymentObj, handleTabValue, handleClose, isFetchingRefundList, refundedValue }) => {

    const [refundLimitError, setRefundLimitError] = useState(false);
    const [refundMessage, setRefundMessage] = useState('');
    const [isRefunding, setIsRefunding] = useState(false);
    const [refundError, setRefundError] = useState('');
    const [amount, setAmount] = useState(0);
    const [refundPayment, setRefundPayment] = useState({});
    const [refundStep, setRefundStep] = useState(0);

    useEffect(() => {
        setRefundPayment( prevState => ({...paymentObj}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refund = async () => {
        setRefundStep(2);
        setIsRefunding(true);
        setRefundError('');
        try {
            await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/refund`, {
                paymentId: paymentObj.id,
                amount: amount,
                currency: paymentObj.currency,
                identification: paymentObj.endToEndIdentification,
                remittanceInformation: paymentObj.remittanceInformation,
                merchantId: getUserData().merchant_id,
            }, 'POST');

            setIsRefunding(false);
            setRefundMessage('Your refund request was submitted successfully.');
            getRefundList();
            setAmount('')
        } catch (e) {
            console.log(e.response.data.error.details[0].description);
            setRefundError(e.response.data.error.details[0].description);
            setIsRefunding(false);
            setAmount('');
        }
    }

    const showVerifyMessage = () => {
        if(amount > (refundPayment.amount - refundedValue)){
            setRefundLimitError(true);
            return;
        }
        setRefundStep(1);
    }

    return (
        <React.Fragment>
            <div className="refund-section">
                {
                    refundStep === 0 &&
                        !isRefunding && !isFetchingRefundList &&
                        <div>
                            <h1 className='refund-heading'>Refund</h1>
                            <p className="refund-section-div">
                                Maximum refund amount for this transaction: {(refundPayment.amount - refundedValue).toFixed(2)}
                            </p>
                            {
                                <div>
                                    <input
                                        placeholder="Enter amount"
                                        type="number"
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setRefundLimitError(false);
                                        }}
                                        value={amount}/>
                                </div>
                            }
                            {
                                refundLimitError && <p className="red-text">The specified amount is greater than the maximum amount allowed. Use a lower amount and try again.</p>
                            }

                            <br/>
                            <div className="refund-modal-footer">
                                <button className="btn-cancel" onClick={handleClose}>
                                    Cancel
                                </button>
                                <button
                                    className="btn-ok"
                                    onClick={() => showVerifyMessage()}
                                    disabled={!amount}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                }
                {
                    refundStep === 1 &&
                        <div>
                            <div className="refund-success-message-block">
                                <h4>Are you sure you want to refund {amount} {refundPayment.currency}?</h4>
                                <div className="refund-modal-footer">
                                    <button className="btn-cancel" onClick={() => setRefundStep(0)}>
                                        Back
                                    </button>
                                    <button
                                        className="btn-ok"
                                        onClick={() => refund()}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                }
                {
                    refundStep === 2 &&
                        <div>
                            {
                                isRefunding &&
                                <div className="refund-success-message-block">
                                    <div className='text-center'>
                                        <Loader />
                                    </div><Loader />
                                </div>
                            }
                            {
                                refundMessage &&
                                <div className="refund-success-message-block">
                                    <h3>{refundMessage}</h3>
                                    <button className="ok btn-ok" onClick={() => handleTabValue(0)}>View Refunds</button>
                                </div>
                            }
                            {
                                refundError &&
                                <div className="refund-success-message-block">
                                    <p className="t-error">{refundError}</p>
                                    <button className="btn-cancel" onClick={() => setRefundStep(0)}>Back</button>
                                </div>
                            }
                        </div>
                }
            </div>
        </React.Fragment>
    );
}
export default RefundForm;