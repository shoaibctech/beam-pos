import React, { useEffect } from 'react';
import './styles.css';
import { useHistory } from 'react-router-dom';
import Logo from '../../component/Header/img/Light-Logo.png'

const ThankYou = () => {
    const history = useHistory();
    useEffect(() => {
        window.addEventListener("popstate", () => {
            history.go(1);
        });
    }, []);

    return (
        <div className="detail-error">
            <div className="thankyou-container">
               <div className="thankyou-box">
                   <img className="mark" src={Logo} alt="mark"/>
                   <h3 className="mr-1">Thank you for using <strong>beam.</strong></h3>
               </div>
            </div>
        </div>
    );
};
export default ThankYou;