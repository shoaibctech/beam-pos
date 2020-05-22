import React from 'react';


const AUTH_LINK = 'https://auth.truelayer.com/?response_type=code&client_id=connectedtech-1e45a8&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=http://nuapay-frontend-pos.herokuapp.com/signup&providers=uk-ob-all%20uk-oauth-all%20uk-cs-mock';

const ConnectBank = () => {
    return (
        <div className="login-container" style={{textAlign: "center"}}>
            <a href={AUTH_LINK} target="_blank" >Please verify your bank details</a>
        </div>
    );
}

export default ConnectBank;
