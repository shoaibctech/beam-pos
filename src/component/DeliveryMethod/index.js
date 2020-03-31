import React from 'react';
import './styles.css';
import { withStyles } from '@material-ui/core/styles';
import {grey } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';

const GreenRadio = withStyles({
    root: {
        color: grey[400],
        '&$checked': {
            color: grey[600],
        },
    },
    checked: {},
})(props => <Radio color="secondary" {...props} />);

const DeliveryMethod = ({method, setMethod, step, setStep, activeStep, setActiveStep}) => {

    const nextStep = () => {
        setStep(step + 1);
        setActiveStep(activeStep + 1)
    }
    return (
        <div className="delivery-method">
            <div className="delivery-row">
                <h3>How would you like the currency to be delivered</h3>
            </div>
            <br/>
            <div className="delivery-row">
                <div>
                    <Radio
                        checked={method === 'card'}
                        onChange={ () => setMethod("card")}
                        value="card"
                        name="delivery-method"
                        color="secondary"
                    />
                    Card
                    {/*<input type="radio" name="delivery-method" value="card" checked={method === "card"} onChange={() => setMethod("card")}/>  Card*/}
                </div>
                <br/>
                <div>
                    <Radio
                        checked={method === 'bank'}
                        onChange={() => setMethod("bank")}
                        value="bank"
                        name="delivery-method"
                        color="secondary"
                    />
                    Bank
                    {/*<input type="radio" name="delivery-method" value="bank" checked={method === "bank"} onChange={() => setMethod("bank")}/>  Bank Account*/}
                </div>
            </div>
            <br/>
            <div className="delivery-row">
                <button className="confirm-btn" onClick={nextStep}>Next</button>
            </div>
        </div>
    );
}

export default DeliveryMethod;
