import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './styles.css';
import {NUAPAY_LIVE_BANKS as banks} from "../../utils/Constants";
import Logo from './img/love_hemp.svg';
import SmallTick from './img/small-tick.svg';
import CbdOil from './img/cbd_oil.svg';
import Loader from '../../component/UI/Loader';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import OrangeCircle from "./img/orange-circle.svg";
import TickCircle from "./img/tick-circle.svg";

const StaticPaymentsBank = () => {
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [bankList, setBankList] = useState(banks);
    // const [paymentDetailError, setPaymentDetailError] = useState(false);
    const [paymentData, setPaymentData] = useState({
        merchantName: "LOVE HEMP",
        amount: 44.99,
        merchant_type: 'nontip'
    });
    const [selectedBank, setSelectedBank] = useState('');

    const [payerName, setPayerName] = useState('');
    const [payerEmail, setPayerEmail] = useState('');
    const [payerAddress, setPayerAddress] = useState('');
    const [payerErrors, setPayerErrors] = useState({name: '', email: '', address: ''})
    const [isAllFiledFill, setIsAllFieldFill] = useState(false);

    const { payment_token } = useParams();

    // var pusherClient = new Pusher('ac404fe517d1f318787a', {
    //     cluster: 'ap2'
    // });
    // setPusherClient(pusherClient);

    // useEffect(() => {
    //     const channel = pusherClient.subscribe('my-channel');
    //     channel.bind('thankyou-page-event', function(data) {
    //         if(data.token === token && !data.isMobile ) {
    //             history.push('/thankyou');
    //         } else if (data.token === token && data.isMobile ) {
    //             window.open(data.redirectLink, '_self');
    //         }
    //     });
    //     channel.bind('bank-payment-in-process-event', function (data) {
    //         if (data.token === token && data.status === 'processing' && width > 768 ) {
    //             setIsPaymentProcessing(true);
    //         } else if (data.token === token && data.status === 'processing' && width <= 768) {
    //             setLoading(true);
    //             setLoaderText('payment in progress');
    //         }
    //     });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(( ) => {
        getPaymentDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let isError = false;
        if (!payerName) {
            isError = true;
        }
        if (!payerEmail){
            isError = true;
        }
        if(payerEmail){
            let lastAtPos = payerEmail.lastIndexOf('@');
            let lastDotPos = payerEmail.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && payerEmail.indexOf('@@') === -1 && lastDotPos > 2 && (payerEmail.length - lastDotPos) > 2)) {
                isError = true;
            }
        }
        if (!payerAddress) {
            isError = true;
        }
        isError ? setIsAllFieldFill(false) : setIsAllFieldFill(true);
    }, [payerName, payerEmail, payerAddress])

    useEffect( () => {
        if (isAllFiledFill) {

        }
    }, [isAllFiledFill])

    const validatePayerDetails = () => {
        let payerError = {...payerErrors};
        let isError = false;
        if (!payerName) {
            payerError.name = "Name is required!"
            isError = true;
        }
        if (!payerEmail){
            payerError.email = "Email is required!"
            isError = true;
        }
        if(payerEmail){
            let lastAtPos = payerEmail.lastIndexOf('@');
            let lastDotPos = payerEmail.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && payerEmail.indexOf('@@') === -1 && lastDotPos > 2 && (payerEmail.length - lastDotPos) > 2)) {
                isError = true;
                payerError.email = "Email is not valid";
            }
        }
        if (!payerAddress) {
            payerError.address = "Address is required!"
            isError = true;
        }
        setPayerErrors(payerError);
        return isError;
    }
    const createPayment = async (bankId) => {
        if (validatePayerDetails()){
            scrollToRef(820);
            return;
        }

        try {
            // setLoading(true);
            setSelectedBank(bankId);
            setError('');
            const aspUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product/payment`,
                {
                    bankId: bankId,
                    paymentToken: payment_token,
                    payerName: payerName,
                    payerEmail: payerEmail,
                    payerAddress: payerAddress.label,
                    product: paymentData.product,
                    merchantId: paymentData.merchantId
                });
            //load payment link
            window.open(aspUrl.data.paymentLink, '_self');

        } catch (e) {
            // console.log(e);
            // console.log(e.response);
            // console.log(e.response.data);
            setSelectedBank('')
            // setLoading(false);
            switch (e.response && e.response.data.ErrorCode) {
                case 101:
                    setError(e.response.data.message);
                    break;
                default:
                    setError("Sorry, currently we can't process your request. Please try again later");
                // setError('Sorry, this bank is currently down. Please try again later');
            }
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

    const getPaymentDetails = async () => {
        // setLoading(true);
        try {
            const req = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product/payment/${payment_token}`);
            setPaymentData( req.data.paymentDetails);
            // setLoading(false);
            // setPaymentDetailError('');

        } catch (e) {
            // setLoading(false);
            // setPaymentDetailError(true);
        }
    }



    // useEffect(() => {
    //     checkAndFetchLogo();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    //
    // const checkAndFetchLogo = async () => {
    //     try {
    //         const logoType = location.pathname.includes('/ch/bank') ? 'charity' : 'beam';
    //         const logoReq = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/logo/${token}/${logoType}`);
    //
    //         if (logoReq.data.isLogo){
    //             setMerchantLogo(logoReq.data.logo);
    //         }
    //     } catch (e) {
    //         console.log('Error: No merchant logo found...');
    //     }
    // }


    // return (
    //     loading ?
    //         <div>
    //             {loading &&
    //             <div className="loader bank-bg-color">
    //                 <AntiClockLoader  message={loaderText} color="black"/>
    //             </div>
    //             }
    //         </div>
    //         :
    //         paymentDetailError ?
    //             <div className="detail-error">
    //                 <div className="detail-error-block">
    //                     <div className="text-center">
    //                         {/*<img className="mark" src={Mark} alt="mark" />*/}
    //                         <h2 className="error_text text-center mr-1">
    //                             <span className="info-icon"><i className="fas fa-info-circle"></i></span>  Sorry, the payment link is either used or expired.
    //                         </h2>
    //                         <p className="text-center mr-1">
    //                             Please go back to your merchant for assistance.
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>
    //             :
    //                 <div className="outer-container-static">
    //                     <div className="inner-container">
    //                         <div className="inner-container-grid">
    //                             <div className="left-section">
    //                                 <div className="left-content">
    //                                     <div className="bank-screen-logo-container">
    //                                         <img
    //                                             src={merchantLogo ? merchantLogo : Logo}
    //                                             alt="logo"
    //                                             className="bank-screen-logo"
    //                                         />
    //                                     </div>
    //                                     <div>
    //                                         <p className="cursor-pointer beam-link"
    //                                            onClick={() => window.open('https://www.beamtopay.com', '_blank')}
    //                                         >What is beam?
    //                                         </p>
    //                                     </div>
    //                                     <div className="payment-detail-section">
    //                                         {/*<h3 className="text-center mobile-heading">Payment Info</h3>*/}
    //                                         <div className="payment-detail">
    //                                             <div>
    //                                                 <p className="payment-label">Payment to:</p>
    //                                                 <p>
    //                                                     <strong>{Object.keys(paymentData).length > 0 ? paymentData.merchantName : ''}</strong>
    //                                                 </p>
    //                                             </div>
    //                                             <div style={{ fontSize: '18px'}}>
    //                                                 <span>&#163;</span>
    //                                                 {paymentData && paymentData.product && parseFloat(paymentData.product.product_price).toFixed(2)}
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                     <div className="flow-steps">
    //                                         <div>
    //                                            <div className="w-100">
    //                                                {/*<p className="payment-label"></p>*/}
    //                                                <div className="detail-step"><span className="step-mark">1</span> Fill Details</div>
    //                                                <div>
    //                                                    <input
    //                                                        placeholder="Enter name ..."
    //                                                        type="text"
    //                                                        value={payerName}
    //                                                        onChange={(e) => {
    //                                                            setPayerName(e.target.value)
    //                                                            let payerError = {...payerErrors};
    //                                                            payerError.name = '';
    //                                                            setPayerErrors(payerError);
    //                                                        }}
    //                                                    />
    //                                                    <p className="error_text">{payerErrors && payerErrors.name}</p>
    //                                                </div>
    //                                                <div>
    //                                                    <input
    //                                                        placeholder="Enter email ..."
    //                                                        type="email"
    //                                                        value={payerEmail}
    //                                                        onChange={(e) => {
    //                                                            setPayerEmail(e.target.value)
    //                                                            let payerError = {...payerErrors};
    //                                                            payerError.email = '';
    //                                                            setPayerErrors(payerError);
    //                                                        }}
    //                                                    />
    //                                                    <p className="error_text">{payerErrors && payerErrors.email}</p>
    //                                                </div>
    //                                                <div>
    //                                                    <GooglePlacesAutocomplete
    //                                                        apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
    //                                                        selectProps={{
    //                                                            payerAddress,
    //                                                            isClearable: true,
    //                                                            placeholder: 'Type address or post code...',
    //                                                            onChange: (value) => {
    //                                                                setPayerAddress(value);
    //                                                                let payerError = {...payerErrors};
    //                                                                payerError.address = '';
    //                                                                setPayerErrors(payerError);
    //                                                            },
    //                                                        }}
    //                                                    />
    //                                                    <p className="error_text">{payerErrors && payerErrors.address}</p>
    //                                                </div>
    //                                            </div>
    //                                         </div>
    //                                         <div><span className="step-mark">2</span> Select your bank</div>
    //                                         <div><span className="step-mark">3</span> Authorize your payment</div>
    //                                         {/*<div>*/}
    //                                         {/*    Product Name*/}
    //                                         {/*</div>*/}
    //                                     </div>
    //
    //                                     <div className="rule-conduct desktop-only">
    //                                         <p>
    //                                             Beam Payments is powered by Sentenial Limited, trading as Nuapay,
    //                                             who are authorised by the Financial Conduct Authority under the Payment
    //                                             Service Regulations 2009 [FRN 624067] for the provision of payment services.
    //                                         </p>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                             <div className="right-section">
    //                                 <div className="right-content">
    //                                     <div className="text-center">
    //                                         <h2 className="bank-heading">Choose your bank</h2>
    //                                     </div>
    //                                     {    error &&
    //                                     <div>
    //                                         <p className="t-error">{error}</p>
    //                                     </div>
    //                                     }
    //
    //                                     <div>
    //                                         <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} />
    //                                     </div>
    //                                     <div>
    //                                         {
    //                                             bankList.length < 1 &&
    //                                             <p className="no-bank">No bank found.</p>
    //                                         }
    //                                         <div className="bank-list-container-static">
    //                                             {bankList.map((bank, index) => (
    //                                                 <div key={index} className="list-banks">
    //                                                     { selectedBank === bank.id ?
    //                                                         <div className="bank-loader-container">
    //                                                             <Loader size="2rem" color="primary"/>
    //                                                         </div>
    //                                                         : <img
    //                                                             style={{cursor: 'pointer'}}
    //                                                             className="list-banks-logo"
    //                                                             src={bank.logo}
    //                                                             alt={bank.logo}
    //                                                             onClick={() => createPayment(bank.id)}
    //                                                         />
    //                                                     }
    //                                                     <p>{bank.name}</p>
    //                                                     <br/>
    //                                                 </div>
    //                                             ))}
    //                                         </div>
    //                                     </div>
    //                                     <div className="rule-conduct mobile-only">
    //                                         <p>
    //                                             Beam Payments is powered by Sentenial Limited, trading as Nuapay,
    //                                             who are authorised by the Financial Conduct Authority under the Payment
    //                                             Service Regulations 2009 [FRN 624067] for the provision of payment services.
    //                                         </p>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    // );
    const scrollToRef = (to) => window.scrollTo({top: to, behavior: 'smooth'})
    return (
        <div>
            <div id="love-hemp-section-1"  className="love-hemp-section">
                <div className="logo-container">
                    <img src={Logo} alt="Love hemp"/>
                </div>
                <div className="product-img-container">
                    <img src={CbdOil} alt="CBD Oil"/>
                </div>
                <div className="on-sale">
                    <p>ON SALE</p>
                </div>
                <div className="product-des-container">
                    <p className="product-name">
                        Love Hemp® CBD Liquid Oral Oil Drops,
                    </p>
                    <p className="product-name">1,200mg CBD</p>
                    <p className="product-quantity">
                        Strong / 4% / 30ml
                    </p>
                    <div className="product-price-block">
                        <span className="large-font">£44.99</span>
                        <span className="medium-font">£49.99</span>
                        <span className="small-font">-£5.00</span>
                    </div>
                    <p className="product-type mr-t-10">NATURAL</p>
                    <p className="mr-t-20 trust">Trustpilot</p>
                    <div className="mr-t-10 product-ch">
                        <img src={SmallTick} alt="tick" />
                        <span>Vegan</span>
                        <img src={SmallTick} alt="tick" />
                        <span>Gluten free</span>
                        <img src={SmallTick} alt="tick" />
                        <span>Zero THC</span>
                    </div>
                    <button className="confirm-order-btn" onClick={() => scrollToRef(820)}>
                        CONFIRM YOUR ORDER
                    </button>
                    <div>
                        <p className="term-condition">
                            Terms and conditions of order text. By confirming this order to Love Hemp you agree to their
                            terms of service and privacy information. Standard shipping applies 3 - 5 working days.
                        </p>
                    </div>
                </div>
            </div>
            <div id="love-hemp-section-2" className="love-hemp-section" >
                <p className="mr-t-10 text-center sec-2-h">
                    Confirm shipping info
                </p>
                <div className="logo-container">
                    <img src={Logo} alt="Love hemp"/>
                </div>

                <div className="payment-info-block">
                    <p className="product-link">What is this?</p>
                    <div className="payment-info">
                        <p className="payment-label">Payment info</p>
                        <p className="merchant-and-item">Love Hemp</p>
                        <div className="product-name-price">
                            <p className="merchant-and-item">
                                Oral Oil Drops, 1,200mg
                            </p>
                            <p className="item-price">£44.99</p>
                        </div>
                    </div>
                </div>
                <div className={isAllFiledFill ? 'mr-t-20 shipping-block no-border' : 'mr-t-20 shipping-block'}>
                    <div className="ship-heading">
                        {isAllFiledFill ? <img src={TickCircle} alt="circle" /> : <img src={OrangeCircle}  alt="circle"/>}
                        <span>Fill in <strong>shipping information</strong></span>
                    </div>
                    <div className="mr-t-20 input-block">
                        <div className="product-input">
                            <label>Name</label>
                            <input
                                placeholder="Enter name ..."
                                type="text"
                                value={payerName}
                                onChange={(e) => {
                                           setPayerName(e.target.value)
                                           let payerError = {...payerErrors};
                                           payerError.name = '';
                                           setPayerErrors(payerError);
                                       }}
                            />
                            <p className="error_text_static">{payerErrors && payerErrors.name}</p>
                        </div>
                        <div className="product-input">
                            <label>Email</label>
                            <input
                                placeholder="Enter email ..."
                                type="email"
                                value={payerEmail}
                                onChange={(e) => {
                                   setPayerEmail(e.target.value)
                                   let payerError = {...payerErrors};
                                   payerError.email = '';
                                   setPayerErrors(payerError);
                               }}
                           />
                           <p className="error_text_static">{payerErrors && payerErrors.email}</p>
                        </div>
                        <div className="product-input">
                            <label>Shipping address or post code</label>
                            <GooglePlacesAutocomplete
                               apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                               selectProps={{
                                   payerAddress,
                                   isClearable: true,
                                   placeholder: 'Type address or post code...',
                                   onChange: (value) => {
                                       setPayerAddress(value);
                                       let payerError = {...payerErrors};
                                       payerError.address = '';
                                       setPayerErrors(payerError);
                                   },
                               }}
                           />
                           <p className="error_text_static">{payerErrors && payerErrors.address}</p>
                        </div>
                    </div>
                </div>
                <div className="mr-t-20 confirm-ship-btn-block">
                    <button
                        className={`confirm-ship-btn mr-t-20 ${isAllFiledFill ? 'fill-color' : ''}`}
                            onClick={() => {
                        if (validatePayerDetails()) {
                            return;
                        }
                        scrollToRef(1640)
                    }}>
                        CONFIRM SHIPPING INFO
                    </button>
                </div>
                <div className="m-l-15 m-r-15">
                    <p className="term-condition">
                        Payments are powered by Sentenial Limited, trading as Nuapay,
                        who are authorised by the Financial Conduct Authority
                        under the Payment Service Regulations 2009 [FRN 624067] for
                        the provision of payment services.
                    </p>
                </div>
            </div>
            <div id="love-hemp-section-3" className="love-hemp-section">
                 <div className="right-content">
                     <div className="text-center">
                         <h2 className="bank-heading-static">Select your bank</h2>
                     </div>
                     {    error &&
                    <div>
                        <p className="t-error">{error}</p>
                    </div>
                    }

                    <div>
                        <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} />
                    </div>
                    <div>
                        {
                            bankList.length < 1 &&
                            <p className="no-bank">No bank found.</p>
                        }
                        <div className="bank-list-container-static">
                            {bankList.map((bank, index) => (
                                <div key={index} className="list-banks-static">
                                    { selectedBank === bank.id ?
                                        <div className="bank-loader-container">
                                            <Loader size="2rem" color="primary"/>
                                        </div>
                                        : <img
                                            style={{cursor: 'pointer'}}
                                            className="list-banks-logo-static"
                                            src={bank.logo}
                                            alt={bank.logo}
                                            onClick={() => createPayment(bank.id)}
                                        />
                                    }
                                    <p>{bank.name}</p>
                                    <br/>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
}

export default StaticPaymentsBank;