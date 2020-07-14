import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Loader from "react-loader-spinner";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import { getUserData, makeSecureRequest } from "../../utils";

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

const useStyles = makeStyles({
    root: {
        color: '#09f4c8',
    },
    indicator: {
        color: '#09f4c8'
    }
});

const refundTestData = [
    {
        id: "azo4kal13b",
        uri: "/payments/ybo8zayk2q/refunds/azo4kal13b",
        creationDateTime: "2019-02-28T10:43:07.00Z",
        lastUpdateDateTime: "2019-02-28T10:43:07.00Z",
        status: "REFUND_PENDING",
        refundAmount: 1,
        compensationAmount: .01,
        currency: "GBP",
        remittanceInformation: {
            reference: "reference",
            unstructured: "unstructuredRemittanceInfo"
        },
        endToEndIdentification: "endToEndIdentification",
        errorDetails: null
    },
    {
        id: "azo4kal13b",
        uri: "/payments/ybo8zayk2q/refunds/azo4kal13b",
        creationDateTime: "2019-02-28T10:43:07.00Z",
        lastUpdateDateTime: "2019-02-28T10:43:07.00Z",
        status: "REFUND_COMPLETED",
        refundAmount: 1,
        compensationAmount: .01,
        currency: "GBP",
        remittanceInformation: {
            reference: "reference",
            unstructured: "unstructuredRemittanceInfo"
        },
        endToEndIdentification: "endToEndIdentification",
        errorDetails: null
    }
];
const Transactions = () => {
    const [paymentList, setPaymentsList] = useState([]);
    const [transError, setTransError] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [modalIsOpen,setIsOpen] = useState(false);
    const [refundIndex, setRefundIndex] = useState();
    const [refundPayment, setRefundPayment] = useState({amount: '', currency: ''});
    const [refundType, setRefundType] = useState('');
    const [amount, setAmount] = useState('');
    const [isRefunding, setIsRefunding] = useState(false);
    const [refundError, setRefundError] = useState('');
    const [balance, setBalance] = useState([]);
    const [balanceError, setBalanceError] = useState('');
    const [tabValue, setTabValue] = React.useState(0);
    const [refundedValue, setRefundedValue] = useState();
    const [refundList, setRefundList] = useState([]);
    const [isFetchingRefundList, setIsFetchingRefundList] = useState(false);
    const [refundLimitError, setRefundLimitError] = useState(false);


    const classes = useStyles();

    useEffect( () => {
        getPaymentsList();
        getBalance();
    }, []);

    const getPaymentsList = async () => {
        setIsFetching(true);
        setTransError('');
        try {
            const paymentList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payments`,
                {email: getUserData().email}, 'POST' );

            console.log('ffffffffffffffffffffffff', paymentList.data.paymentList)
            setIsFetching(false);
            setPaymentsList( prevState => ({...prevState, ...paymentList.data.paymentList}));
        } catch (e) {
            console.log('transssssssssssssssssssssss ', e);
            setIsFetching(false);
            setTransError('Transaction request failed...')
        }

    }

    const getCreditTransferList = async (merchantId) => {
        setIsFetching(true);
        setTransError('');
        try {
            const paymentList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payments/credit_transfer`,
                {merchantId: merchantId}, 'POST' );

            console.log('ccccccccccccccccccccccccc', paymentList.data.paymentList)
            setIsFetching(false);
            setPaymentsList( prevState => ({...prevState, ...paymentList.data.paymentList}));
        } catch (e) {
            console.log('transssssssssssssssssssssss ', e);
            setIsFetching(false);
            setTransError('With draw transaction list request failed...')
        }

    }

    const getRefundPaymentsList = async () => {
        setIsFetching(true);
        setTransError('');
        try {
            const paymentList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payments`,
                {email: getUserData().email}, 'POST' );

            console.log('ffffffffffffffffffffffff', paymentList.data.paymentList)
            setIsFetching(false);
            setPaymentsList( prevState => ({...prevState, ...paymentList.data.paymentList}));
        } catch (e) {
            console.log('transssssssssssssssssssssss ', e);
            setIsFetching(false);
            setTransError('Refund transaction request failed...')
        }
    }

    const getBalance = async () => {
        setBalanceError('');
        try{
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/balance/${getUserData().merchant_id}`, {}, 'GET');
            setBalance(req.data.balances.data);
        } catch (e) {
            setBalanceError('Balance Fetching failed...');
        }

    }

    const sureRefund = (index) => {
        console.log('going to get list of refund amount ')
        setIsOpen(true);
        setRefundIndex(index);
        setRefundPayment( prevState => ({...prevState, ...paymentList.data[index]}));
        getRefundList(index);
    }
    const refund = async () => {

        if(amount > (refundPayment.amount - refundedValue)){
            setRefundLimitError(true);
        }
        console.log('going to refund', refundPayment);
        setIsRefunding(true);
        setRefundError('');
        try {
            const refundStatus = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/refund`, {
                paymentId: paymentList.data[refundIndex].id,
                amount: refundType === 'full' ? paymentList.data[refundIndex].amount : amount,
                currency: paymentList.data[refundIndex].currency,
                identification: paymentList.data[refundIndex].endToEndIdentification,
                remittanceInformation: paymentList.data[refundIndex].remittanceInformation,
                merchantId: getUserData().merchant_id,
            }, 'POST');
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
        setRefundList([]);
        setRefundLimitError(false)
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
                    <button className="btn-refund" onClick={() => sureRefund(idx)} disabled={payment.status !== 'PAYMENT_RECEIVED'}>Refund</button>
                </td>
            </tr>);
        });
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
    const createCreditTransfer = async () => {
        try {
            console.log('creating credit transfer ');
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/credit/transfer`, {
                amount: 100,
                currency: 'GBP',
                merchantId: getUserData().merchant_id,
            }, 'POST');

            console.log('data ::', req.data.data);

        } catch (e) {
            console.log("error ::", e.response)
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if(newValue === 0){
            getPaymentsList();
        } else if(newValue === 1) {
            getCreditTransferList(getUserData().merchant_id);
            console.log('new Value', newValue);
        }
    };

    const getRefundList = async (index) => {
        try {
            setIsFetchingRefundList(true);
            const refundData = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/refund-list`, {
                paymentId: paymentList.data[index].id,
                merchantId: getUserData().merchant_id
            }, 'POST');

            console.log('refund data ::', refundData.data.data);
            if (refundData.data.data.length > 0) {
                console.log('refund list')
                setRefundType('partial');
                setRefundList( prevState => ([...prevState, ...refundData.data]));
                calculateRefundAbleAmount(refundData.data);
            } else {
                setRefundType('partial');
                console.log('refun test data ', refundTestData)
                setRefundList( prevState => ([...prevState, ...refundTestData]));
                calculateRefundAbleAmount(refundTestData);
            }
            setIsFetchingRefundList(false);
        } catch (e) {
            setIsFetchingRefundList(false);
            console.log('errors ::', e);
        }
    }
    const calculateRefundAbleAmount = (data) => {
        let amount = 0;
        data.map( x => {
            if (x.status === 'REFUND_COMPLETED' || x.status === 'REFUND_PENDING'){
                amount = amount + x.refundAmount;
            }
        });
        console.log('refunded ::', amount);
        setRefundedValue(amount);
    }

    console.log('data refund list::', refundList)
    return (
        <div className="transaction">
           <div className="tabs-balance">
               <Paper square >
                   <Tabs
                       value={tabValue}
                       indicatorColor="primary"
                       textColor="primary"
                       onChange={handleTabChange}
                       aria-label="disabled tabs example"
                   >
                       <Tab label="Payments" />
                       <Tab label="With Draws" />
                   </Tabs>
               </Paper>
               <div className="balance-con">
                   <div className="balance-sec">
                       <p className="balance-label">BALANCE: {' '}</p>
                       {
                           balanceError ?
                               <p className="t-error">{balanceError}</p>
                               :
                               <p>
                                   {balance && balance.length > 0 ?
                                       <span className="balance">{balance[1].balance.amount} { balance[1].balance.currency}</span>:
                                       "loading..."}
                               </p>
                       }
                   </div>
               </div>
           </div>
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
                { !transError ? !isFetching ? paymentList && paymentList.data && paymentList.data.length > 0 ? renderTable(paymentList.data)
                    : <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading">No data found...</td>
                    </tr>
                    : <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading">Loading...</td>
                    </tr> :''
                }
                {
                    !isFetching && transError &&
                    <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading"><span className="t-error">{transError}</span></td>
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
                    {
                        refundList && refundList.length > 0 ?
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
                                        refundList && refundList.length < 0 &&
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
