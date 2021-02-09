import React, {useEffect, useState} from 'react';
import Logo from "../../img/Dark.png";
import {Link, useLocation } from "react-router-dom";
import './styles.css';

const Sidebar = ({cookie, userData}) => {
    let location = useLocation();
    const [isActive, setActive] = useState('home');
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    useEffect(() => {
        setActive(location.pathname);
    }, [location.pathname]);

    console.log('is active  :: ', isActive);

    return (
    <div className="sidenav">
        <div className="main-logo-container">
            <img src={Logo} alt="beam" />
        </div>
        <br/>
        <div className={isActive === '/' ? 'link-list active-link' : 'link-list'}>
            <Link to="/">
                <i className="fas fa-cash-register"></i>
                Point of Sale
            </Link>
        </div>
        <div className={isActive === '/transaction' ? 'link-list active-link' : 'link-list'}>
            <Link to="/transaction">
                <i className="fas fa-comments-dollar"></i>
                Transactions
            </Link>
        </div>
        <div className={isActive === '/' ? 'link-list active-link' : 'link-list'}>
            <Link to="/">
                <i className="fas fa-paper-plane"></i>
                Send beam link
            </Link>
        </div>
        <div className="link-list" onClick={() => setIsSettingOpen(!isSettingOpen)}>
            <div className={isSettingOpen ? 'sidebar-submenu active-option' : 'sidebar-submenu'}>
               <span>
                    <i className="fas fa-user-cog"></i>
                    Setting
               </span>
               <span>
                   {isSettingOpen ? <i className="fas fa-angle-up theme-primary-color"></i> : <i className="fas fa-angle-down"></i>}
               </span>
            </div>
        </div>
        {
            isSettingOpen &&
            <div className="sidebar-submenu-content">
                <div className={isActive === '/merchant-edit' ? 'link-list active-link' : 'link-list'}>
                    <Link to="/merchant-edit">
                        <i className="fas fa-upload"></i>
                        Merchant Logo
                    </Link>
                </div>
                <div className={isActive === '/profile' ? 'link-list active-link' : 'link-list'}>
                    <Link to="/profile">
                        <i className="fas fa-key"></i>
                        Key Management
                    </Link>
                </div>
                <div className={isActive === '/msetting' ? 'link-list active-link' : 'link-list'}>
                    <Link to="/msetting">
                        <i className="fas fa-key"></i>
                        Sms Notification
                    </Link>
                </div>
            </div>
        }
    </div>
    );
}

export default Sidebar;