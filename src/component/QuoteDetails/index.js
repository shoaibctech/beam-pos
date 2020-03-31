import React, { useState} from 'react';
import './styles.css';
// import '../EditInvoice/styles.css';
import axios from 'axios';
import Timer from '../../Utils/CountDownTimer';
import Clock from './img/clock11.png';


const QuoteDetails = ({quoteData, step, setStep, activeStep, setActiveStep, setLoading, user, setResData, successStep, setSuccessStep, TRANSACTION_FEE }) =>  {

    const [isExpire, setIsExpire] = useState(false)
    const [key, setKey] = useState('');
    const [error, setError] = useState({key: ''});

    const validate = () => {
        if(!key){
            setError({key: 'Key is required'});
            return false;
        } else {
            setError({key: ''});
            return true;
        }
    }
    const createConversion = () => {
        if (!validate()){
            return;
        }
        setLoading(true);
        axios.post('https://devapi.currencycloud.com/v2/conversions/create',
            {
                "buy_currency": quoteData.client_buy_currency,
                "sell_currency": quoteData.client_sell_currency,
                "amount": quoteData.client_buy_amount,
                "fixed_side": 'buy',
                "term_agreement": true,
                "conversion_date": quoteData.settlement_cut_off_time,
            },
            {
                headers: {'X-Auth-Token': localStorage.getItem('auth_token')}
            }
        ).then(res => {
            let message = 'You  pay ' + quoteData.client_buy_amount + ' ' + quoteData.client_buy_currency;
            const currencyElement = <span className="parent-tag">
                <span style={{marginRight: '10px'}}><img src={require('../../container/Home/img/money.svg')} className="step-img" alt="money" /></span>
                <span>{message}</span>
            </span>;
            let ss = {...successStep};
            ss[2] = currencyElement;
            setSuccessStep(ss);
            setResData(res.data);
            setStep(step + 1);
            setLoading(false);
            setActiveStep(activeStep + 1)

        }).catch(err => {

            //todo show error
            setLoading(false);
        });
    }
    return (
        <section className="quote-detail">
            <div className="quote-head">
                <div className="quote-head-content">
                    <div>
                        <p style={{fontSize: 'small', marginBottom: '4px'}}>Your Rate</p>
                        <h3>1 GPB = {quoteData.core_rate} {' '} {quoteData.client_buy_currency} </h3>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        Rate expires in: <Timer setIsExpire={setIsExpire}  isExpire={isExpire}/> {' '}<img src={Clock} alt="clock" style={{marginLeft: '10px'}} />
                    </div>
                </div>
            </div>
            <div>
                <br />
                <div className="quote-table">
                    <div className="quote-row">
                        <p>You pay</p>
                        <div className="input-div">
                            <p>{quoteData.client_buy_amount}</p>
                            <p>{quoteData.client_buy_currency}</p>
                        </div>
                    </div>
                    <div className="quote-row">
                        <p>You gets</p>
                        <div className="input-div">
                            <p>{quoteData.client_sell_amount}</p>
                            <p>GBP</p>
                        </div>
                    </div>
                </div>
                {/*<div style={{ marginTop: '36px'}}>*/}
                {/*    <div className="quote-table quote-row-total">*/}
                {/*        <span>Fee: </span>*/}
                {/*        <span>{TRANSACTION_FEE} GBP</span>*/}
                {/*    </div>*/}
                {/*    <div className="quote-table quote-row-total">*/}
                {/*        <span>Total to Pay: </span>*/}
                {/*        <span>{parseFloat(quoteData.client_sell_amount) + parseFloat(TRANSACTION_FEE)} {' '} {quoteData.client_sell_currency}</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <br/>
                <div className="edit-field-row-q">
                    <p><label>Key</label></p>
                    <p><input name="key" placeholder="Enter key ..." value={key} type="text" onChange={(e) => setKey(e.target.value)}/></p>
                    <p style={{color: 'red'}}>{error.key ? error.key: ''}</p>
                </div>
                <br />
                <br />
                <div className="quote-row-btn">
                    <button className="confirm-btn" onClick={createConversion} disabled={quoteData.client_sell_amount < 100 || isExpire }>Confirm</button>
                </div>
                <div style={{textAlign: 'center', marginTop: '1rem', marginBottom: '1rem'}}>
                    {quoteData.client_sell_amount < 100  && <p style={{color: 'red'}}>
                        Converted amount should be greater than 100 GBP.
                    </p>}
                </div>

            </div>
        </section>
    );
}

export default QuoteDetails;
