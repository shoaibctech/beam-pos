import React from "react";
import './styles.css';
import QRCode from "../../component/QRCode";


const Charity = () => {
    return(
        <div className="charity-container">
            <QRCode
                title="You can scan the QR code or just download it!"
                link={''}
                isStatus={false}
                statusData={{}}
                amount={1}
                merchantType='charity'
            />
        </div>
    )
}

export default Charity;
