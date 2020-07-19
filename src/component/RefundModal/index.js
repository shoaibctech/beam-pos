import React, { useState, useEffect, Fragment } from 'react';
import Modal from "react-modal";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Cancel } from "@material-ui/icons";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orderBy } from 'lodash';
import moment from "moment";
import Loader from "../UI/Loader";

import './styles.css';

import {getUserData, makeSecureRequest} from "../../utils";

Modal.setAppElement('#root')
const customStyles = {
    content : {
        width                 : '60%',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};


const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgba(9, 244, 200, 1)'
        },
        // secondary: {
        //     main: green[500],
        // },
    },
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
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        sureRefund();
    }, []);

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
            setRefundMessage('Your refund request successfully created.');
            getRefundList(refundIndex);
            setAmount('')
        } catch (e) {
            console.log(e.response.data.error.details[0].description);
            setRefundError(e.response.data.error.details[0].description);
            setIsRefunding(false);
            setAmount('');
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
                <td>{idx + 1}</td>
                <td>{payment.refundAmount}</td>
                <td>{payment.currency}</td>
                <td>{payment.status}</td>
                <td>{moment(payment.creationDateTime).format('YYYY-MM-DD hh:mm')}</td>
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
                const sortedData = orderBy(refundData.data.data, ['creationDateTime'], ['desc'])
                setRefundList( prevState => ([...sortedData]));
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
        setRefundPayment( prevState => ({...paymentObj}));
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
                <Fragment>
                    <div className="modal-close-btn" >
                       <Cancel fontSize='large' onClick={closeModal} />
                    </div>
                    <div className="modal-container">

                        <Paper square>
                            <ThemeProvider theme={theme}>
                                <Tabs
                                    value={tabValue}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={handleTabChange}
                                    aria-label="Refund Tabs"
                                >
                                    <Tab label="Refund Transactions" />
                                    <Tab label="Refund" />
                                </Tabs>
                            </ThemeProvider>
                        </Paper>
                        {
                            tabValue === 0 &&
                                <div>
                                    <div className='table-container'>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Amount</th>
                                                <th>Currency</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            { !isFetchingRefundList ? refundList && refundList.length ? renderRefundTable(refundList)
                                                : <tr rowSpan="4" style={{height: '10rem'}}>
                                                    <td colSpan="8" className="loading">No data found...</td>
                                                </tr>
                                                : <tr rowSpan="4" style={{height: '10rem'}}>
                                                    <td colSpan="8" className="loading">
                                                        <Loader />
                                                    </td>
                                                </tr>
                                            }
                                            {/*{refundList && refundList.length && renderRefundTable(refundList)}*/}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                        }
                        {
                            tabValue === 1 &&
                            <div className="refund-section">
                                <h1 className='refund-heading'>Refund</h1>
                                {
                                    !isRefunding && !isFetchingRefundList &&
                                    <div>
                                        <p className="refund-section-div">
                                            Maximum refund amount for this transaction: {(refundPayment.amount - refundedValue).toFixed(2)}
                                        </p>
                                        <div>
                                            <div>
                                                {
                                                    refundList && refundList.length < 1 &&
                                                    <div className="refund-section-div">
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
                                            !isFetchingRefundList && refundType === 'full' &&
                                            <h4>Are you sure you want to refund {refundPayment.amount} {refundPayment.currency}.</h4>
                                        }
                                        {
                                            !isFetchingRefundList && refundType === 'partial' &&
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
                                            !isFetchingRefundList && refundType === 'partial' && amount !== '' &&
                                            <p>Are you sure you want to refund {amount} {refundPayment.currency}?</p>
                                        }
                                        {
                                            refundLimitError && <p className="error_text">Amount exceeded from maximum allowed amount.</p>
                                        }
                                        <br/>
                                        <div className="refund-modal-footer">
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
                                        {
                                            refundError &&
                                            <p className="t-error">{refundError}</p>
                                        }
                                    </div>
                                }
                                {
                                    isFetchingRefundList &&
                                        <div className='text-center'>
                                            <Loader />
                                        </div>
                                }
                            </div>
                        }
                        <div>
                            {
                                refundMessage && <p className="success_message">{refundMessage}</p>
                            }
                        </div>
                        {
                            isRefunding &&
                            <div className="loader-footer">
                                <Loader />
                            </div>
                        }
                    </div>
                </Fragment>

            </Modal>
        </div>
    );
}

export default RefundModal;
