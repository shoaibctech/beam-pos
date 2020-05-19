import React, { useEffect } from 'react';

const Verify = () => {
    useEffect(()=> {
     localStorage.clear();
    })
    return (
        <div style={{textAlign: 'center', marginTop: '4rem'}}>
            <p>
                Please Verify your email address before login...
            </p>
        </div>
    );
}

export default Verify;
