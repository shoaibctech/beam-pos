import React, { useState } from 'react';
import { useParams, Route } from 'react-router-dom';
import axios from "axios";
import './style.css';
import Loader from "react-loader-spinner";

const Bank = () => {
    const [loading, setLoading] = useState(false);
    const {org_id, amount} = useParams();

    console.log(org_id, amount)

    const createPayment = async (bankId) => {
        try {
            setLoading(true);
            const aspUrl = await axios.post(`${process.env.REACT_APP_NUAPAY_API}/api/selfhost`,
                {
                    orgId: org_id,
                    amount: amount,
                    bankId: bankId
                });
            console.log('token ::', aspUrl);
            setLoading(false);
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_blank');
        } catch (e) {
            console.log(e);
        }
    }
    return(
        <div>
            {   loading &&
            <div className="loader">
                <div id="loaderdiv">
                    <Loader type="TailSpin" color="black" height={100} width={100}/>
                </div>
            </div>
            }
            {
                !loading &&
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div>
                        <h1>Select Bank</h1>
                        <br/>
                        <br/>
                        <img
                            style={{cursor: 'pointer'}}
                            className="bnk_links"
                            src="https://www.nuapay.com/wp-content/uploads/2018/04/nuapay.svg"
                            alt="NUAPAY ASPSP"
                            onClick={() => createPayment('8ow24y2pdx')}
                        />
                        <br/>
                    </div>
                </div>
            }
        </div>
    );
}

export default Bank;
