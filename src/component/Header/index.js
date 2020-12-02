import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
// import auth0 from 'auth0-js';
import { useCookies } from "react-cookie";

// import Logo from './img/Junction-pos.png';
import Logo from './img/Light-Logo.png';

import "./styles.css";
import { checkToken, removeUserData, getUserData, makeSecureRequest } from "../../utils";

// const webAuth = new auth0.WebAuth({
//     domain: process.env.REACT_APP_AUTH0_DOMAIN,
//     clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
// });

const PathComponent = () => {
    let location = useLocation();

    if(location.pathname === '/signup') {
        return <Link to="/" style={{boxSizing: 'border-box'}}>
            <strong className="theme-link cta">Log in</strong>
        </Link>;
    } else {
        return location.pathname.split('/')[1] === 'bank' ? '' : <Link to="/signup" style={{boxSizing: 'border-box'}}>
           <strong className="theme-link cta">Sign Up</strong>
        </Link>;
    }
}

const Header = () => {
    const userData = getUserData();
    let history = useHistory();
    let location = useLocation();

    const [cookies, setCookie, removeCookie] = useCookies(['isToken']);

    const logout = async (e) => {
        deleteUserData();
        removeUserData();
        removeCookie('isToken');
        // webAuth.logout({
        //     returnTo: window.location.origin
        // });
        history.push('/login');
        e.preventDefault();
    }
    const deleteUserData = () => {
       try {
           makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/delete`, {
           }, 'POST').then( res => {
               console.log('successfully removed data!');
           })
       } catch (e) {
           console.log("Error removing data!");
       }
    }

   if  (location.pathname.substring(0, 6) === '/bank/'
       || location.pathname.includes('/ch/bank')
       || location.pathname.includes('/thankyou')) {
        return (
            <div></div>
        );
    }
    return (
        <header className="header">
            <div className="app-title">
                <h1><Link to='/'><img src={Logo} alt="logo" className="app-logo" /> </Link></h1>
            </div>
            <div className="app-title">
                <div className="nav-link">
                    { cookies.isToken && checkToken() &&
                    <Link to="/transaction" className="mobile-nav-link">
                        Transactions
                    </Link>
                    }
                </div>
            </div>
            { userData && userData.merchant_type !== 'charity' &&
                <div>
                    <div className="nav-link">
                        { cookies.isToken && checkToken() &&
                        <Link to="/profile" className="mobile-nav-link">
                            Key Management
                        </Link>
                        }
                    </div>
                </div>
            }
            <div className="logout">
                {
                    cookies.isToken && checkToken() ?
                        <div>
                            <p className="user-info">
                                <strong>{userData.name}</strong>
                            </p>
                            <button className="logout_btn" onClick={logout}>
                                <strong>Logout</strong>
                            </button>
                        </div>
                        :
                        <PathComponent/>
                }
            </div>
        </header>
    );
}
export default Header;
