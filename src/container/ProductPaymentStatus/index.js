import React from 'react';
import { useParams } from 'react-router-dom';
import Logo from '../StaticPaymentsBank/img/love_hemp.svg';
import Check from '../StaticPaymentsBank/img/check.svg';
import FailedIcon from './img/failed.svg';
import { PaymentStatusImage } from "../../utils/Constants/PaymentStatus";

import './styles.css';

const ProductPaymentStatus = () => {
    const { payment_status, order_id, payment_token} = useParams();
    const paymentStatus = PaymentStatusImage[payment_status];

    const redirectToProductPage = () => {
        const link = window.location.origin + '/product/' + payment_token;
        window.location.href = link;
    }
    return (
        <div>
           <div className="top-block">
               <div className="text-center mr-t-20">
                   {
                       paymentStatus ? <p>Order complete</p> : <p>Order failed</p>
                   }
               </div>
               <div className="logo-container mr-t-20">
                   <img src={Logo} alt="love hemp" className="mr-t-20" />
               </div>
               <div className="mr-t-20 text-center">
                   <img src={ paymentStatus ? Check : FailedIcon} alt="check" className="check-img" />
               </div>
               <p className="text-center p-color">{paymentStatus ? 'Success' : 'Opps..something went wrong!'}</p>
               <p className="text-center p-color">{paymentStatus ? `Order id: ${order_id}` : `DECLINED REF: ${order_id}`}</p>
               {
                   paymentStatus ?
                       <div className="message-box-1">
                           <p>Good news, we’ve received your payment and your order will be on its way very soon :) </p>
                       </div>
                       :
                       <div className="message-box-2">
                           <p>We are very sorry, It looks like your payment has not gone through.</p>
                       </div>
               }
               <div className="message-box-2">
                   {
                       paymentStatus ?
                       <p>Check your email for confirmation and delivery updates. </p> :
                       <p>A receipt has been emailed to you.<strong> Please try again.</strong></p>
                   }
               </div>
               {
                   !paymentStatus &&
                   <div className="message-box-2">
                       <p>If the problem persists you may wish to <strong>try using a different bank.</strong></p>
                   </div>
               }
           </div>
            {
                !paymentStatus &&
                <div className="text-center">
                    <a href="mailto:hello@beam" className="contact-support">Contact support</a>
                </div>
            }
            <div className="back-to-store-block">
                { paymentStatus ?
                    <button className="back-to-store-btn" onClick={redirectToProductPage}>Back to love hemp</button> :
                    <button className="back-to-store-btn" onClick={redirectToProductPage}>try again</button>
                }
            </div>
            {
                paymentStatus ?
                    <div className="term-service">
                        <p>Terms and conditions of order text. By confirming this order to Love Hemp you agree to their terms of
                            service and privacy information. Standard shipping applies 3 - 5 working days.</p>
                    </div>
                    :
                    <div className="term-service">
                        <p>Payments are powered by Sentenial Limited, trading as Nuapay, who are authorised by
                            the Financial Conduct Authority under the Payment Service Regulations 2009
                            [FRN 624067] for the provision of payment services.</p>
                    </div>
            }
        </div>
    );

}

export default ProductPaymentStatus;