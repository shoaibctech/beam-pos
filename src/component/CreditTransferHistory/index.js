import React, { useState, useEffect } from 'react';
import { orderBy } from 'lodash';
import Loader from "../UI/Loader";

import { makeSecureRequest, getUserData } from "../../utils";
import moment from "moment";
import './styles.css';

const CreditTransferHistory = () => {
    const userData = getUserData();
    const [isFetching, setIsFetching] = useState(false);
    const [userCreditList, setUserCreditList] = useState([]);
    const [listCreditError, setListCreditError] = useState(false);

    useEffect(() => {
        getCreditList();
    }, []);

    const getCreditList = async () => {
        setIsFetching(true);
        setListCreditError('');
        try {
            const refundList = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/list_credit_transfers`,
                {
                    merchantId: userData.merchant_id,
                }, 'POST');
            console.log('refund data ::', refundList.data.data.data);

            setIsFetching(false);
            setUserCreditList( prevState => ([...refundList.data.data.data]));
        } catch (e) {
            setIsFetching(false);
            console.log('errors ', e);
            setListCreditError('List with draw tranasaction failed. Please try again later');
        }
    }

    const renderTable = (data) => {
       const sortedData = orderBy(data, ['requestedExecutionDate'], ['desc']);
        return sortedData.map( (payment, idx) => {
            return (   <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{payment.beneficiaryName}</td>
                <td>{payment.paymentAmount}</td>
                <td>{payment.paymentCurrency}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.type}</td>
                <td>{moment(payment.requestedExecutionDate).format('DD-MM-YYYY')}</td>
            </tr>);
        });
    }
    return (
        <div className="credit-transfer" style={{overflowX: 'auto'}}>

            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                { !listCreditError ? !isFetching ? userCreditList && userCreditList.length > 0 ? renderTable(userCreditList)
                    : <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading">No data found...</td>
                    </tr>
                    : <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading">
                            <Loader />
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
    );
}

export default CreditTransferHistory;
