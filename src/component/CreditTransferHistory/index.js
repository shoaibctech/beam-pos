import React, {useState, useEffect} from 'react';
import {orderBy} from 'lodash';
import Loader from "../UI/Loader";

import {makeSecureRequest, getUserData} from "../../utils";
import moment from "moment";
import './styles.css';
// import {PaymentStatus} from "../../utils/Constants/PaymentStatus";

const CreditTransferHistory = () => {
    const userData = getUserData();
    const [isFetching, setIsFetching] = useState(false);
    const [userCreditList, setUserCreditList] = useState([]);
    const [listCreditError, setListCreditError] = useState(false);

    useEffect(() => {
        getCreditList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCreditList = async () => {
        setIsFetching(true);
        setListCreditError('');
        try {
            const refundList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/list_credit_transfers`,
                {
                    merchantId: userData.merchant_id,
                    beneficiaryId: userData.beneficiary_id,
                }, 'POST');
            console.log('refund data ::', refundList.data.data.data);

            setIsFetching(false);
            setUserCreditList(prevState => ([...refundList.data.data.data]));
        } catch (e) {
            setIsFetching(false);
            console.log('errors ', e);
            setListCreditError('List with draw tranasaction failed. Please try again later');
        }
    }

    const renderTable = (data) => {
        const sortedData = orderBy(data, ['requestedExecutionDate'], ['desc']);
        return sortedData.map((payment, idx) => {
            return (<tr key={idx}>
                <td>{idx + 1}</td>
                <td>{payment.beneficiaryName}</td>
                <td>{payment.paymentAmount.toFixed(2)}</td>
                <td>{payment.paymentCurrency}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.type}</td>
                <td>{moment(payment.requestedExecutionDate).format('DD-MM-YYYY')}</td>
            </tr>);
        });
    }
    const renderTableForMobile = (data) => {
        const sortedData = orderBy(data, ['requestedExecutionDate'], ['desc']);
       return  sortedData.map((payment, idx) => {
            return (<div className="tr-content-box" key={idx}>
                <h3 className="tr-content-box-items">
                    <span className="tr-content-box-items">{payment.paymentAmount.toFixed(2)}</span>
                    <span className="tr-content-box-items">{payment.paymentCurrency}</span>
                </h3>
                <span className="tr-content-box-items tr-grey-item">
                    {payment.beneficiaryName}
                </span>
                <span className="tr-content-box-items tr-grey-item">{payment.paymentStatus} {payment.type} </span>
                <div>
                    <span className="tr-content-box-items tr-grey-item">
                        {moment(payment.requestedExecutionDate).format('DD-MM-YYYY')}
                    </span>
                </div>
            </div>)
        })
    }
    return (
        <React.Fragment>
            <div className="credit-transfer tr-desktop-only" style={{overflowX: 'auto'}}>
                <table className="tr-table-box">
                    <thead className="tr-table-head">
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody className="settings-content">
                    {!listCreditError ? !isFetching ? userCreditList && userCreditList.length > 0 ? renderTable(userCreditList)
                        : <tr rowSpan="4" style={{height: '10rem'}}>
                            <td colSpan="8" className="loading">No transaction found...</td>
                        </tr>
                        : <tr rowSpan="4" style={{height: '10rem'}}>
                            <td colSpan="8" className="loading">
                                <Loader/>
                            </td>
                        </tr> : ''

                    }
                    {
                        !isFetching && listCreditError &&
                        <tr rowSpan="4" style={{height: '10rem'}}>
                            <td colSpan="8" className="loading"><span className="t-error">{listCreditError}</span></td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
            <div className="tr-mobile-only">
                <div className="tr-main-container">
                    {!listCreditError && !isFetching && userCreditList && userCreditList.length > 0 &&
                        renderTableForMobile(userCreditList)
                    }
                    {
                        !listCreditError && !isFetching && userCreditList && userCreditList.length < 1 &&
                        <div className="text-center tr-info">
                            <span className="loading">No transaction found</span>
                        </div>
                    }
                    {
                        isFetching &&
                        <div className="text-center tr-info" style={{height: '7rem'}}>
                            <span className="loading"><Loader/></span>
                        </div>
                    }
                    {
                        !isFetching && listCreditError &&
                        <div className="text-center tr-info" style={{height: '10rem'}}>
                            <span className="loading"><span className="t-error">{listCreditError}</span></span>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default CreditTransferHistory;
