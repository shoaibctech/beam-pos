import React, { useEffect } from 'react';
import './styles.css';

const Toast = ({type, text}) => {
    // useEffect(() => {
    //     setTimeout(() => {
    //         document.getElementById('toastId').style.display = 'none';
    //     }, 1000);
    // }, []);
    return (
        <div className={`${type} toast`} id="toastId">
            <p>{text}</p>
        </div>
    );
}
export default Toast;