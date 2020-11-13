import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import axios from "axios";
import './style.css';
import Loader from "react-loader-spinner";
import {NUAPAY_LIVE_BANKS as banks} from "../../utils/Constants";
import Logo from '../../component/Header/img/Light-Logo.png';
import Input from "../../component/UI/Input";
import { makeRequest } from "../../utils";
import Mark from './img/mark.jpg';
import Checkbox from '@material-ui/core/Checkbox';
import Pusher from "pusher-js";
import {setPusherClient} from "react-pusher";

const Bank = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [bankList, setBankList] = useState(banks);
    const [paymentDetailError, setPaymentDetailError] = useState(false);
    const [paymentData, setPaymentData] = useState({});
    const [tipAmount, setTipAmount] = useState('');
    const [totalAmount, setTotalAmount] = useState();
    const [tipError, setTipError] = useState('');
    const [chAmount, setChAmount] = useState(10);
    const [chAmountError, setChAmountError] = useState('');
    const [merchantType, setMerchantType] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [taxPayer, setTaxPayer] = useState(false);
    const [taxPayerName, setTaxPayerName] = useState('');
    const [taxPayerAddr, setTaxPayerAddr] = useState('');
    const [taxPayerNameError, setTaxPayerNameError] = useState('');
    const [taxPayerAddrError, setTaxPayerAddrError] = useState('');

    const { token } = useParams();
    const location = useLocation();
    const history = useHistory();

    var pusherClient = new Pusher('ac404fe517d1f318787a', {
        cluster: 'ap2'
    });
    setPusherClient(pusherClient);

    useEffect(() => {
        const channel = pusherClient.subscribe('my-channel');
        channel.bind('thankyou-page-event', function(data) {
            if(data.token === token ) {
                history.push('/thankyou');
            }
        });
    }, []);

    const createPayment = async (bankId) => {
        try {
            setLoading(true);
            setError('');
            const aspUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment/selfhost`,
                {
                    bankId: bankId,
                    token: token,
                    tipAmount: tipError ? 0 : tipAmount,
                });
            setLoading(false);
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_self');
        } catch (e) {
            // console.log(e);
            // console.log(e.response);
            // console.log(e.response.data);
            setLoading(false);
            // setError(e.response.data.message);
            setError('Sorry, this bank is currently down. Please try again later');
            window.scrollTo(0, 0);
        }
    }
    const formatPayment = (amount) => {
        var amount = parseFloat(amount).toFixed(2);
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
        if (location.pathname.includes('/ch/bank')) {
            setMerchantType('charity');
            getCharityPaymentDetails();
        } else {
            getPaymentDetails();
        }
    }, []);
    const getCharityPaymentDetails = async () => {
        try {
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/ch_payment/${token}`, {}, 'GET');
            setMerchantName(req.data.merchantName);
            setPaymentDetailError('');
        } catch (e) {
            setPaymentDetailError(true);
        }
    }
    const getPaymentDetails = async () => {
        setLoading(true);
        try {
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/details/${token}`, {}, 'GET');
            setPaymentData( prevState => ({...paymentData, ...req.data.data}));
            setTotalAmount(req.data.data.amount);
            setLoading(false);
            setPaymentDetailError('');
        } catch (e) {
            setLoading(false);
            setPaymentDetailError(true);
        }
    }
    const handleTipAmount = (value) => {
        if(value && isNaN(value) && value !== '.') {
            setTipError('Value must be number');
            setTotalAmount(paymentData.amount);
            return;
        } else if (value.toString().split('.')[1] && value.toString().split('.')[1].length > 2){
            setTipAmount(parseFloat(value).toFixed(2));
        } else if (value === '.') {
            setTipAmount(value);
            setTotalAmount(paymentData.amount);
            return;
        } else {
            setTipAmount(value);
        }

        setTipError('');
        if(value) {
            let amount = parseFloat(paymentData.amount) + parseFloat(value);
            setTotalAmount(amount);
        } else {
            setTotalAmount(paymentData.amount);
        }
    }
    const handleCharityAmount = (value) => {
        if(value && isNaN(value) && value !== '.') {
            setChAmountError('Value must be number');
            return;
        } else if (value.toString().split('.')[1] && value.toString().split('.')[1].length > 2){
            setChAmount(parseFloat(value).toFixed(2));
        } else if (value === '.') {
            setChAmount(value);
            return;
        } else {
            setChAmount(value);
        }
        console.log('he :: ', value)
    }
    const createCharityPayment = async (bankId) => {
        if(taxPayer) {
            if(!taxPayerName || !taxPayerAddr) {
                !taxPayerName && setTaxPayerNameError('Please enter name');
                !taxPayerAddr && setTaxPayerAddrError('Please enter address');
                return;
            }
        }
        if (!chAmount) {
            setChAmountError('Please enter amount value');
            return;
        } else if (parseFloat(chAmount) < 0 || parseFloat(chAmount) === 0) {
            setChAmountError('Amount must be greater than 0.00');
            return;
        }
        try {
            setLoading(true);
            setError('');
            let data = {
                bankId: bankId,
                charityAmount: chAmount,
                isTaxPayer: taxPayer,
                name: taxPayerName,
                address: taxPayerAddr,
                token: token
            };

            const aspUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/ch_payment`,
                data);
            // setLoading(false);
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_self');
        } catch (e) {
            // console.log(e);
            // console.log(e.response);
            // console.log(e.response.data);
            setLoading(false);
            setError(e.response.data.error.message);
            // window.scrollTo(0, 0);
        }
    }

    console.log('redeploying code ::');
    return (
        loading ?
            <div>
                {loading &&
                <div className="loader bank-bg-color">
                    <div id="loaderdiv">
                        <Loader type="Oval" color="#000000" height={100} width={100}/>
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
                    <div className="detail-error-block">
                        <div className="text-center">
                            <img className="mark" src={Mark} alt="mark" />
                            <h2 className="error_text text-center mr-1">
                                Sorry, we are not able to process your payment at the moment.
                            </h2>
                            <p className="text-center mr-1">
                                Please go back to your merchant for assistance. We will resolve this issue as soon as possible
                                so that you can try again.
                            </p>
                        </div>
                    </div>
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
                                                    {
                                                        merchantType === 'charity' ?
                                                            <strong>{merchantName}</strong>
                                                            :
                                                            <strong>{Object.keys(paymentData).length > 0 ? paymentData.merchantName : ''}</strong>
                                                    }
                                                </p>
                                            </div>
                                            <div style={{ fontSize: '18px'}}>
                                                <span>&#163;</span>
                                                {
                                                    merchantType === 'charity' ?
                                                        chAmount ? parseFloat(chAmount).toFixed(2) : '0.00'
                                                        :
                                                        Object.keys(paymentData).length > 0 && parseFloat(totalAmount).toFixed(2)
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        paymentData && paymentData.merchant_type === 'tip' &&
                                        <div className="tip-detail">
                                            <div>
                                                <h3 className="payment-label">Would you like to add a tip?</h3>
                                            </div>
                                            <div>
                                                <Input
                                                    name="tipAmount"
                                                    handleChange={handleTipAmount}
                                                    value={tipAmount}
                                                    error={tipError}
                                                    placeholder="Amount"
                                                    type="text"
                                                    className="tip-box"
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        merchantType === 'charity' &&
                                        <div className="tip-detail">
                                            <div>
                                                <h3 className="payment-label">Enter amount here</h3>
                                            </div>
                                            <div>
                                                <Input
                                                    name="chAmount"
                                                    handleChange={(value) => {
                                                        handleCharityAmount(value);
                                                        setChAmountError('');
                                                    }}
                                                    value={chAmount}
                                                    error={chAmountError}
                                                    placeholder="Amount"
                                                    type="text"
                                                    className="tip-box"
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        merchantType === 'charity' &&
                                        <div>
                                            <h4 style={{padding: '10px 0 0 10px'}}>Gift Aid</h4>
                                            <Checkbox
                                                onChange={(e) => {
                                                    setTaxPayer(e.target.checked);
                                                    if (!e.target.checked) {
                                                        setTaxPayerName('');
                                                        setTaxPayerNameError('');
                                                        setTaxPayerAddr('');
                                                        setTaxPayerAddrError('');
                                                    }
                                                }}
                                                checked={taxPayer}
                                                color="primary"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            /> Are you a tax payer?
                                            { taxPayer &&
                                            <div className="tip-detail">
                                                <div>
                                                    <h3 className="payment-label">Name</h3>
                                                </div>
                                                <div>
                                                    <Input
                                                        name="Name"
                                                        handleChange={(value) => {
                                                            setTaxPayerNameError('');
                                                            setTaxPayerName(value);
                                                        }}
                                                        value={taxPayerName}
                                                        error={taxPayerNameError}
                                                        placeholder="Name"
                                                        type="text"
                                                        className="tip-box"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="payment-label">Address</h3>
                                                </div>
                                                <div>
                                                    <Input
                                                        name="Address"
                                                        handleChange={(value) => {
                                                            setTaxPayerAddr(value);
                                                            setTaxPayerAddrError('');
                                                        }}
                                                        value={taxPayerAddr}
                                                        error={taxPayerAddrError}
                                                        placeholder="Enter address"
                                                        type="text"
                                                        className="tip-box"
                                                    />
                                                </div>
                                            </div>
                                            }
                                        </div>

                                    }
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
                                    <div>
                                        <p className="t-error">{error}</p>
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
                                                        onClick={() => merchantType === 'charity' ? createCharityPayment(bank.id) : createPayment(bank.id)}
                                                    />
                                                    <p>{bank.name}</p>
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