import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';
import MainRoute from "./routes";
import Header from "./component/Header";

import { useCookies } from "react-cookie";
import { getUserData } from "./utils";
import Logo from './img/Dark.png';

const App = () => {
    const userData = getUserData();

    const [cookie, setCookie] = useCookies(['isToken'])
    const [isActive, setActive] = useState('home')
    // console.log('cookie :: ', cookie);

    console.log('location', window.location.pathname)
    return (
        <div>
            <div id="content">
                <Router>
                    <div>
                        {
                          cookie.isToken && userData &&
                            <div className="sidenav">
                                <div className="main-logo-container">
                                    <img src={Logo} alt="beam" />
                                </div>
                                <br/>
                                <div className="link-list" onClick={(e) => console.log(e.target)}>
                                    <Link to="/">
                                        <i className="fas fa-cash-register"></i>
                                        Point of Sale
                                    </Link>
                                </div>
                                <div className="link-list">
                                    <Link to="/transaction">
                                        <i className="fas fa-comments-dollar"></i>
                                        Transactions
                                    </Link>
                                </div>
                                <div className="link-list">
                                    <Link to="/">
                                        <i className="fas fa-paper-plane"></i>
                                        Send beam link
                                    </Link>
                                </div>
                                <div className="link-list">
                                    <Link to="/merchant-edit">
                                        <i className="fas fa-upload"></i>
                                        Merchant Logo
                                    </Link>
                                </div>
                                <div className="link-list">
                                    <Link to="/profile">
                                        <i className="fas fa-key"></i>
                                        Key Management
                                    </Link>
                                </div>
                            </div>
                        }
                        <div className={(cookie.isToken && userData) ? 'main-login-block' : ''}>
                            <Header/>
                            <MainRoute/>
                        </div>
                    </div>
                </Router>
            </div>
        </div>
    );
}

export default App;
