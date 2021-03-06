import React, { useEffect, useState, useCallback } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CreditTransferHistory from '../../component/CreditTransferHistory';
import WithdrawForm from '../../component/WithdrawForm';
import moment from 'moment';
import { orderBy, debounce } from 'lodash';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

import { getUserData, makeSecureRequest } from "../../utils";
import RefundModal from "../../component/RefundModal";
import Loader from '../../component/UI/Loader';
import { PaymentStatus } from "../../utils/Constants/PaymentStatus";
import GiftAids from "../../component/GiftAids";
import useViewport from "../../utils/useViewPort/useViewPort";

import './styles.css';

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

const NUAPAY_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

const Transactions = () => {
    const { width } = useViewport();
    const [paymentList, setPaymentsList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchPageNumber, setSearchPageNumber] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [transError, setTransError] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [balance, setBalance] = useState([]);
    const [balanceError, setBalanceError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [index, setIndex] = useState();
    const [isOpen, setIsOpen] = useState(false);
    // const [paymentId, setPaymentId] = useState('');
    const [isSearching, setIsSearching] = useState(true);
    const [searchData, setSearchData] = useState([]);
    const [isPaymentReceived, setIsPaymentReceived] = useState(false);
    // const [payerName, setPayerName] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: moment().utc().subtract(30, 'days'),
        to: moment().utc()
    });

    const { account_type, merchant_type } = getUserData();

    useEffect( () => {
        setPaymentsList([]);
        setPageNumber(1);
        getPaymentsList(1, isPaymentReceived);
        getBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    // useEffect(() => {
    //     if(searchKey) {
    //         searchPayment(searchKey, searchPageNumber);
    //     } else {
    //         getPaymentsList(pageNumber);
    //     }
    //
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isPaymentReceived]);


    const getPaymentsList = async (page = 1, isPaymentCleared) => {
        setIsFetching(true);
        setTransError('');
        setIsSearching(false);
        try {
            const paymentListReq = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payments`,
                {
                    merchant_id: getUserData().merchant_id,
                    pageNumber: page,
                    paymentStatus: isPaymentCleared ?  'all' : 'PAYMENT_RECEIVED',
                    dateRange: {
                        from: dateRange.from.format(NUAPAY_DATE_FORMAT),
                        to: dateRange.to.format(NUAPAY_DATE_FORMAT)
                    }
                }, 'POST' );

            setIsFetching(false);
            const sortedData =  orderBy(paymentListReq.data.paymentList.data, ['creationDateTime'], ['desc']);
            checkIfLastPage(page, paymentListReq.data.paymentList);
            if (page === 1){
                setPaymentsList( prevState => ([...sortedData]));
            } else {
                setPaymentsList( prevState => ([...paymentList,...sortedData]));
            }
        } catch (e) {
            setIsFetching(false);
            setTransError('Transaction request failed...')
        }

    }

    // const getRefundPaymentsList = async () => {
    //     setIsFetching(true);
    //     setTransError('');
    //     try {
    //         const paymentList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payments`,
    //             {email: getUserData().email}, 'POST' );
    //         setIsFetching(false);
    //         setPaymentsList( prevState => ({...paymentList.data.paymentList}));
    //     } catch (e) {
    //         console.log('transssssssssssssssssssssss ', e);
    //         setIsFetching(false);
    //         setTransError('Refund transaction request failed...');
    //     }
    // }

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
                <td>{payment.remittanceInformation && payment.remittanceInformation.unstructured ? payment.remittanceInformation.unstructured : 'N/A'}</td>
                <td>{payment.debtorAccount && payment.debtorAccount.name ? payment.debtorAccount.name : 'N/A'}</td>
                <td>{payment.amount.toFixed(2)}</td>
                <td>{payment.currency}</td>
                <td>{payment.debtorBankName ? payment.debtorBankName : 'N/A'}</td>
                {/*<td  className="isHidden">{payment.email}</td>*/}
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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if(newValue === 0){
            getPaymentsList();
        } else if(newValue === 1) {
            console.log('new Value', newValue);
        }
    };

    const debouncedSave = useCallback(
        debounce((key,page, paymentStatus) => searchPayment(key, page, paymentStatus), 500),
        [],
    );

    const handleSearch = (e) => {
        setIsFetching(true);
        setSearchData([]);
        setSearchKey(e.target.value);
        debouncedSave(e.target.value, 1, isPaymentReceived);
    }

    const searchPayment = async (value, page = 1, isPaymentCleared = isPaymentReceived) => {
        if (value === ''){
         setIsSearching(false);
         getPaymentsList(pageNumber, isPaymentCleared)
         return;
        }

        setIsFetching(true);
        setIsSearching(true);
        const apiData = {
            searchKey: value,
            merchantId: getUserData().merchant_id,
            pageNumber: page,
            paymentStatus: isPaymentCleared ?  'all' : 'PAYMENT_RECEIVED'
        };

        try {
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/payment/retrieve`,
                apiData, 'POST');

            setSearchData(req.data.paymentDetail.data);
            setIsFetching(false);
            checkIfLastPage(page, req.data.paymentDetail);
            const sortedData =  orderBy(req.data.paymentDetail.data, ['creationDateTime'], ['desc']);
            if (page === 1){
                setSearchData( prevState => ([...sortedData]));
            } else {
                setSearchData( prevState => ([...searchData,...sortedData]));
            }
        } catch (e) {
            setIsFetching(false);
            setSearchData([]);
            console.log(e);
            e.response && e.response.data.message.includes('404') ? setTransError('') : setTransError('Payment detail request failed.');
        }
    }

    const checkIfLastPage = (page, pageElement) => {
        if (page >= pageElement.page.totalPages){
            setIsLastPage(true);
        } else {
            setIsLastPage(false);
        }
    }


    const handleNextPage = () => {
        if (searchKey){
            setSearchPageNumber(searchPageNumber + 1)
            searchPayment(searchKey, searchPageNumber + 1, isPaymentReceived);
        } else {
            setPageNumber(pageNumber + 1);
            getPaymentsList(pageNumber + 1, isPaymentReceived);
        }
    }

    const handleSwitchChange = (event) => {
        setPaymentsList([]);
        setIsPaymentReceived(event.target.checked);

        if(searchKey) {
            setSearchPageNumber(1);
            searchPayment(searchKey, 1, event.target.checked);
        } else {
            setPageNumber(1)
            getPaymentsList(1, event.target.checked);
        }
    }

    return (
        <div className="transaction">
            {
                (( !isWithdrawOpen && !isOpen && width <= 768) || ( width > 768)) &&
                    <React.Fragment>
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
                                        <button className="btn-withdraw" onClick={() => setIsWithdrawOpen(true)} disabled={!(balance && balance.length > 0)} >
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }

                        {

                            tabValue === 0 &&
                            <>
                                <div className="tr-top-box heading">
                                    {/*<h2 className="heading">Transactions Details</h2>*/}
                                    <div className="status-toggle">
                                        <span>Cleared</span>
                                        <Switch
                                            checked={isPaymentReceived}
                                            onChange={handleSwitchChange}
                                            color="secondary"
                                            name="checkedB"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                        <span>All</span>
                                    </div>
                                    <div className="search-container">
                                        <div className="icon-search-container">
                                            <i className="fas fa-search"></i>
                                            <input
                                                placeholder="Search by Id or Name"
                                                value={searchKey}
                                                onChange={handleSearch}
                                            />
                                        </div>
                                        {/*<input type="text" value={payerName} onChange={e => {*/}
                                        {/*    setPayerName(e.target.value);*/}
                                        {/*    if (!e.target.value)*/}
                                        {/*        setIsSearching(false);*/}
                                        {/*}}*/}
                                        {/*       placeholder="Payer Name"*/}
                                        {/*       disabled={!!paymentId}*/}
                                        {/*/>*/}
                                        {/*<input type="text" value={paymentId} onChange={e => {*/}
                                        {/*    setPaymentId(e.target.value);*/}
                                        {/*    if (!e.target.value)*/}
                                        {/*        setIsSearching(false);*/}
                                        {/*}}*/}
                                        {/*       placeholder="Enter payment id"*/}
                                        {/*       disabled={!!payerName}*/}
                                        {/*/>*/}
                                        {/*<button className="btn btn-primary" onClick={getPaymentDetail}>Search</button>*/}
                                    </div>
                                </div>
                                <div className="date-range">
                                    <div className="date-range__title">
                                        {dateRange.from.format('MMM Do YYYY')} ??? {dateRange.to.format('MMM Do YYYY')}
                                    </div>
                                    <div>
                                        <button
                                            disabled={isFetching}
                                            className="btn-withdraw"
                                            onClick={() => {
                                                setDateRange({
                                                    from: dateRange.from.subtract(30, 'days'),
                                                    to: dateRange.to.subtract(30, 'days')
                                                })
                                            }}
                                        >Previous</button>
                                        <button
                                            disabled={isFetching || moment(dateRange.to).add(30, 'days').isAfter(moment(), 'day')}
                                            className="btn-withdraw"
                                            onClick={() => {
                                                setDateRange({
                                                    from: dateRange.from.add(30, 'days'),
                                                    to: dateRange.to.add(30, 'days')
                                                })
                                            }}
                                        >Next</button>
                                    </div>
                                </div>
                                <div style={{overflowX: 'auto'}} className="tr-desktop-only">
                                    <table className="tr-table-box">
                                        <thead className="tr-table-head">
                                        <tr>
                                            <th>No</th>
                                            <th>Payment Id</th>
                                            <th>Order Id</th>
                                            <th>Payer Name</th>
                                            <th>Amount</th>
                                            <th>Currency</th>
                                            <th>Bank Name</th>
                                            {/*<th className="isHidden">Email</th>*/}
                                            <th>Status</th>
                                            <th>Date</th>
                                            {
                                                account_type !== 'basic' &&
                                                <th style={{minWidth: '145px'}}>Action</th>
                                            }
                                        </tr>
                                        </thead>
                                        <tbody className="settings-content">
                                        { !transError && !isSearching && paymentList  && paymentList.length > 0 &&
                                        renderTable(paymentList)
                                        }
                                        {
                                            !transError && !isFetching && !isSearching && paymentList  && paymentList.length < 1 && <tr rowSpan="4" style={{height: '10rem'}}>
                                                <td colSpan="10" className="loading">No transaction found</td>
                                            </tr>
                                        }
                                        {
                                            isSearching  && searchData  && searchData.length > 0 ?
                                                renderTable(searchData)
                                                : !isFetching && isSearching && <tr rowSpan="4" style={{height: '10rem'}}>
                                                <td colSpan="10" className="loading">No transaction found against <strong>{searchKey}</strong></td>
                                            </tr>
                                        }
                                        {
                                            isFetching &&
                                            <tr rowSpan="4" style={{height: '7rem'}}>
                                                <td colSpan="10" className="loading"><Loader /></td>
                                            </tr>
                                        }
                                        {
                                            !isFetching && transError &&
                                            <tr rowSpan="4" style={{height: '10rem'}}>
                                                <td colSpan="10" className="loading"><span className="t-error">{transError}</span></td>
                                            </tr>
                                        }
                                        </tbody>
                                    </table>
                                    {
                                        !isFetching && !isLastPage && !transError && paymentList.length > 1 &&
                                        <div className="text-center load-more">
                                            <button className="btn btn-primary" onClick={handleNextPage}>Load More</button>
                                        </div>
                                    }
                                </div>
                                <>
                                    <div className="tr-mobile-only">
                                        <div className="tr-main-container">
                                            { !transError && !isSearching && paymentList  && paymentList.length > 0 &&
                                            paymentList.map( (payment, idx) => {
                                                return ( <div className="tr-content-box" key={idx}>
                                                    <h3 className="tr-content-box-items">{PaymentStatus[payment.status]}</h3>
                                                    <span className="tr-content-box-items tr-grey-item">{payment.debtorAccount && payment.debtorAccount.name ? payment.debtorAccount.name : ''}</span>
                                                    <div className="tr-s-row">
                                                        <span className="tr-content-box-items tr-grey-item">{payment.amount.toFixed(2)}</span>
                                                        <span className="tr-content-box-items tr-grey-item">{payment.currency}</span>
                                                        { account_type !== 'basic' && payment.status === 'PAYMENT_RECEIVED' &&
                                                        <span  className="tr-action">
                                                        <button className="tr-action-btn" onClick={() => openRefundModal(idx)}>Refund</button>
                                                    </span>
                                                        }
                                                    </div>
                                                    <div>
                                                        <span className="tr-content-box-items tr-grey-item">{moment(payment.creationDateTime).format('DD-MM-YYYY HH:mm')}</span>
                                                    </div>
                                                    <div>
                                                        <span className="tr-content-box-items tr-grey-item">{payment.debtorBankName ? payment.debtorBankName : ''}</span>
                                                    </div>
                                                </div>)
                                            })
                                            }
                                            {
                                                !transError && !isFetching && !isSearching && paymentList  && paymentList.length < 1 &&
                                                <div className="text-center tr-info">
                                                    <span className="loading">No transactions found</span>
                                                </div>
                                            }
                                            {
                                                !isFetching && isSearching  && searchData  && searchData.length > 0 ?
                                                    searchData.map( (payment, idx) => {
                                                        return ( <div className="tr-content-box" key={idx}>
                                                            <h3 className="tr-content-box-items">{PaymentStatus[payment.status]}</h3>
                                                            <span className="tr-content-box-items">{payment.debtorAccount && payment.debtorAccount.name ? payment.debtorAccount.name : 'N/A'}</span>
                                                            <div className="tr-s-row">
                                                                <span className="tr-content-box-items">{moment(payment.creationDateTime).format('DD-MM-YYYY HH:mm')}</span>
                                                                <span className="tr-content-box-items">{payment.debtorBankName ? payment.debtorBankName : 'N/A'}</span>
                                                                { account_type !== 'basic' && payment.status === 'PAYMENT_RECEIVED' &&
                                                                <span  className="tr-action">
                                                        <button className="tr-action-btn" onClick={() => openRefundModal(idx)}>Refund</button>
                                                    </span>
                                                                }
                                                            </div>
                                                            <div>
                                                                <span className="tr-content-box-items">{payment.amount.toFixed(2)}</span>
                                                                <span className="tr-content-box-items">{payment.currency}</span>
                                                            </div>
                                                        </div>)
                                                    })
                                                    : !isFetching && isSearching &&
                                                    <div className="text-center tr-info">
                                                        <span className="loading">No payment details found against</span>
                                                    </div>
                                            }
                                            {
                                                isFetching &&
                                                <div className="text-center tr-info" style={{height: '7rem'}}>
                                                    <span className="loading"><Loader /></span>
                                                </div>
                                            }
                                            {
                                                !isFetching && transError &&
                                                <div  className="text-center tr-info" style={{height: '10rem'}}>
                                                    <span className="loading"><span className="t-error">{transError}</span></span>
                                                </div>
                                            }
                                            {
                                                !isFetching && !isLastPage && !transError && paymentList.length > 1 &&
                                                <div className="text-center load-more">
                                                    <button className="btn btn-primary" onClick={handleNextPage}>Load More</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </>
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
                    </React.Fragment>
            }
            { isOpen &&
            <RefundModal paymentObj={paymentList[index]} onClose={onclose} isOpen={isOpen} />
            }

            { isWithdrawOpen && balance && balance.length > 0 ?
                <WithdrawForm balance={balance[1].balance.amount} currency={ balance[1].balance.currency} getBalance={getBalance} isOpen={isWithdrawOpen} handleIsOpen={setIsWithdrawOpen}/>
                :
                isWithdrawOpen && <WithdrawForm balance={0.00} currency='GBP' isBalance={!(balance && balance.length > 0)}  isOpen={isWithdrawOpen}  handleIsOpen={setIsWithdrawOpen}/>
            }
        </div>
    );
}

export default Transactions;
