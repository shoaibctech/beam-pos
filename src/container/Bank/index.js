import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './style.css';
import Loader from "react-loader-spinner";
import {NUAPAY_LIVE_BANKS as banks} from "../../utils/Constants";
import Logo from '../../component/Header/img/Junction-pos.png';
import { makeRequest } from "../../utils";

const Bank = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [bankList, setBankList] = useState(banks);
    const [paymentDetailError, setPaymentDetailError] = useState(false);
    const [paymentData, setPaymentData] = useState({});
    const { token } = useParams();

    const createPayment = async (bankId) => {
        try {
            setLoading(true);
            setError('');
            const aspUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment/selfhost`,
                {
                    bankId: bankId,
                    token: token,
                });
            // setLoading(false);
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_self');
        } catch (e) {
            console.log(e);
            console.log(e.response);
            console.log(e.response.data);
            setLoading(false);
            setError(e.response.data.message);
            window.scrollTo(0, 0);
        }
    }
    const formatPayment = (amount) => {
        const firstPart = amount.toString().split('.')[0];
        const secondPart = amount.toString().split('.')[1];
        return (
            <span>
                <strong style={{ fontSize: '18px'}}>{firstPart}</strong> {secondPart && '.'}{secondPart}
        </span>
        );
    }
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        let searchResult = banks.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
        if(value){
            setBankList(searchResult);
        } else {
            setBankList(banks);
        }
    }
    useEffect(() => {
       getPaymentDetails();
    }, []);
    const getPaymentDetails = async () => {
        console.log('fetching payment details ::');
        setLoading(true);
        try {
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/details/${token}`, {}, 'GET');
            console.log(req.data.data);
            console.log(Object.keys(req.data.data).length);
            setPaymentData( prevState => ({...paymentData, ...req.data.data}))
            setLoading(false);
            setPaymentDetailError('');
        } catch (e) {
            setLoading(false);
            setPaymentDetailError(true);
        }
    }

    return (
        loading ?
        <div>
            {loading &&
            <div className="loader">
                <div id="loaderdiv">
                    <Loader type="TailSpin" color="black" height={100} width={100}/>
                </div>
                <div>
                    <h3>Connecting...</h3>
                </div>
            </div>
            }
        </div>
            :
            paymentDetailError ?
                <div className="detail-error">
                    <h2 className="error_text">Invalid payment token....</h2>
                </div>
                :
            <div className="outer-container">
                <div className="inner-container">
                    <div className="inner-container-grid">
                        <div className="left-section">
                            <div className="left-content">
                                <div className="bank-screen-logo-container">
                                    <img src={Logo} alt="logo" className="bank-screen-logo" />
                                </div>
                                <div className="payment-detail-section">
                                    <h3 className="text-center mobile-heading">Payment Info</h3>
                                    <div className="payment-detail">
                                        <div>
                                            <p className="payment-label">Payment to:</p>
                                            <p>
                                                <strong>{Object.keys(paymentData).length > 0 ? paymentData.merchantName : ''}</strong>
                                            </p>
                                        </div>
                                        <div>
                                            <span>&#163;</span>
                                            {Object.keys(paymentData).length > 0 && formatPayment(paymentData.amount)}
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="reference-section">*/}
                                {/*    <p>Reference</p>*/}
                                {/*    <p><strong>Reference</strong></p>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div>
                            <div className="right-content">
                                <div className="text-center">
                                    <h2 className="bank-heading">Choose your bank</h2>
                                </div>
                                {    error &&
                                     <div className="error-block">
                                         <p className="t-error" style={{textAlign: 'center'}}>{error}</p>
                                     </div>
                                 }

                                <div>
                                    <input type="text" placeholder="search" value={searchQuery} onChange={handleSearch} />
                                </div>
                                <div>
                                    {
                                        bankList.length < 1 &&
                                        <p className="no-bank">No bank found.</p>
                                    }
                                    <div className="bank-list-container">
                                        {bankList.map((bank, index) => (
                                            <div key={index} className="list-banks">
                                                <img
                                                    style={{cursor: 'pointer'}}
                                                    className="list-banks-logo"
                                                    src={bank.logo}
                                                    alt={bank.logo}
                                                    onClick={() => createPayment(bank.id)}
                                                />
                                                <h5>{bank.name}</h5>
                                                <br/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Bank;