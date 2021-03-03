import React from 'react';
import './styles.css';

const QrCodeWindow = ({qrCodeImg}) =>  {

    const hidePopUp = () => {
        document.getElementById('pop-block').style.display = 'none';
    }

    return (
        <div className="hover_bkgr_fricc main-div" id="pop-block" onClick={hidePopUp}>
            <span className="helper"></span>
               <div className="set-popup">

                   <div className="popupCloseButton" onClick={hidePopUp}>&times;</div>
                   <span className="qr-page">Scan QR code with your mobile for rapid checkout directly from your banking app. Or alternatively, click 'Continue' to checkout via your online banking website.</span>


                      <div className="bank-qr-code qr-set qr-border">
                              <img id="qrCodeD" src={`data:image/svg+xml;base64,${btoa(qrCodeImg)}`} alt="Qr Code"/>
                  </div>
                   <div className="or-div set-or-div">
                       <hr className="or-hr set-or" />
                       <span className="or">OR</span>
                       <hr className="or-hr set-or"/>
                   </div>
                   <button className="confirm-btn size-btn">Continue</button>
               </div>
           </div>
    );
}

export default QrCodeWindow;