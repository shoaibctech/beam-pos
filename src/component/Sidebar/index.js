import React, {useEffect, useState} from 'react';
import Logo from "../../img/Dark.png";
import {Link, useLocation } from "react-router-dom";
import './styles.css';

const Sidebar = ({cookie, userData, setPathName}) => {
    let location = useLocation();
    const [isActive, setActive] = useState('home');
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    useEffect(() => {
        setActive(location.pathname);
        setPathName(location.pathname);
        
        if (window.innerWidth <= 768) {
            document.getElementById('sidenavbar').style.display = 'none';
        }
    }, [location.pathname]);


    return (
    <div className="sidenav" id="sidenavbar">
        <span className="sidenav-close-icon" onClick={() => {
            document.getElementById('sidenavbar').style.display = 'none';
        }}>
            <i className="fas fa-times"></i>
        </span>
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
        <div className={isActive === '/beamlink' ? 'link-list active-link' : 'link-list'}>
            <Link to="/beamlink">
                <i className="fas fa-paper-plane"></i>
                Beam link
            </Link>
        </div>
        <div className="link-list" onClick={() => setIsSettingOpen(!isSettingOpen)}>
            <div className={'sidebar-submenu'}>
               <span>
                    <i className="fas fa-user-cog"></i>
                    Settings
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
                {/*<div className={isActive === '/msetting' ? 'link-list active-link' : 'link-list'}>*/}
                {/*    <Link to="/msetting">*/}
                {/*        <i className="fas fa-key"></i>*/}
                {/*        Sms Notification*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </div>
        }
    </div>
    );
}

export default Sidebar;