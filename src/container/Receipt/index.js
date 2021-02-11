import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Tick from '../../component/QRCode/img/tick-anim.svg';
import UploadIcon from './img/upload.png';
import FillTick from './img/black-tick.png';
import moment from "moment";


import './styles.css';
import Logo from './img/Dark.png';

const Receipt = () => {
    const [step, setStep] = useState(0);
    const { amount, merchant_name, payer_name, bank_name, trans_date, status } = useParams();

    if (step === 0) {
        return (
               <div className="main_container">
                   <div>
                       <div>
                           <img className="logo_pos" src={Logo} />
                       </div>

                         {
                             status === 'AUTHORISED' ?
                                 <React.Fragment>
                                     <div className="main_head">
                                         <h1>Your transfer  is complete.</h1><br/>
                                     </div>
                                     <div className="p_set">
                                         <h4>Your money has been sent to <span style={{color:"limegreen"}}>{merchant_name}.</span></h4>
                                     </div>
                                 </React.Fragment>
                             :
                             <React.Fragment>
                                 <div className="main_head">
                                     <h1>Transfer failed.</h1><br/>
                                 </div>
                                 <div className="p_set">
                                     <h4>Sorry, we are unable to process your payment. Please try again.</h4>
                                 </div>
                             </React.Fragment>
                         }
                       {
                           status === 'AUTHORISED' ?
                               <div className="circle">
                                   <div className="inner-circle">
                                       <strong>AM</strong>
                                       <div className="fill-box">
                                           <div className="tick-sign"></div>
                                       </div>
                                   </div>
                                   <div className="vertical-line"></div>
                                   <div className="small-circle">
                                       <div className="small-inner">
                                           <div className="check-box"></div>
                                       </div>
                                       <div className="down-line" ></div>
                                   </div>
                                   <div className="down-circle" >
                                       <div className="down-c">
                                           <strong>MB</strong>
                                       </div>
                                   </div>
                               </div>
                               :
                               <div className="failed-c">
                                   <div className="f-inner-c">
                                       <strong>AM</strong>
                                       <div className="f-cross">
                                           <span className="cross-small"><i className="fas fa-times"></i></span>
                                       </div>
                                   </div>
                                   <div className="f-line"></div>
                                   <div className="f-small-in">
                                       <div className="f-small-c">
                                           <div className="big-cross"><i className="fas fa-times"></i></div>
                                       </div>
                                       <div className="down-line" ></div>
                                   </div>
                                   <div className="down-circle" >
                                       <div className="down-c">
                                           <strong>MB</strong>
                                       </div>
                                   </div>
                               </div>
                       }
                           </div>
                   <div className="set_btn">
                       <button className="btn_set" onClick={() => setStep(1)}>
                           view detail
                       </button>
                   </div>
                       </div>
        );
    }
    else if (step === 1) {
        return (
          <div className="main_container">
                      <div>
                          <img className="logo_pos" src={Logo}/>
                      </div>
                            <div className="text_size" >
                                Preivew
                             </div>
                             <div>
                                 <div className="view-detail detail-h">
                                     <span className="fill-tick"><i className="far fa-check-circle"></i></span>
                                     <p className="light-text">Payment Sent</p>
                                 </div>
                             <div className="receipt-table">
                                 <table>
                                     {
                                         payer_name &&
                                         <tr>
                                             <td>From:</td>
                                             <td><span className="d-light-text">{payer_name}</span></td>
                                         </tr>
                                     }
                                     <tr>
                                         <td>To:</td>
                                         <td><span className="d-light-text" style={{textTransform:"uppercase"}}>{merchant_name}</span></td>
                                     </tr>
                                     <tr>
                                         <td>Amount:</td>
                                         <td><span className="d-light-text">£{amount && parseFloat(amount).toFixed(2)}</span></td>
                                     </tr>
                                     {/*<tr>*/}
                                     {/*    <td>Reference:</td>*/}
                                     {/*    <td><span>{refrence}</span></td>*/}
                                     {/*</tr>*/}
                                     <tr>
                                         <td>Bank:</td>
                                         <td><span className="d-light-text">{bank_name}</span></td>
                                     </tr>
                                     <tr>
                                         <td>Date:</td>
                                         <td><span className="d-light-text">{trans_date && moment(trans_date).format('Do MMM YYYY')}</span></td>
                                     </tr>
                                 </table>
                             </div>
                         </div>
                      <div className="btn">
                          <button className="btn_set" onClick={() => setStep(0)} >hide detail</button>
                      </div>
          </div>
        );
    }
}
export default Receipt;