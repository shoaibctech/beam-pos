import React from "react";
import './styles.css';
import QRCode from "../../component/QRCode";


const Charity = () => {
    return(
        <div className="charity-container">
            <QRCode
                title="You can Scan the QR Code or just download it!"
                link={'https://tinyurl.com/yyaxqazf?merchant_name=Test'}
                isStatus={false}
                statusData={{}}
                amount={1}
                merchantType='charity'
            />
        </div>
    )
}

export default Charity;
