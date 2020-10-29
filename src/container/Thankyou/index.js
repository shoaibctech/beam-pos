import React, { useEffect } from 'react';
import './styles.css';
import { useHistory } from 'react-router-dom';

const ThankYou = () => {
    const history = useHistory();
    useEffect(() => {
        window.addEventListener("popstate", () => {
            history.go(1);
        });
    }, []);

    return (
        <div className="detail-error">
            <div className="detail-error-block">
                <div className="text-center"><img className="mark" src="https://junctionlogo.s3.ap-south-1.amazonaws.com/Lucie-default-padding.png" alt="mark"/>
                    <h2 className="text text-center mr-1">Thank you for using luciepay.</h2>
                </div>
            </div>
        </div>
    );
};
export default ThankYou;