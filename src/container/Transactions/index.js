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
import GiftAids from "../../component/GiftAids";

import './styles.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgba(89, 86, 262, 1)'
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
    const [paymentId, setPaymentId] = useState('');
    const [isSearching, setIsSearching] = useState(true);
    const [searchData, setSearchData] = useState([]);

    const { account_type, merchant_type } = getUserData();

    useEffect( () => {
        getPaymentsList();
        getBalance();
    }, []);

    const getPaymentsList = async () => {
        setIsFetching(true);
        setTransError('');
        setIsSearching(false);
        try {
            const paymentList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payments`,
                {merchant_id: getUserData().merchant_id}, 'POST' );
            setIsFetching(false);
            const sortedData =  orderBy(paymentList.data.paymentList.data, ['creationDateTime'], ['desc']);
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
            setTransError('Refund transaction request failed...');
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
                <td>{payment.id}</td>
                <td>{payment.debtorAccount && payment.debtorAccount.name ? payment.debtorAccount.name : 'N/A'}</td>
                <td>{payment.amount.toFixed(2)}</td>
                <td>{payment.currency}</td>
                <td>{payment.debtorBankName ? payment.debtorBankName : 'N/A'}</td>
                <td  className="isHidden">{payment.email}</td>
                <td>{PaymentStatus[payment.status]}</td>
                <td>{moment(payment.creationDateTime).format('DD-MM-YYYY HH:mm')}</td>
                { account_type !== 'basic' &&
                <td  style={{minWidth: '145px'}}>
                    <button className="btn-refund" onClick={() => openRefundModal(idx)} disabled={payment.status !== 'PAYMENT_RECEIVED'}>Refund</button>
                </td>
                }
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

    const getPaymentDetail = async () => {
        if (!paymentId)
            return;

        setIsFetching(true);
        setIsSearching(true);
        try {
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/retrieve`,
                {
                    paymentId: paymentId,
                    merchantId: getUserData().merchant_id
                }, 'POST');
            const data = [req.data.paymentDetail]
            setSearchData(data);
            console.log('payment Detail :: ', data);
            setIsFetching(false);
        } catch (e) {
            setIsFetching(false);
            setSearchData([]);
           console.log(e);
           e.response && e.response.data.message.includes('404') ? setTransError('') : setTransError('Payment detail request failed.');
        }
    }

    return (
        <div className="transaction">
            {
                account_type !== 'basic' &&
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
                                <Tab label="Withdrawls" />
                                {merchant_type === 'charity' && <Tab label="Gift Aids" />}
                            </Tabs>
                        </ThemeProvider>
                    </Paper>
                    <div className="balance-con">
                        <div className="balance-sec">
                            <p className="balance-label balance-block">BALANCE: {' '}</p>
                            {
                                balanceError ?
                                    <p className="t-error">{balanceError}</p>
                                    :
                                    <div className="balance-block">
                                        {balance && balance.length > 0 ?
                                            <span className="balance">{(balance[1].balance.amount).toFixed(2)} { balance[1].balance.currency}</span>:
                                            <span style={{display: 'flex'}}>
                                            <Loader size='2rem'/>
                                        </span>
                                        }
                                    </div>
                            }
                        </div>
                        <div className="balance-block">
                            { balance && balance.length > 0 ?
                                <WithdrawForm balance={balance[1].balance.amount} currency={ balance[1].balance.currency} getBalance={getBalance}/>
                                :
                                <WithdrawForm balance={0.00} currency='GBP' isBalance={!(balance && balance.length > 0)}/>
                            }

                        </div>
                    </div>
                </div>
            }

            {

                tabValue === 0 &&
                <>
                   <div className="tr-top-box">
                       <h2 className="heading">Transactions Details</h2>
                       <div className="search-container">
                           <input type="text" value={paymentId} onChange={e => {
                               setPaymentId(e.target.value);
                               if (!e.target.value)
                                   setIsSearching(false);
                           }} placeholder="Enter payment id"/>
                           <button onClick={getPaymentDetail}>Search</button>
                       </div>
                   </div>
                    <div style={{overflowX: 'auto'}}>
                        <table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Payment Id</th>
                                <th>Payer Name</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Bank Name</th>
                                <th className="isHidden">Email</th>
                                <th>Status</th>
                                <th>Date</th>
                                {
                                    account_type !== 'basic' &&
                                    <th style={{minWidth: '145px'}}>Action</th>
                                }
                            </tr>
                            </thead>
                            <tbody>
                            { !transError && !isFetching && !isSearching && paymentList  && paymentList.length > 0 ?
                                renderTable(paymentList)
                                : !isFetching && !isSearching && <tr rowSpan="4" style={{height: '10rem'}}>
                                <td colSpan="10" className="loading">No results found</td>
                            </tr>

                            }
                            {
                                 !isFetching && isSearching  && searchData  && searchData.length > 0 ?
                                     renderTable(searchData)
                                     : !isFetching && isSearching && <tr rowSpan="4" style={{height: '10rem'}}>
                                     <td colSpan="10" className="loading">No payment details found against <strong>{paymentId}</strong></td>
                                 </tr>
                            }
                            {
                                isFetching &&
                                <tr rowSpan="4" style={{height: '10rem'}}>
                                    <td colSpan="10" className="loading"><Loader /></td>
                                </tr>
                            }
                            {
                                !isFetching && transError &&
                                <tr rowSpan="4" style={{height: '10rem'}}>
                                    <td colSpan="8" className="loading"><span className="t-error">{transError}</span></td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </>
            }
            {
                tabValue === 1 &&
                <>
                    <h2 className="heading">Transactions Details</h2>
                    <CreditTransferHistory />
                </>
            }
            {
                tabValue === 2 &&
                <>
                    <h2 className="heading">Gift Aid Details</h2>
                    <GiftAids />
                </>
            }
            { isOpen &&
            <RefundModal paymentObj={paymentList[index]} onClose={onclose} isOpen={isOpen} />}
        </div>
    );
}

export default Transactions;
