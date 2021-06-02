import React from 'react';
import AntiClockLoader from '../../component/UI/AnitClockLoader';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './styles.css';

const QrCodeWindow = ({qrCodeImg, handleSelectedBank, handleContinuePayment, isPaymentProcessing, clearLoading}) =>  {

    const hidePopUp = () => {
        handleSelectedBank('');
        clearLoading();
        document.getElementById('pop-block').style.display = 'none';
    }

    return (
        <div className="hover_bkgr_fricc" id="pop-block">
            <span className="helper"></span>
               <div className="set-popup">
                   <div className="popupCloseButton" onClick={hidePopUp}>
                       <ArrowBackIcon />
                   </div>
                   <h3 className="qr-page">Authorise your payment</h3>

                   <div className="qr_code_section">
                       <div>
                           {
                               !isPaymentProcessing &&
                               <div>
                                   <h3 className="message-qrcode-top">Use your phone camera</h3>
                                   <div className="overlay-qr-code qr-set">
                                       <img id="qrCodeD" src={`data:image/svg+xml;base64,${btoa(qrCodeImg)}`} alt="Qr Code"/>
                                   </div>
                                   <h3 className="message-qrcode-bottom">To authorise via your <br/> mobile banking app</h3>
                               </div>
                           }
                           {
                               isPaymentProcessing &&
                                   <div className="process-section">
                                       <AntiClockLoader
                                           color="black"
                                           message="Payment in progress"
                                       />
                                   </div>
                           }

                           <div className="qr-code-or-container">
                               <hr className="or-line"/>
                               <span className="or-content" >Or</span>
                               <hr className="or-line"/>
                           </div>
                           <button className="btn login-bank-btn" onClick={handleContinuePayment}>Login to your bank</button>
                       </div>
                   </div>
               </div>
           </div>
    );
}

export default QrCodeWindow;