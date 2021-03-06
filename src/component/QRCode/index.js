import React, {useState, useEffect} from 'react';
import '../Payment/styles.css';
import './style.css';
import GreenTick from './img/tick-anim.svg';
import NoPayment from './img/no-payment.png';
import { PaymentStatusMessage, PaymentStatusImage } from "../../utils/Constants/PaymentStatus";
import {makeSecureRequest, getUserData } from "../../utils";
import Loader from "../UI/Loader";
import GetAppIcon from '@material-ui/icons/GetApp';
import MobileInput from "../UI/MobileInput";
import AlertToast from '../../component/UI/AlertToast';
import { useLocation } from 'react-router-dom';

const QRCode = ({link, title, isStatus, statusData, amount, merchantType, token}) => {
    const location = useLocation();
    const [isTick, setTick] = useState(false);
    const [phone, setPhone] = useState('');
    const [customer, setCustomer] = useState('');
    const [isLinkSending, setIsLinkSending] = useState(false);
    const [isLinkSent, setIsLinkSent] = useState('');
    const [error, setError] = useState({phone: '', twilio: ''});
    const [imgData, setImgData] = useState('');
    const [linkToSend, setLink] = useState(link);
    const [isCopied, setIsCopied] = useState(false);


    useEffect(() => {
        if(merchantType === 'charity')
            generateQrCode();

        setTimeout(() => {
            isStatus && setTick(true);
        }, 1200)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStatus]);

    const redirect = () => {
        console.log(linkToSend);
        window.open(linkToSend, '_blank');
    }

    const validateFields = () => {
        let errors = {...error};
        if (!phone) {
            errors.phone = "*Phone No is Required";
        } else if (phone.match(/\d/g).length < 9) {
            errors.phone = `Phone should be at least ${9} characters long`;
        } else {
            errors.phone = "";
        }

        setError(errors);
        if (errors.phone) {
            return true;
        } else {
            return false;
        }
    };
    const generateQrCode = async () => {
        try {
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/qrcode/ch`, {
                merchantId: getUserData().merchant_id
            },'POST');
            setLink(req.data.link);
            convertSvgToJsxSvg(req.data.data);
        } catch (e){
            console.log('error :: ', e);
        }
    };
    const convertSvgToJsxSvg = (data) => {
        let qrcodeImg = data;
        qrcodeImg = qrcodeImg.replace(/xmlns:xlink/g, 'xmlnsXlink');
        qrcodeImg = qrcodeImg.replace(/xml:space/g, 'xmlSpace');
        qrcodeImg = qrcodeImg.replace(/enable-background/g, 'enableBackground');
        qrcodeImg = qrcodeImg.replace(/shape-rendering/g, 'shapeRendering');
        const buff = new Buffer(qrcodeImg);
        setImgData(buff);
    };

    const downloadQR = () => {
        var gh = document.getElementById('qrCodeD').src;
        var a  = document.createElement('a');
        a.href = gh;
        a.download = 'qrcode.svg';
        a.click()
    };

    const sendMessage = async () => {
        if (validateFields())
            return;
        try {
            setIsLinkSending(true);
            let parsedPhone = phone.charAt(0) === "0" ? phone.replace('0','44') : phone;
            const data = {
                phoneNumber: `+${parsedPhone}`,
                lucieUrl: linkToSend,
                merchant: getUserData().name,
                merchantId: getUserData().merchant_id,
                customer: customer,
                token: token,
                amount,
                type: merchantType === 'charity' ? 'charity' : 'pos',
            };
            await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/send_lucie_link`, data, 'POST');
            setIsLinkSending(false);
            setIsLinkSent('success');
        } catch (e) {
            if(e.response.data.error.includes("To"))
                setError({
                    twilio: "Please enter a valid phone number",
                });
            setIsLinkSending(false);
            setIsLinkSent('failed');
        }
    };
    const copyCodeToClipboard = () => {
        let textField = document.createElement('textarea');
        textField.innerText = linkToSend;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        setIsCopied(true);
    };
    const DonatePage = () => {
        window.open(linkToSend);
    }

    //redeploying
    return (
        <div className="payment-module zero-padding-left zero-padding-right">
            {!isStatus ?
                <div>
                    <div className="qrcode-heading">
                        <h3>{title}</h3>
                    </div>
                    {
                        location.pathname !== '/beamlink' &&
                        <div className="qrcode-innerbox">
                            { merchantType === 'charity' ?
                                <div style= {{textAlign: 'center',position:'relative'}}>
                                    <div className="copy-btn">
                                        <button onClick={copyCodeToClipboard} disabled={!imgData} style={{width:'28px',height:'28px',borderStyle:'none',borderRadius:'4px'}}>
                                            <i className="fas fa-copy cursor-pointer cp-btn"></i>
                                        </button>
                                    </div>
                                    <div className="qrImage" >
                                        <div style={{width: '12rem', margin: '52px auto 0rem'}} id="qrcodeDiv" >
                                            {
                                                imgData ?
                                                    <img id="qrCodeD" src={`data:image/svg+xml;base64,${btoa(imgData)}`} alt="Qr Code"/>
                                                    :
                                                    <div className="img-loader-div">
                                                        <Loader />
                                                    </div>
                                            }
                                        </div>
                                        <div className="btn-flex">
                                            <button className="btn btn-primary btn-ok" onClick={downloadQR} disabled={!imgData}>
                                  <span  className="qrButton">
                                      <GetAppIcon /> &nbsp; &nbsp;<span>Download QR Code</span>
                                  </span>
                                            </button>
                                            <button className="btn btn-primary btn-ok" onClick={DonatePage} disabled={!imgData}>
                                  <span className="qrButton">
                                       <i className="fas fa-donate" style={{fontSize:"20px"}}></i> &nbsp; &nbsp;<span>Donate with <strong>beam.</strong></span>
                                  </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div id='svgCon' style={{width: '12rem', margin: '52px auto 3rem'}}>
                                </div>
                            }

                            {merchantType !== "charity" && <div style={{display: 'flex', justifyContent: 'center'}}>
                                <button onClick={() => redirect()} className="pay-btn" style={{marginTop: '0'}}>
                                    <span>Pay with <strong style={{fontSize: '25px'}}>beam.</strong></span>
                                </button>
                            </div>}
                        </div>
                    }
                    {
                        (location.pathname === '/beamlink' || merchantType === 'charity') &&
                        <div>
                            <div className="qrcode-innerbox">
                                <br/>
                                <div className="phone-field">
                                    <p><label>Phone No</label></p>
                                    <div>
                                        <MobileInput
                                            country="gb"
                                            phone={phone}
                                            setPhone={setPhone}
                                        />
                                    </div>
                                    <p style={{color: 'red'}}>{error.phone ? error.phone : ''}</p>
                                </div>
                                <br/>
                                <div className="phone-field">
                                    <p><label>Customer Name</label></p>
                                    <p>
                                        <input
                                            name="customer"
                                            placeholder="Enter customer name"
                                            value={customer}
                                            type="text"
                                            onChange={(e) => setCustomer(e.target.value)}
                                        />
                                    </p>
                                </div>
                                <br/>
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <button className="pay-btn" onClick={sendMessage}>
                                        {isLinkSending ? <Loader size="2rem" color="secondary"/> : <span>Send {
                                            merchantType === "charity" ? <span><strong>beam.</strong>&nbsp;donation</span> : <strong style={{fontSize: '25px'}}>beam.</strong>
                                        } link</span>}
                                    </button>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'center' }}>
                                    { isLinkSent === 'success' &&
                                    <p style={{color: 'green', margin: '1rem 0'}}>
                                        Payment link successfully sent through sms.
                                    </p>}
                                    { isLinkSent === 'failed' &&
                                    <p style={{color: '#5956e8', textAlign: 'center', margin: '1rem 0', width: 'calc(25vw + 150px)'}}>
                                        {error.twilio ? error.twilio : "Message service is currently down." }
                                        {merchantType === 'charity' ? " Please scan Qr Code to continue." :
                                            " Please scan Qr Code or click 'Pay with Lucie.' button to continue."}
                                    </p>}
                                </div>
                            </div>
                        </div>
                    }
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
            <AlertToast isOpen={isCopied} handleClose={() => setIsCopied(false)} message="copied" />
        </div>
    );
}

export default QRCode;
