import React from 'react';


const AUTH_LINK = process.env.REACT_APP_AUTH_LINK;

const ConnectBank = () => {
    return (
        <div className="login-container" style={{textAlign: "center"}}>
            <a href={AUTH_LINK} target="_blank" >Please verify your bank details</a>
        </div>
    );
}

export default ConnectBank;
