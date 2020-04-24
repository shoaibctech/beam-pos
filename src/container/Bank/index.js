import React from 'react';
import { useParams, Route } from 'react-router-dom';
import axios from "axios";
import './style.css';

const Bank = () => {
    const {org_id, amount} = useParams();

    console.log(org_id, amount)

    const createPayment = async (bankId) => {
        try {
            const aspUrl = await axios.post(`${process.env.REACT_APP_NUAPAY_API}/api/selfhost`,
                {
                    orgId: org_id,
                    amount: amount,
                    bankId: bankId
                });
            console.log('token ::', aspUrl);
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_blank');
        } catch (e) {
            console.log(e);
        }
    }
    return(
        <div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div>
                    <h1>Select Bank</h1>
                    <br/>
                    <br/>
                    <img
                        className="bnk_links"
                        src="https://www.nuapay.com/wp-content/uploads/2018/04/nuapay.svg"
                        alt="NUAPAY ASPSP"
                        onClick={() => createPayment('8ow24y2pdx')}
                    />
                    <br/>
                </div>
            </div>
        </div>
    );
}

export default Bank;
