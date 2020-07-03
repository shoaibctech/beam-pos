import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";
import './style.css';
import Loader from "react-loader-spinner";
import {NUAPAY_LIVE_BANKS as banks} from "../../utils/Constants";

const Bank = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useParams();

    const createPayment = async (bankId) => {
        try {
            setLoading(true);
            setError('');
            const aspUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment/selfhost`,
                {
                    bankId: bankId,
                    token: token,
                });
            // setLoading(false);
            window.open(aspUrl.data.paymentData.aspspAuthUrl, '_self');
        } catch (e) {
            console.log(e);
            console.log(e.response);
            console.log(e.response.data);
            setLoading(false);
            setError(e.response.data.message);
            window.scrollTo(0, 0);
        }
    }
    return (
        <div>
            {loading &&
            <div className="loader">
                <div id="loaderdiv">
                    <Loader type="TailSpin" color="black" height={100} width={100}/>
                </div>
                <div>
                    <p>Redirecting...</p>
                </div>
            </div>
            }
            {
                error &&
                <div className="error-block">
                    <h2 className="t-error" style={{textAlign: 'center'}}>{error}</h2>
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
