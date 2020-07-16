import React, { useState } from 'react';
import Modal from 'react-modal';
import Input from "../UI/Input";
import Loader from "react-loader-spinner";
import { makeSecureRequest, getUserData } from "../../utils";


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
    const [amount, setAmount] = useState(0);
    const [isFetching, setIsFetcing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [amountExeedError, setAmountExeedError] = useState(false);

    const onClose = () => {
        setIsOpen(false);
        setIsFetcing(false);
        setError('');
        setMessage('');
        setAmountExeedError(false);
        setAmount(0);
    }
    const createCreditTransfer = async () => {
        if(amount > balance){
            setAmountExeedError(true);
            return;
        }
        setIsFetcing(true);
        try {

            const data = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/credit_transfer`,
                {
                    merchantId: getUserData().merchant_id,
                    amount
                }, 'POST');

            console.log('data :: ', data);
            setMessage('successfully created credit transfer');
            setIsFetcing(false);
            getBalance();
            setAmount(0);
        } catch (e) {
            setIsFetcing(false);
            setError('There is error while creating credit transfer. Please try again later...');
        }
    }
    return(
        <div style={{width: '10rem', paddingBottom: '10px'}}>
            <button className="btn-refund" onClick={() => setIsOpen(true)} disabled={isBalance}>
                Withdraw
            </button>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                style={customStyles}
                contentLabel="Withdraw Modal"
            >
                <div className="modal-container-with-draw">
                    <h2>Withdraw</h2>
                    <p>Maximum amount that can be withdrawn is {balance} {currency}</p>
                    {
                        !isFetching &&
                        <div>
                            <Input
                                value={amount}
                                handleChange={setAmount}
                                placeholder="Enter value"
                                type="number"
                                className="with-draw-input"
                            />
                        </div>
                    }
                    {amountExeedError && <p className="error_text">Credit transfer amount must not exceed from {balance}.</p>}
                    <div>
                        {
                            isFetching &&
                            <div className="loader-footer">
                                <Loader type="TailSpin" color="black" height={100} width={100}/>
                            </div>
                        }
                    </div>
                    {
                        !isFetching &&
                        <div>
                            <button className="btn-cancel" onClick={onClose}>Cancel</button>
                            <button
                                className="btn-ok"
                                onClick={createCreditTransfer}
                                disabled={isFetching || !( amount > 0) || !!error}
                            >
                                With Draw
                            </button>
                        </div>
                    }

                    <div>
                        { error && <p className="error_text">{error}</p>}
                        { message && <p className="success_message">{message}</p>}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default WithdrawForm;