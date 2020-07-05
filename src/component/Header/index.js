import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
// import auth0 from 'auth0-js';
import { useCookies } from "react-cookie";

import Logo from './img/Junction-pos.png';
import "./styles.css";
import {checkToken, removeUserData, getUserData} from "../../utils";

// const webAuth = new auth0.WebAuth({
//     domain: process.env.REACT_APP_AUTH0_DOMAIN,
//     clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
// });

const PathComponent = () => {
    let location = useLocation();

    if(location.pathname === '/signup') {
        return <Link to="/" style={{boxSizing: 'border-box'}}>Log in</Link>;
    } else {
        return location.pathname.split('/')[1] === 'bank' ? '' : <Link to="/signup" style={{boxSizing: 'border-box'}}>Sign Up</Link>;
    }
}

const Header = () => {
    const userData = getUserData();
    let history = useHistory();
    let location = useLocation();

    const [cookies, setCookie, removeCookie] = useCookies(['isToken']);

    const logout = async (e) => {
        removeUserData();
        removeCookie('isToken');
        // webAuth.logout({
        //     returnTo: window.location.origin
        // });
        history.push('/login');
        e.preventDefault();
    }
    return(
    location.pathname.substring(0, 6) === '/bank/' ?
        <div></div>
    :
        <header className="header">
            <div className="app-title">
                <h1><Link to='/'><img src={Logo} alt="logo" className="app-logo" /> </Link></h1>
            </div>
            <div>
                <div className="nav-link">
                    { cookies.isToken && checkToken() &&
                    <Link to="/transaction">Transactions</Link>
                    }
                </div>
            </div>
            <div className="logout">
                {
                    cookies.isToken && checkToken() ?
                        <div>
                            <p className="user-info">{userData.name}</p>
                            <button className="logout_btn" onClick={logout}>
                                Logout
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
