import React, {useEffect, useState} from 'react';
import './styles.css';
import Tick from "../../component/QuoteDetails/img/tick-anim.svg";
import axios from "axios";


const TRANSACTION_FEE = '1.50';
const Callback = (props) => {

    const [isTick, setTick] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({});
    const [isFetching, setIsFetching] = useState(true);

    const getPaymentDetails = async (id) => {
        const req = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment-details`, {
           payment_id: id,
        }, {})
        if(req.data.success){
            setPaymentDetails(req.data.data.results && req.data.data.results[0])
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if(props.location.search.includes('payment_id')){
            let payment_id = props.location.search.substr(12)
            getPaymentDetails(payment_id);
        }
        setTimeout(() => {
            setTick(true);
        }, 1200)
        }, [])

    return (
        <div className="res-div">
            {!isFetching ?
                <React.Fragment>
                    <div className="payment" style={{marginTop: '5rem'}}>
                        <p style={{lineHeight: '25px'}}>
                            You have successfully
                            transfered <strong>{parseFloat(paymentDetails && paymentDetails.amount / 100) + parseFloat(TRANSACTION_FEE)} {' '} {paymentDetails && paymentDetails.currency} {' '} </strong>
                            <br/>
                            to <strong>{paymentDetails && paymentDetails.beneficiary_name}</strong> and the money is on it's way.
                        </p>
                    </div>
                    <div className="payment">
                        {
                            isTick && <img src={Tick} className="complete-tick" alt="tick"/>

                        }
                    </div>
                </React.Fragment>
                :
                <React.Fragment>
                    <div className="payment" style={{marginTop: '5rem'}}>
                        <p style={{lineHeight: '25px'}}>
                            Requesting data Please wait....
                        </p>
                    </div>
                </React.Fragment>
            }
        </div>
    );
}

export default Callback;
