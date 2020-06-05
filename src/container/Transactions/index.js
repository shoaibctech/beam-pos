import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

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
    const [refundPayment, setRefundPayment] = useState({amount: '', currency: ''})

    useEffect( () => {
        getPaymentsList();
    }, []);

    const getPaymentsList = async () => {
        setIsFetching(true);
        const paymentList = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/listpayments`);
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
        const refundStatus = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refundpayment`, {
            paymentId: paymentList.data[refundIndex].id,
            amount: paymentList.data[refundIndex].amount,
            currency: paymentList.data[refundIndex].currency,
            identification: paymentList.data[refundIndex].endToEndIdentification,
            remittanceInformation: paymentList.data[refundIndex].remittanceInformation,

        });
        console.log('refund status :', refundStatus);
    }
    const closeModal= () => {
        setIsOpen(false);
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
            <h2>Transactions Details</h2>
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
                    : <tr rowspan="4" style={{height: '10rem'}}>
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
                <h4>Are you sure you want to refund {refundPayment.amount} {refundPayment.currency}.</h4>

                <br/>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={() => closeModal()}>
                        Cancel
                    </button>
                    <button className="btn-ok" onClick={() => refund()}>
                        Refund
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Transactions;