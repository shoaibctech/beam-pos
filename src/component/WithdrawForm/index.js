import React, { useState } from 'react';
import Modal from 'react-modal';
import Input from "../UI/Input";
import { makeSecureRequest, getUserData } from "../../utils";
import Loader from '../UI/Loader';
import './styles.css';


Modal.setAppElement('#root');
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const WithdrawForm = ({balance, currency, isBalance, getBalance}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [amountExceedError, setAmountExceedError] = useState(false);

    const onClose = () => {
        setIsOpen(false);
        setIsFetching(false);
        setError('');
        setMessage('');
        setAmountExceedError(false);
        setAmount(0);
    }
    const createCreditTransfer = async () => {
        if(amount > balance){
            setAmountExceedError(true);
            return;
        }
        if (!getUserData().beneficiary_id) {
            setMessage('No beneficiary details found. Please contact martinjburt@gmail.com for further assistance ');
            return;
        }
        setIsFetching(true);
        try {

            const data = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/credit_transfer`,
                {
                    merchantId: getUserData().merchant_id,
                    beneficiaryId: getUserData().beneficiary_id,
                    amount
                }, 'POST');

            setMessage('Your request for credit transfer has been submitted successfully.');
            setIsFetching(false);
            getBalance();
            setAmount(0);
        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.message);
            } else {
                setError('There is error while creating credit transfer. Please try again later...');
            }
            setIsFetching(false);
        }
    }
    return(
        <div className="btn-withdraw-block">
            <button className="btn-withdraw" onClick={() => setIsOpen(true)} disabled={isBalance}>
                Withdraw
            </button>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                style={customStyles}
                contentLabel="Withdraw Modal"
            >
                <div className="modal-container-with-draw">
                    { !message && !isFetching && <h2 className="withdraw-heading">Withdraw</h2>}
                    {
                        !isFetching && !message &&
                        <>
                            <p style={{paddingBottom: '1rem'}}>Maximum amount that can be withdrawn is {balance && balance.toFixed(2)} {currency}</p>
                            <div>
                                <Input
                                    value={amount}
                                    handleChange={setAmount}
                                    placeholder="Enter value"
                                    type="number"
                                    className="with-draw-input"
                                />
                            </div>
                        </>
                    }
                    {amountExceedError && <p className="error_text">Credit transfer amount must not exceed from {balance.toFixed(2)}.</p>}
                    <div>
                        {
                            isFetching && !message &&
                            <div className="loader-footer">
                                <Loader />
                                <p>Connecting...</p>
                            </div>
                        }
                    </div>
                    {
                        !isFetching && !message &&
                        <div className="withdraw-btn-section">
                            <button className="btn-cancel" onClick={onClose}>Cancel</button>
                            <button
                                className="btn-ok"
                                onClick={createCreditTransfer}
                                disabled={isFetching || !( amount > 0) || !!error}
                            >
                                Withdraw
                            </button>
                        </div>
                    }

                    <div>
                        { error && <p className="error_text">{error}</p>}
                    </div>
                    { message &&
                    <div className="success_msg_blk">
                        <p className="success_message" style={{  margin: '20px'}}>{message}</p>
                        <button className='btn-cancel' onClick={onClose}>Close</button>
                    </div>
                    }
                </div>
            </Modal>
        </div>
    );
}

export default WithdrawForm;
