import React from 'react';
import '../Payment/styles.css';

const QRCode = ({link}) => {
    const redirect = () => {
        console.log(link)
        window.open(link, '_blank');
    }
    return (
        <div className="payment-module">
            <div id='svgCon' style={{    width: '12rem', margin: '3rem auto'}}>
            </div>
            <br/>
            <div style={{display: 'flex', justifyContent: 'center' }}>
                {
                    <button onClick={() => redirect()} className="pay-btn">
                        Pay
                    </button>
                }
            </div>
        </div>
    );
}

export default QRCode;
