import React, { useState} from "react";

import "react-datepicker/dist/react-datepicker.css";
import './styles.css';

const EditInvoice = ({  step, setStep , setLoading, activeStep, setActiveStep, successStep, setSuccessStep, setUser, getQrCode}) => {

    const [amount, setAmount] = useState( '')
    const [error, setError] = useState({ amount: '',});

    const validateFields = () => {
        let errors = {...error}
        !amount || amount < 1 ? errors.amount = "*Amount is Required" : errors.amount = "";

        setError(errors);
        if( errors.amount  ) {
            return true;
        } else {
            return false;
        }
    }

    const onGetQuote = () => {
        getQrCode();
        if (validateFields())
            return;

        setUser({ amount});
        setStep(step + 1);
        setLoading(false);
        setActiveStep(activeStep + 1)
        let ss = {...successStep};
        const nameElement = <span className="parent-tag">
            <span style={{marginRight: '10px'}}><img src={require('../../container/Home/img/money-4.svg')} className="step-img" alt="money" /></span>
            <span>You are requesting GBP {amount}</span>
        </span>;
        const confimElement = <span className="parent-tag">
            <span style={{marginRight: '10px'}}><img src={require('../../container/Home/img/confirm-4.svg')} className="step-img" alt="money" /></span>
            <span>Confirm</span>
        </span>;
        ss[0] = nameElement;
        ss[1] = confimElement;
        setSuccessStep(ss);
    }

    return (
        <section className="edit-container">
            <div>
                <br />
                <div className="edit-field-row">
                    <p><label>Amount</label></p>
                    <p><input name="amount" placeholder="Enter Amount" value={amount} type="text" onChange={(e) => setAmount(e.target.value)}/></p>
                    <p style={{color: 'red'}}>{error.amount ? error.amount: ''}</p>
                </div>
                <br />
                <br />
                <div className="edit-field-btn">
                    <button style={{width: '100%'}} className="confirm-btn" onClick={onGetQuote}>Save</button>
                </div>
            </div>
        </section>
    );
}
export default EditInvoice;
