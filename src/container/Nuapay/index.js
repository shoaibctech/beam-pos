import React  from "react";
import axios from "axios";

const Nuapay = () => {
    // const [token, setToken] = useState('');
    // const [paymentId, setPaymentId] = useState('');
    //
    // const id = '3lbyjvpdbd';
    const getToken = async () => {
        try {
            const token = await axios.get(`${process.env.REACT_APP_NUAPAY_API}/api/payment/checkout`);
            console.log('token ::', token);
            // setPaymentId(token.data.paymentData.id);
            // setToken(token.data);
        } catch (e) {
            console.log(e);
        }

    }
    return(
        <div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {
                    <button onClick={() => getToken()} className="pay-btn">
                        Get Nuapay Token
                    </button>
                }
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {
                    <button className="btn btn-primary"
                       onClick={ () => window.NuapayOpenBanking.showUI('3lbyjvpdbd', 'https://sandbox.nuapay.com/tpp-ui/')}
                    >
                        Pay Now
                    </button>
                }
            </div>
        </div>
    );
};

export default Nuapay;
