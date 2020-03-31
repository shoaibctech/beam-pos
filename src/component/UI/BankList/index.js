import React from "react";
import './styles.css';

const BankList = () => {
    return (
        <>
            <a href="https://bank.barclays.co.uk/olb/authlogin/loginAppContainer.do#/identification" target="_blank">
                <img className="link_img" src={require('./img/Barclays-Logo.png')} alt="barclays"/>
            </a>
            <a href="https://onlinebusiness.lloydsbank.co.uk/business/logon/login.jsp?WT.ac=BO_Hero_Log&xdomcookies=ts:1577996318309,cp.OPTOUTMULTI:0%3A0%7Cc1%3A1%7Cc3%3A1%7Cc5%3A1%7Cc4%3A1%7Cc2%3A1,cp.AMCVS_230D643E5A2550980A495DB6@AdobeOrg:1,cp.AMCV_230D643E5A2550980A495DB6@AdobeOrg:-1303530583%7CMCIDTS%7C18264%7CMCMID%7C70628975446641993960216349249622011351%7CMCAAMLH-1578601117%7C6%7CMCAAMB-1578601117%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1578003517s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.3.0" target="_blank">
                <img className="link_img" src={require('./img/lloyds-bank-logo.png')} alt="LLoyds" />
            </a>
            <a href="https://www.business.hsbc.co.uk/1/2/!ut/p/b1/PYvLCoMwAAQ_KRsT8zhqaWqMD4ogmovkJILVi_j9TVG6t1lmiCdjQnkiwaQSZCB-C-cyh2PZt7D-2IsJ6CudIy0VBHVN6QTuRWGMwuOVFVxW8ejtE5bnHGltKCy7esXe2hjXKrS2azSr__3Hr9kXlgacdg!!/?IDV_URL" target="_blank">
                <img className="link_img" src={require('./img/HSBC-Logo.png')} alt="Hsbc" />
            </a>
            <a href="https://www.rbsdigital.com/default.aspx?CookieCheck=2020-01-03T19:54:28" target="_blank">
                <img className="link_img" src={require('./img/rbs-white.jpg')} alt="rbs bank" />
            </a>
            <a href="https://www.nwolb.com/Default.aspx?CookieCheck=2020-01-03T19:57:57" target="_blank">
                <img className="link_img" src={require('./img/Natwest-logo.png')} alt="nwolb" />
            </a>
            <a href="https://www.tide.co/?utm_source=Google%20Ads&utm_medium=CPC&utm_campaign=Brand-Exact&utm_content=TideBankOnline-E&utm_term=tide%20bank%20online&gclid=EAIaIQobChMInLSMgODl5gIVGeDtCh2qRAe5EAAYASAAEgKuZ_D_BwE" target="_blank">
                <img className="link_img" src={require('./img/tide-logo-lockup.png')} alt="tide" />
            </a>
        </>
    );
}

export default BankList;