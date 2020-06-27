import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";
import './style.css';
import Loader from "react-loader-spinner";
import {NUAPAY_LIVE_BANKS as banks} from "../../utils/Constants";

const Bank = () => {
    const [loading, setLoading] = useState(false);
    const {org_id, amount, email} = useParams();

    console.log(org_id, amount)

    const createPayment = async (bankId) => {
        try {
            setLoading(true);
            const aspUrl = await axios.post(`${process.env.REACT_APP_NUAPAY_API}/api/selfhost`,
                {
                    orgId: org_id,
                    amount: amount,
                    bankId: bankId,
                    email: email,
                });
            console.log('token ::', aspUrl);
            setLoading(false);
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_self');
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div>
            {loading &&
            <div className="loader">
                <div id="loaderdiv">
                    <Loader type="TailSpin" color="black" height={100} width={100}/>
                </div>
            </div>
            }
            {
                !loading &&
                <div>
                    <h1 style={{textAlign: 'center'}}>Select Bank</h1>
                    <br/>
                    <br/>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {banks.map((bank, index) => (
                            <div key={index} className="list-banks">
                                <img
                                    style={{cursor: 'pointer'}}
                                    className="list-banks-logo"
                                    src={bank.logo}
                                    alt={bank.logo}
                                    onClick={() => createPayment(bank.id)}
                                />
                                <h3>{bank.name}</h3>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}

export default Bank;
