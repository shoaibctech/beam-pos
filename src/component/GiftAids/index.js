import React, { useState, useEffect } from "react";
import { makeSecureRequest } from "../../utils";
import Loader from '../UI/Loader/index';
import moment from "moment";

const GiftAids = () => {
    const [loading, setIsLoading] = useState(false);
    const [giftAids, setGiftAids] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchGiftAids();
    }, []);

    const fetchGiftAids = async () => {
        setIsLoading(true);
        try {
            setError(false);
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/gift_aids`, {}, 'GET');
            let data = [...req.data.data];
            setGiftAids(data);
            setIsLoading(false)
        } catch (e) {
            console.log('e :: ', e);
            setError(true);
            setIsLoading(false);
        }
    }

    const renderTable = (data) => {
        return data.map( (payment, idx) => {
            return (   <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{payment.name}</td>
                <td>{payment.address}</td>
                <td>£{parseFloat(payment.amount).toFixed(2)}</td>
                <td>{payment.payment_status}</td>
                <td>{moment(payment.createdAt).format('DD-MM-YYYY HH:mm')}</td>
            </tr>);
        });
    }

    if(loading){
        return (
            <div style={{textAlign: 'center'}}>
                <Loader />
            </div>
        );
    }
    if (error) {
        return (
            <div style={{textAlign: 'center'}}>
                <p className="error_text">
                    Some thing went wrong!
                </p>
            </div>
        );
    }
    return (
        <div>
            <div style={{overflowX: 'auto'}}>
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {giftAids ? renderTable(giftAids) : <tr><td colSpan="5" style={{textAlign: 'center'}}>No Data found!</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GiftAids;