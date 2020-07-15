import React, { useState, useEffect } from 'react';
import { makeSecureRequest, getUserData } from "../../utils";

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
            setUserCreditList( prevState => ([...prevState, ...refundList.data.data.data]));
        } catch (e) {
            setIsFetching(false);
            console.log('errors ', e);
            setListCreditError('List with draw tranasaction failed. Please try again later');
        }
    }

    const renderTable = (data) => {
        return data.map( (payment, idx) => {
            return (   <tr key={idx}>
                <td>{idx}</td>
                <td>{payment.beneficiaryName}</td>
                <td>{payment.paymentAmount}</td>
                <td>{payment.paymentCurrency}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.type}</td>
            </tr>);
        });
    }
    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody>
                { !listCreditError ? !isFetching ? userCreditList && userCreditList.length > 0 ? renderTable(userCreditList)
                    : <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading">No data found...</td>
                    </tr>
                    : <tr rowSpan="4" style={{height: '10rem'}}>
                        <td colSpan="8" className="loading">Loading...</td>
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