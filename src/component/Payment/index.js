import React from "react";
import Loader from 'react-loader-spinner'

import '../QuoteDetails/styles.css';
import './styles.css'
const Payment = ({ user, getAccessToken, emailStatus, errorStatus, svgData, isFecthing }) => {

    return (
        <React.Fragment>
            {isFecthing ?
                <div className="payment-module payment-loader">
                    <Loader type="TailSpin" color="black" height={100} width={100}/>
                </div>
                :
                <div className="payment-module">
                    <div className="payment-status-model">
                        <div>
                            <h2 className="content-text">You are requesting {parseFloat(user.amount).toFixed(2)} GBP</h2>
                        </div>
                        <div>
                            <h3 className="bar">Summary</h3>
                        </div>

                        <div className="content-text">
                            <div className="summary-row">
                                <p>Total amount</p>
                                <p>{parseFloat(user.amount).toFixed(2)} GBP</p>
                            </div>
                        </div>
                        <div className="content-text">
                            <div className="summary-row">
                                <p>Fee (1%)</p>
                                <p>{parseFloat(user.amount * 0.01).toFixed(2)} GBP</p>
                            </div>
                        </div>
                        <div className="content-text">
                            <div className="summary-row">
                                <p>Total to receive </p>
                                <p>{(parseFloat(user.amount) - parseFloat(user.amount * 0.01)).toFixed(2)} GBP</p>
                            </div>
                            <br/>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'center' }}>
                            {
                                <button onClick={() => getAccessToken()} className="pay-btn" disabled={emailStatus || errorStatus}>
                                    Confirm
                                </button>
                            }
                        </div>
                        <div style={{textAlign: 'center', marginTop: '1rem', marginBottom: '1rem'}}>
                            {
                                errorStatus &&
                                <p style={{color: 'red'}}>Some thing went wrong. Please try again later...</p>
                            }
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>

    );
}
export default Payment;
