import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

import Logo from './img/Junction-pos.png';

const Header = () => {
    const logout = (e) => {
        localStorage.clear();
        window.location.replace('/');
        e.preventDefault();
    }
    return(
        <header className="header">
            {/*<div className="logo">*/}
            {/*    <img src={Junction} alt="Lucy"/>*/}
            {/*</div>*/}
            <div className="app-title">
                <h1><Link to='/'><img src={Logo} alt="logo" className="app-logo" /> </Link></h1>
            </div>
            <div className="logout">
                {
                    localStorage.getItem('auth_token') && localStorage.getItem('auth_token').length > 5 ?
                        <button className="logout_btn" onClick={logout}>
                            Logout
                        </button>
                        :
                        ''
                }
            </div>
        </header>
    );
}
export default Header;
