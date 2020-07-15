import React, { useState, useEffect} from 'react';
import Modal from "react-modal";
import Loader from "react-loader-spinner";
import {getUserData, makeSecureRequest} from "../../utils";
import { makeStyles } from "@material-ui/core/styles";

Modal.setAppElement('#root')
const customStyles = {
    content : {
        width                 : '80%',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const useStyles = makeStyles({
    root: {
        color: '#09f4c8',
    },
    indicator: {
        color: '#09f4c8'
    }
});

const RefundModal = ({ paymentObj, isOpen, onClose }) => {

    console.log(paymentObj, isOpen, onClose);

    const [refundList, setRefundList] = useState([]);
    const [isFetchingRefundList, setIsFetchingRefundList] = useState(false);
    const [refundLimitError, setRefundLimitError] = useState(false);
    const [refundMessage, setRefundMessage] = useState('');
    const [isRefunding, setIsRefunding] = useState(false);
    const [refundError, setRefundError] = useState('');
    const [refundedValue, setRefundedValue] = useState();
    const [refundIndex, setRefundIndex] = useState();
    const [refundPayment, setRefundPayment] = useState({amount: '', currency: ''});
    const [refundType, setRefundType] = useState('');
    const [amount, setAmount] = useState('');

    const classes = useStyles();

    useEffect(() => {
        sureRefund();
    }, [])
    const refund = async () => {
        if(amount > (refundPayment.amount - refundedValue)){
            setRefundLimitError(true);
        }
        setIsRefunding(true);
        setRefundError('');
        try {
            const refundStatus = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/refund`, {
                paymentId: paymentObj.id,
                amount: refundType === 'full' ? paymentObj.amount : amount,
                currency: paymentObj.currency,
                identification: paymentObj.endToEndIdentification,
                remittanceInformation: paymentObj.remittanceInformation,
                merchantId: getUserData().merchant_id,
            }, 'POST');
            setIsRefunding(false);
            console.log('refund status :', refundStatus);
            setRefundMessage('Your refund request successfully created.');
            getRefundList(refundIndex);
        } catch (e) {
            console.log(e.response.data.error.details[0].description);
            setRefundError(e.response.data.error.details[0].description);
            setIsRefunding(false);
        }
    }

    const closeModal= () => {
        onClose();
        setAmount('');
        setRefundType('');
        setIsRefunding(false);
        setRefundError('');
        setRefundList([]);
        setRefundLimitError(false)
    }

    const renderRefundTable = (data) => {
        return data.map( (payment, idx) => {
            return (   <tr key={idx}>
                <td>{idx}</td>
                <td>{payment.refundAmount}</td>
                <td>{payment.currency}</td>
                <td>{payment.status}</td>
            </tr>);
        });
    }

    const getRefundList = async () => {
        try {
            setIsFetchingRefundList(true);
            const refundData = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/refund-list`, {
                paymentId: paymentObj.id,
                merchantId: getUserData().merchant_id
            }, 'POST');

            if (refundData.data.data.length > 0) {
                console.log('refund list')
                setRefundType('partial');
                setRefundList( prevState => ([...refundData.data.data]));
                calculateRefundAbleAmount(refundData.data.data);
            } else {
                setRefundList( []);
                calculateRefundAbleAmount([]);
            }
            setIsFetchingRefundList(false);
        } catch (e) {
            setIsFetchingRefundList(false);
            console.log('errors ::', e);
        }
    }
    const sureRefund = () => {
        console.log('going to get list of refund amount ')
        setRefundPayment( prevState => ({...prevState, ...paymentObj}));
        getRefundList();
    }
    const calculateRefundAbleAmount = (data) => {
        let amount = 0;
        data && data.map( x => {
            if (x.status === 'REFUND_COMPLETED' || x.status === 'REFUND_PENDING'){
                amount = amount + x.refundAmount;
            }
        });
        setRefundedValue(amount);
    }
    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="modal-container">
                    {
                        !isFetchingRefundList && refundList && refundList.length > 0 ?
                            <div>
                                <h3>Refund Transactions </h3>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Amount</th>
                                        <th>Currency</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/*{ !isFetchingRefundList ? refundList && refundList.length ? renderRefundTable(refundList)*/}
                                    {/*    : <tr rowSpan="4" style={{height: '10rem'}}>*/}
                                    {/*        <td colSpan="8" className="loading">No data found...</td>*/}
                                    {/*    </tr>*/}
                                    {/*    : <tr rowSpan="4" style={{height: '10rem'}}>*/}
                                    {/*        <td colSpan="8" className="loading">Loading...</td>*/}
                                    {/*    </tr>*/}
                                    {/*}*/}
                                    {refundList && refundList.length && renderRefundTable(refundList)}
                                    </tbody>
                                </table>
                            </div>
                            :
                            ''
                    }
                    <h2>Refunding</h2>
                    {
                        !isRefunding &&
                        <div>
                            { !isFetchingRefundList && <p>Maximum refund amount for this transaction: {(refundPayment.amount - refundedValue).toFixed(2)}</p>}
                            <div>
                                <div>
                                    {
                                        !isFetchingRefundList && refundList && refundList.length < 1 &&
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
                                    }
                                    {
                                        isFetchingRefundList &&
                                        <p>Loading...</p>
                                    }
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
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setRefundLimitError(false);
                                        }}
                                        value={amount}/>
                                </div>
                            }
                            {
                                refundType === 'partial' && amount !== '' &&
                                <p>Are you sure you want to refund {amount} {refundPayment.currency}?</p>
                            }
                            {
                                refundLimitError && <p className="error_text">Amount exceeded from maximum allowed amount.</p>
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
                                    Confirm
                                </button>
                            </div>
                            <div>
                                {
                                    refundMessage && <p className="success_message">{refundMessage}</p>
                                }
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

export default RefundModal;