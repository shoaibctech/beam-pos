import React, { useState} from "react";

import "react-datepicker/dist/react-datepicker.css";
import './styles.css';

const EditInvoice = ({  step, setStep , setLoading, activeStep, setActiveStep, successStep, setSuccessStep, amount, setAmount, getQrCode}) => {

    const [error, setError] = useState({ amount: '',});

    const validateFields = () => {
        let errors = {...error};
        !amount || (amount === 0 || amount < 0) ? errors.amount = "*Amount is Required" : errors.amount = "";

        setError(errors);
        if( errors.amount  ) {
            return true;
        } else {
            return false;
        }
    };

    const onGetQuote = () => {
        if (validateFields())
            return;

        getQrCode(amount);
        setStep(step + 1);
        setLoading(false);
        setActiveStep(activeStep + 1);
        let ss = {...successStep};
        const nameElement = <span className="parent-tag">
            <span style={{marginRight: '10px'}}><img src={require('../../container/Home/img/money-4.svg')} className="step-img" alt="money" /></span>
            {window.innerWidth > 800 ? <span>You are requesting GBP {parseFloat(amount).toFixed(2)}</span>  : <span>{parseFloat(amount).toFixed(2)} GBP</span>}
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
