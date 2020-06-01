import React from 'react';
import './styles.css'

const AUTH_LINK = process.env.REACT_APP_AUTH_LINK;


const ConnectBank = () => {
    const redirectToTrueLayer = () => {
        window.open(AUTH_LINK, '_blank')
    }
    return (
        <div className="login-container" style={{textAlign: "center"}}>
            <div>
                <p style={{fontFamily: 'none'}}>
                    Hi there, to make onboarding simple we are going to authenticate you using your bank details.
                    Simply your details below in a few clicks. Don't worry, it's super secure.
                </p>
            </div>
            <br/>
            <br/>
            <br/>
            <div>
                <button className="verify-btn" onClick={()=> redirectToTrueLayer()} >verify</button>
            </div>
        </div>
    );
}

export default ConnectBank;
