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
import {PaymentStatus, RefundStatus} from "../../utils/Constants/PaymentStatus";

import './styles.css';

import {getUserData, makeSecureRequest} from "../../utils";
import RefundForm from "../RefundForm";
import useViewPort from "../../utils/useViewPort/useViewPort";

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
            main: '#ff1375'
        },
        // secondary: {
        //     main: green[500],
        // },
    },
});

const RefundModal = ({ paymentObj, isOpen, onClose }) => {

    const [refundList, setRefundList] = useState([]);
    const [isFetchingRefundList, setIsFetchingRefundList] = useState(false);
    const [tabValue, setTabValue] = React.useState(0);
    const [refundedValue, setRefundedValue] = useState();
    const { width } = useViewPort();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        sureRefund();
    }, []);


    const closeModal= () => {
        onClose();
        setRefundList([]);
    }

    const renderRefundTable = (data) => {
        return data.map( (payment, idx) => {
            return (
                <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{payment.refundAmount.toFixed(2)}</td>
                <td>{payment.currency}</td>
                <td>{RefundStatus[payment.status]}</td>
                <td>{moment(payment.creationDateTime).format('DD-MM-YYYY HH:mm')}</td>
            </tr>
            );
        });
    }
    const renderRefundMobileTable = (data) => {
        return data.map( (payment, idx) => {
            return (
                <div className="tr-content-box" key={idx}>
                    <h3 className="tr-content-box-items">{RefundStatus[payment.status]}</h3>
                    <span className="tr-content-box-items tr-grey-item">{payment.debtorAccount && payment.debtorAccount.name ? payment.debtorAccount.name : ''}</span>
                    <div className="tr-s-row">
                        <span className="tr-content-box-items tr-grey-item">{payment.refundAmount.toFixed(2)}</span>
                        <span className="tr-content-box-items tr-grey-item">{payment.currency}</span>
                    </div>
                    <div>
                        <span className="tr-content-box-items tr-grey-item">{moment(payment.creationDateTime).format('DD-MM-YYYY HH:mm')}</span>
                    </div>
                </div>
            );
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
            {
                width > 768 &&
                <div>
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Refund"
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
                                        <div className='table-container' style={{overflowX: 'auto'}}>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>No</th>
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
                                    <RefundForm
                                        getRefundList={getRefundList}
                                        handleTabValue={setTabValue}
                                        handleClose={onClose}
                                        paymentObj={paymentObj}
                                        isFetchingRefundList={isFetchingRefundList}
                                        refundedValue={refundedValue}
                                    />
                                }
                            </div>
                        </Fragment>
                    </Modal>
                </div>
            }
            {
                isOpen && width < 768 &&
                <div>
                    <Fragment>
                        <div onClick={closeModal}>
                        <span className="mobile-back-btn"><i className="fas fa-arrow-left"></i></span>
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
                                    <div className='table-container' style={{overflowX: 'auto'}}>
                                        <div>
                                            <div className='table-container' style={{overflowX: 'auto'}}>
                                                <div className="tr-main-container">
                                                    { !isFetchingRefundList ? refundList && refundList.length ? renderRefundMobileTable(refundList)
                                                        : <span rowSpan="4" style={{height: '10rem'}}>
                                                        <td colSpan="8" className="loading">No data found...</td>
                                                    </span>
                                                        : <span rowSpan="4" style={{height: '10rem'}}>
                                                        <span colSpan="8" className="loading loader-center">
                                                            <Loader />
                                                        </span>
                                                    </span>
                                                    }
                                                    {/*{refundList && refundList.length && renderRefundTable(refundList)}*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                tabValue === 1 &&
                                <RefundForm
                                    getRefundList={getRefundList}
                                    handleTabValue={setTabValue}
                                    handleClose={onClose}
                                    paymentObj={paymentObj}
                                    isFetchingRefundList={isFetchingRefundList}
                                    refundedValue={refundedValue}
                                />
                            }
                        </div>
                    </Fragment>
                </div>
            }
        </div>
    );
}

export default RefundModal;
