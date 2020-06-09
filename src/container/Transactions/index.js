import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Loader from "react-loader-spinner";
import { getUserData } from "../../utils";

import './styles.css';

Modal.setAppElement('#root')
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
const Transactions = () => {
    const [paymentList, setPaymentsList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [modalIsOpen,setIsOpen] = useState(false);
    const [refundIndex, setRefundIndex] = useState();
    const [refundPayment, setRefundPayment] = useState({amount: '', currency: ''});
    const [refundType, setRefundType] = useState('');
    const [amount, setAmount] = useState('');
    const [isRefunding, setIsRefunding] = useState(false);
    const [refundError, setRefundError] = useState('')

    useEffect( () => {
        getPaymentsList();
        console.log('data ::', getUserData());
    }, []);

    const getPaymentsList = async () => {
        setIsFetching(true);
        const paymentList = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/listpayments`);
        console.log(paymentList.data.paymentList)
        setPaymentsList( prevState => ({...prevState, ...paymentList.data.paymentList}));
        setIsFetching(false);
    }

    const sureRefund = (index) => {
        setIsOpen(true);
        setRefundIndex(index);
        setRefundPayment( prevState => ({...prevState, ...paymentList.data[index]}));
    }
    const refund = async () => {
        console.log('going to refund', refundPayment);
        setIsRefunding(true);
        setRefundError('');
        try {
            const refundStatus = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refundpayment`, {
                paymentId: paymentList.data[refundIndex].id,
                amount: refundType === 'full' ? paymentList.data[refundIndex].amount : amount,
                currency: paymentList.data[refundIndex].currency,
                identification: paymentList.data[refundIndex].endToEndIdentification,
                remittanceInformation: paymentList.data[refundIndex].remittanceInformation,

            });
            setIsRefunding(false);
            console.log('refund status :', refundStatus);
        } catch (e) {
            setRefundError('Payment refund failed. Please try again later...');
            setIsRefunding(false);
        }
    }
    const closeModal= () => {
        setIsOpen(false);
        setAmount('');
        setRefundType('');
        setIsRefunding(false);
        setRefundError('');
    }
    const renderTable = (data) => {
        return data.map( (payment, idx) => {
            return (   <tr key={idx}>
                <td>{idx}</td>
                <td>{payment.email}</td>
                <td>{payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{payment.status}</td>
                <td>{payment.countryCode}</td>
                <td>{payment.debtorBankName}</td>
                <td>
                    <button className="btn-refund" onClick={() => sureRefund(idx)} disabled={payment.status !== 'SETTLEMENT_COMPLETE'}>Refund</button>
                </td>
            </tr>);
        });
    }
    return (
        <div className="transaction">
            <h2 className="heading">Transactions Details</h2>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Country Code</th>
                    <th>Bank Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                { !isFetching ? paymentList && paymentList.data && paymentList.data.length > 0 ? renderTable(paymentList.data)
                    : <tr>
                        <td>No data found...</td>
                    </tr>
                    : <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading">Loading...</td>
                    </tr>
                }
                </tbody>
            </table>
            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="modal-container">
                    <h2>Refunding</h2>
                    {
                        !isRefunding &&
                        <div>
                            <div>
                                <div>
                                    <div>
                                        Refund type:
                                        <label className="refund-radio-label">
                                            <input
                                                className="refund-radio-btn"
                                                type="radio"
                                                value="full"
                                                checked={refundType === 'full'}
                                                onChange={ ()=> setRefundType('full')}
                                            />
                                            Full
                                        </label>
                                        <label className="refund-radio-label">
                                            <input
                                                className="refund-radio-btn"
                                                type="radio"
                                                value="partial"
                                                checked={refundType === 'partial'}
                                                onChange={ ()=> setRefundType('partial')}
                                            />
                                            Partial
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {
                                refundType === 'full' &&
                                <h4>Are you sure you want to refund {refundPayment.amount} {refundPayment.currency}.</h4>
                            }
                            {
                                refundType === 'partial' &&
                                <div>
                                    <input
                                        placeholder="Enter amount"
                                        type="number"
                                        onChange={(e) => setAmount(e.target.value)}
                                        value={amount}/>
                                </div>
                            }
                            {
                                refundType === 'partial' && amount !== '' &&
                                    <p>Are you sure you want to refund {amount} {refundPayment.currency}?</p>
                            }
                            <br/>
                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => closeModal()}>
                                    Cancel
                                </button>
                                <button
                                    className="btn-ok"
                                    onClick={() => refund()}
                                    disabled={!refundType || (refundType === 'partial' && amount === '')}
                                >
                                    Refund
                                </button>
                            </div>
                        </div>
                    }
                    {
                        isRefunding &&
                        <div className="loader-footer">
                            <Loader type="TailSpin" color="black" height={100} width={100}/>
                        </div>
                    }
                    {
                        refundError &&
                            <p className="t-error">{refundError}</p>
                    }
                </div>
            </Modal>
        </div>
    );
}

export default Transactions;
