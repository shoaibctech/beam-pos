import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CreditTransferHistory from '../../component/CreditTransferHistory';
import WithdrawForm from '../../component/WithdrawForm';
import moment from 'moment';
import { orderBy } from 'lodash';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { getUserData, makeSecureRequest } from "../../utils";
import RefundModal from "../../component/RefundModal";
import Loader from '../../component/UI/Loader';
import { PaymentStatus } from "../../utils/Constants/PaymentStatus";

import './styles.css';

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

const Transactions = () => {
    const [paymentList, setPaymentsList] = useState([]);
    const [transError, setTransError] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [balance, setBalance] = useState([]);
    const [balanceError, setBalanceError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [index, setIndex] = useState();
    const [isOpen, setIsOpen] = useState(false);


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
            setIsFetching(false);
            console.log('fuck you', paymentList.data.paymentList.data);
            const sortedData =  orderBy(paymentList.data.paymentList.data, ['creationDateTime'], ['desc']);
            console.log(sortedData)
            setPaymentsList( prevState => ([...sortedData]));

        } catch (e) {
            console.log('transssssssssssssssssssssss ', e);
            setIsFetching(false);
            setTransError('Transaction request failed...')
        }

    }

    const getRefundPaymentsList = async () => {
        setIsFetching(true);
        setTransError('');
        try {
            const paymentList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payments`,
                {email: getUserData().email}, 'POST' );
            setIsFetching(false);
            setPaymentsList( prevState => ({...paymentList.data.paymentList}));
        } catch (e) {
            console.log('transssssssssssssssssssssss ', e);
            setIsFetching(false);
            setTransError('RefundModal transaction request failed...')
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
    const openRefundModal = (index) => {
        setIndex(index);
        setIsOpen(true);
    }
    const onclose = () => {
        setIsOpen(false);
    }

    const renderTable = (data) => {
        return data.map( (payment, idx) => {
            return (   <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{payment.email}</td>
                <td>{payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{PaymentStatus[payment.status]}</td>
                <td>{moment(payment.creationDateTime).format('DD-MM-YYYY hh:mm')}</td>
                <td>{payment.debtorBankName}</td>
                <td>
                    <button className="btn-refund" onClick={() => openRefundModal(idx)} disabled={payment.status !== 'PAYMENT_RECEIVED'}>Refund</button>
                </td>
            </tr>);
        });
    }

    // const createCreditTransfer = async () => {
    //     try {
    //         console.log('creating credit transfer ');
    //         const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/credit/transfer`, {
    //             amount: 100,
    //             currency: 'GBP',
    //             merchantId: getUserData().merchant_id,
    //         }, 'POST');
    //
    //         console.log('data ::', req.data.data);
    //
    //     } catch (e) {
    //         console.log("error ::", e.response)
    //     }
    // }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if(newValue === 0){
            getPaymentsList();
        } else if(newValue === 1) {
            console.log('new Value', newValue);
        }
    };


    return (
        <div className="transaction">
            <div className="tabs-balance">
                <Paper square >
                    <ThemeProvider theme={theme}>
                        <Tabs
                            value={tabValue}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleTabChange}
                            aria-label="disabled tabs example"
                        >
                            <Tab label="Payments" />
                            <Tab label="Withdrawl" />
                        </Tabs>
                    </ThemeProvider>
                </Paper>
                <div className="balance-con">
                    <div className="balance-block">
                        { balance && balance.length > 0 ?
                            <WithdrawForm balance={balance[1].balance.amount} currency={ balance[1].balance.currency} getBalance={getBalance}/>
                            :
                            <WithdrawForm balance={0} currency='GBP' isBalance={!(balance && balance.length > 0)}/>
                        }

                    </div>
                    <div className="balance-sec">
                        <p className="balance-label balance-block">BALANCE: {' '}</p>
                        {
                            balanceError ?
                                <p className="t-error">{balanceError}</p>
                                :
                                <p className="balance-block">
                                    {balance && balance.length > 0 ?
                                        <span className="balance">{(balance[1].balance.amount).toFixed(2)} { balance[1].balance.currency}</span>:
                                        <span style={{display: 'flex'}}>
                                            <Loader size='2rem'/>
                                        </span>
                                    }
                                </p>
                        }
                    </div>
                </div>
            </div>
            <h2 className="heading">Transactions Details</h2>
            {
                tabValue === 0 &&
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Bank Name</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { !transError ? !isFetching ? paymentList  && paymentList.length > 0 ? renderTable(paymentList)
                        : <tr rowSpan="4" style={{height: '10rem'}}>
                            <td colSpan="8" className="loading">No data found...</td>
                        </tr>
                        : <tr rowSpan="4" style={{height: '10rem'}}>
                            <td colSpan="8" className="loading">
                                <Loader />
                            </td>
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
            }
            {
                tabValue === 1 &&
                <CreditTransferHistory />
            }
            { isOpen &&
            <RefundModal paymentObj={paymentList[index]} onClose={onclose} isOpen={isOpen} />}
        </div>
    );
}

export default Transactions;
