import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import axios from "axios";
import './style.css';
import {NUAPAY_LIVE_BANKS as banks} from "../../utils/Constants";
// import Logo from '../../component/Header/img/Light-Logo.png';
import Logo from './img/Dark.png';
import Input from "../../component/UI/Input";
import { makeRequest } from "../../utils";
import Checkbox from '@material-ui/core/Checkbox';
import Pusher from "pusher-js";
import { setPusherClient } from "react-pusher";
import AntiClockLoader from '../../component/UI/AnitClockLoader';
import isMobile from '../../utils/MobileCheck';
import Loader from '../../component/UI/Loader';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

// redeploying
const Bank = () => {
    const [loading, setLoading] = useState(true);
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
    const [qrCodeImg, setQrCodeImg] = useState(null);
    const [showQrCode, setShowQrCode] = useState(false);
    const [isFetching, setFetching] = useState(false)
    const [loaderText, setLoaderText] = useState('beam.');
    const [isWpPayment, setIsWpPayment] = useState(false);
    const [merchantLogo, setMerchantLogo] = useState(null);
    const [email, setEmail] = useState('shoaib@c-tech.io');
    const [emailError, setEmailError] = useState('');

    const { token, payment_type } = useParams();
    const location = useLocation();
    const history = useHistory();

    var pusherClient = new Pusher('ac404fe517d1f318787a', {
        cluster: 'ap2'
    });
    setPusherClient(pusherClient);

    useEffect(() => {
        const channel = pusherClient.subscribe('my-channel');
        channel.bind('thankyou-page-event', function(data) {
            if(data.token === token && !data.isMobile ) {
                history.push('/thankyou');
            } else if (data.token === token && data.isMobile ) {
                window.open(data.redirectLink, '_self');
            }
        });
        channel.bind('bank-payment-in-process-event', function (data) {
            if (data.token === token && data.status === 'processing') {
                setLoading(true);
                setLoaderText('payment in progress');
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(( ) => {
        if (location.pathname.includes('/ch/bank')) {
            setMerchantType('charity');
            getCharityPaymentDetails();
        } else {
            if (!isMobile.any() && payment_type && payment_type === 'wp'){
                getQrCode();
            } else {
                getPaymentDetails();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const showLoader = () => {
    //     setLoading(true);
    //     setLoaderText('payment in progress');
    // }


    const createPayment = async (bankId) => {
        try {
            if (!email) {
                setEmailError('Email is required!');
                return;
            }
            setLoading(true);
            setError('');
            const aspUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/directdebit/createpayment`,
                {
                    bankId: bankId,
                    token: token,
                    email: email
                });
            //load payment link
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_self');

            if (!isMobile.any()){
                setTimeout(() => {
                    setLoading(false);
                }, 5000);
            }
        } catch (e) {
            // console.log(e);
            // console.log(e.response);
            // console.log(e.response.data);
            setLoading(false);
            switch (e.response.data.ErrorCode) {
                case 101:
                    setError(e.response.data.message);
                    break;
                default:
                    setError("Sorry, currently we can't process your request. Please try again later");
                    // setError('Sorry, this bank is currently down. Please try again later');
            }
            window.scrollTo(0, 0);
        }
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
    const getCharityPaymentDetails = async () => {
        try {
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/ch_payment/${token}`, {}, 'GET');
            setMerchantName(req.data.merchantName);
            setPaymentDetailError('');
            setLoading(false);
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
            if (req.data && req.data.data.link) {
                setIsWpPayment(true);
            }
        } catch (e) {
            setLoading(false);
            setPaymentDetailError(true);
        }
    }
    const getPaymentDetailsWeb = async () => {
        setFetching(true);
        try {
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/details/${token}`, {}, 'GET');
            setPaymentData( prevState => ({...paymentData, ...req.data.data}));
            setTotalAmount(req.data.data.amount);
            console.log('data test:: ', req.data)
            if (req.data && req.data.data.link){
                setIsWpPayment(true);
            }
            setFetching(false);
            setShowQrCode(false);
            setPaymentDetailError('');
        } catch (e) {
            setFetching(false);
            setShowQrCode(false);
            setPaymentDetailError(true);
        }
    }

    const getQrCode = async () => {
        setLoading(true);
        try {
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/qrcode/create`,
                {
                    pathUrl: window.location.href,
                    token: token
                }, 'POST');
           const imgBuffer = await convertSvgToJsxSvg(req.data.data);
           setQrCodeImg(imgBuffer);
           setShowQrCode(true);
           setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    }
    //TODO: move this code to utils
    const convertSvgToJsxSvg = async (data) => {
        let Img = data;
        Img = Img.replace(/xmlns:xlink/g, 'xmlnsXlink');
        Img = Img.replace(/xml:space/g, 'xmlSpace');
        Img = Img.replace(/enable-background/g, 'enableBackground');
        Img = Img.replace(/shape-rendering/g, 'shapeRendering');
        return new Buffer(Img);
    };

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
                address: taxPayerAddr.label,
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
    useEffect(() => {
        checkAndFetchLogo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAndFetchLogo = async () => {
        try {
            const logoReq = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/logo/${token}/beam`);
            console.log('logo req :: ', logoReq.data);
            if (logoReq.data.isLogo){
                setMerchantLogo(logoReq.data.logo);
            }
        } catch (e) {
            console.log('Error: No merchant logo found...');
        }
    }

    return (
        loading ?
            <div>
                {loading &&
                <div className="loader bank-bg-color">
                    <AntiClockLoader  message={loaderText} color="black"/>
                </div>
                }
            </div>
            :
            paymentDetailError ?
                <div className="detail-error">
                    <div className="detail-error-block">
                        <div className="text-center">
                            {/*<img className="mark" src={Mark} alt="mark" />*/}
                            <h2 className="error_text text-center mr-1">
                                <span className="info-icon"><i className="fas fa-info-circle"></i></span>  Sorry, the payment link is either used or expired.
                            </h2>
                            <p className="text-center mr-1">
                                Please go back to your merchant for assistance.
                            </p>
                        </div>
                    </div>
                </div>
                :
                showQrCode ?
                    <div className="outer-container">
                        <div className="inner-container">
                            <div className="dd-inner-container-grid">
                                <div className="left-section">
                                    <div className="left-content">
                                        {/*<span className="cursor-pointer" onClick={() => window.history.back()}><i className="fas fa-arrow-left"></i> back</span>*/}
                                        <div className="bank-screen-logo-container">
                                            <img src={merchantLogo ? merchantLogo : Logo } alt="logo" className="bank-screen-logo" />
                                        </div>

                                        <div>
                                            <p className="info-text">To start your payment either scan<br/> QR code or click select bank</p>
                                        </div>

                                        <div className="flow-steps">
                                            <div style={{background: 'transparent', padding: '0 3px', marginBottom: '-5px'}}>
                                                <p
                                                    className="cursor-pointer beam-link"
                                                    onClick={() => window.open('https://www.beamtopay.com', '_blank')}
                                                >
                                                    What is beam?
                                                </p>
                                            </div>
                                            {/*<div><span className="step-mark">1</span> Scan QR code</div>*/}
                                            <div>Scan QR code</div>
                                            <div className="or-div"><hr className="or-hr" /> <span className="or">OR</span> <hr className="or-hr"/></div>
                                            {/*<div><span className="step-mark">2</span> Select bank</div>*/}
                                            <div>Press Select bank</div>
                                        </div>
                                        <div className='cancel-flow mobile-only'>
                                            <p onClick={() => {
                                                window.history.back();
                                            }}
                                               style={{ color: "white" }}>
                                                Cancel and return to merchant
                                            </p>
                                        </div>

                                        <div className="rule-conduct desktop-only">
                                            <p>
                                                Beam Payments is powered by Sentenial Limited, trading as Nuapay,
                                                who are authorised by the Financial Conduct Authority under the Payment
                                                Service Regulations 2009 [FRN 624067] for the provision of payment services.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="dd-right-content">
                                        <div className="text-center">
                                            <h2 className="bank-heading">Proceed to Payment</h2>
                                        </div>
                                        <div>
                                            <p className="bank-heading-sub">Scan QR code with your mobile for rapid checkout directly from your banking app. Or alternatively, click 'Select bank' to checkout via your online banking website.</p>
                                            {/*<p className="bank-heading">Scan QR Code to proceed payment through mobile or click select bank.</p>*/}
                                        </div>
                                        <div className="bank-qr-code">
                                            <img id="qrCodeD" src={`data:image/svg+xml;base64,${btoa(qrCodeImg)}`} alt="Qr Code"/>
                                        </div>
                                        <div>
                                            <button className="btn btn-primary click-to-pay" onClick={getPaymentDetailsWeb}>
                                                {isFetching ? <Loader size="1rem" color="secondary"/> : 'Select Bank'}
                                            </button>
                                        </div>
                                        {/*<div>*/}
                                        {/*    <button onClick={showLoader} className="btn btn-primary"> Process </button>*/}
                                        {/*</div>*/}
                                        <div className="rule-conduct mobile-only">
                                            <p>
                                                Beam Payments is powered by Sentenial Limited, trading as Nuapay,
                                                who are authorised by the Financial Conduct Authority under the Payment
                                                Service Regulations 2009 [FRN 624067] for the provision of payment services.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='cancel-flow cancel-flow-bg desktop-768-only'>
                            <p onClick={() => {
                                window.history.back();
                            }}>Cancel and return to merchant</p>
                        </div>
                    </div>
                    :
                    <div className="outer-container">
                    <div className="inner-container">
                        <div className="dd-inner-container-grid">
                            <div className="left-section">
                                <div className="left-content">
                                    {
                                        isWpPayment && !isMobile.any() &&
                                        <span className="cursor-pointer btn-back" onClick={() => setShowQrCode(true)}><i className="fas fa-arrow-left"></i> back</span>
                                    }
                                    <div className="bank-screen-logo-container">
                                        <img src={merchantLogo ? merchantLogo : Logo} alt="logo" className="bank-screen-logo" />
                                    </div>
                                    <div>
                                        <p className="cursor-pointer beam-link"
                                           onClick={() => window.open('https://www.beamtopay.com', '_blank')}
                                        >What is beam?
                                        </p>
                                    </div>
                                    <div className="payment-detail-section">
                                        {/*<h3 className="text-center mobile-heading">Payment Info</h3>*/}
                                        <div className="payment-detail">
                                            <div>
                                                <p className="payment-label">{merchantType === 'charity' ? 'Donation to:' :  'Payment to:'}</p>
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
                                    <div>
                                        <input type="email" placeholder="*Email" value={email} onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError('');
                                        }} />
                                        { emailError && <p className="email-error">{emailError}</p>}
                                    </div>
                                    {/*<p className="info-link">what is beam?</p>*/}
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
                                        <div className="gift-aid-block">
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
                                            /> Are you a UK tax payer?
                                            { taxPayer &&
                                            <div className="tip-detail" style={{marginTop: '0'}}>
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
                                                    <h3 className="payment-label" style={{ marginBottom: '6px' }}>Address</h3>
                                                </div>
                                                {/*<div>*/}
                                                {/*    <Input*/}
                                                {/*        name="Address"*/}
                                                {/*        handleChange={(value) => {*/}
                                                {/*            setTaxPayerAddr(value);*/}
                                                {/*            setTaxPayerAddrError('');*/}
                                                {/*        }}*/}
                                                {/*        value={taxPayerAddr}*/}
                                                {/*        error={taxPayerAddrError}*/}
                                                {/*        placeholder="Enter address"*/}
                                                {/*        type="text"*/}
                                                {/*        className="tip-box"*/}
                                                {/*    />*/}
                                                {/*</div>*/}
                                                <GooglePlacesAutocomplete
                                                    apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                    selectProps={{
                                                        taxPayerAddr,
                                                        isClearable: true,
                                                        placeholder: 'Type address or post code...',
                                                        onChange: (value) => {
                                                            setTaxPayerAddr(value);
                                                            setTaxPayerAddrError('');
                                                        },
                                                    }}
                                                />
                                                {taxPayerAddrError ? <span className="red_color" style={{marginTop: '5px'}}>{taxPayerAddrError}</span> : ''}
                                            </div>
                                            }
                                        </div>

                                    }
                                    {/*<div className="reference-section">*/}
                                    {/*    <p>Reference</p>*/}
                                    {/*    <p><strong>Reference</strong></p>*/}
                                    {/*</div>*/}
                                    {paymentData && paymentData.merchant_type === 'nontip' &&  merchantType !== 'charity' &&
                                    <div className="flow-steps">
                                        <div><span className="step-mark">1</span> Connect to your bank</div>
                                        <div><span className="step-mark">2</span> Authorize your payment</div>
                                        <div><span className="step-mark">3</span> Return to{' '} <strong style={{marginLeft: '5px'}}> beam.</strong></div>
                                    </div>
                                    }
                                    {
                                        isWpPayment &&
                                        <div className='cancel-flow mobile-only'>
                                            <p onClick={() => {
                                                window.history.back();
                                            }}
                                               style={{ color: "white" }}
                                            >
                                                Cancel and return to merchant
                                            </p>
                                        </div>
                                    }
                                    <div className="rule-conduct desktop-only">
                                        <p>
                                            Beam Payments is powered by Sentenial Limited, trading as Nuapay,
                                            who are authorised by the Financial Conduct Authority under the Payment
                                            Service Regulations 2009 [FRN 624067] for the provision of payment services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="dd-right-content">
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
                                        <div className="dd-bank-list-container">
                                            {bankList.map((bank, index) => (
                                                <div key={index} className="dd-list-banks">
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
                                    <div className="rule-conduct mobile-only">
                                        <p>
                                            Beam Payments is powered by Sentenial Limited, trading as Nuapay,
                                            who are authorised by the Financial Conduct Authority under the Payment
                                            Service Regulations 2009 [FRN 624067] for the provision of payment services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        {
                            isWpPayment &&
                            <div className='cancel-flow cancel-flow-bg desktop-768-only'>
                                <p onClick={() => {
                                    window.history.back();
                                }}>Cancel and return to merchant</p>
                            </div>
                        }
                </div>
    );
}

export default Bank;