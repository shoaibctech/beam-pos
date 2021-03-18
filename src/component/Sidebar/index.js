import React, {useEffect, useState} from 'react';
import Logo from "../../img/Dark.png";
import {Link, useLocation, useHistory } from "react-router-dom";
import { getUserData } from "../../utils";
import './styles.css';
import useViewport from "../../utils/useViewPort/useViewPort";

const Sidebar = ({cookie, userData, setPathName}) => {
    const history = useHistory();
    let location = useLocation();
    const [isActive, setActive] = useState('home');
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const { merchant_type } = getUserData();
    const {width} = useViewport();

    useEffect(() => {
        setActive(location.pathname);
        setPathName(location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    useEffect(() => {
        if (width <= 768) {
            document.getElementById('sidenavbar').style.display = '0';
        } else {
            document.getElementById('sidenavbar').style.display = '200px';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width])


    return (
    <div className="sidenav" id="sidenavbar">
        <span className="sidenav-close-icon" onClick={() => {
            document.getElementById('sidenavbar').style.width = '0';
        }}>
            <i className="fas fa-times"></i>
        </span>
        { width > 768 &&
            <div className="main-logo-container cursor-pointer">
                <img src={Logo} alt="beam"  onClick={() => {
                    merchant_type !== 'charity' ?
                        history.push('/transaction') : history.push('/')
                }}/>
            </div>
        }
        <br/>
        <div className={isActive === '/transaction' ? 'link-list active-link' : 'link-list'}>
            <Link to="/transaction">
                <i className="fas fa-comments-dollar"></i>
                Transactions
            </Link>
        </div>
        <div className={isActive === '/' ? 'link-list active-link' : 'link-list'}>
            <Link to="/">
                {
                    merchant_type === 'charity' ?
                        <i className="fas fa-donate"></i> : <i className="fas fa-cash-register"></i>
                }
                {
                    merchant_type === 'charity' ?
                     'Charity' : 'Point of Sale'
                }
            </Link>
        </div>
        {
            merchant_type !== 'charity' &&
            <div className={isActive === '/beamlink' ? 'link-list active-link' : 'link-list'}>
                <Link to="/beamlink">
                    <i className="fas fa-paper-plane"></i>
                    Beam link
                </Link>
            </div>
        }
        {/*{*/}
        {/*    merchant_type !== 'charity' &&*/}
        {/*    <div className={isActive === '/directdebit' ? 'link-list active-link' : 'link-list'}>*/}
        {/*        <Link to="/directdebit">*/}
        {/*            <i className="fas fa-money-bill"></i>*/}
        {/*            Direct Debit*/}
        {/*        </Link>*/}
        {/*    </div>*/}
        {/*}*/}
        <div className="link-list" onClick={() => setIsSettingOpen(!isSettingOpen)}>
            <div className={'sidebar-submenu'}>
               <span>
                    <i className="fas fa-cogs"></i>
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
                        <i className="fas fa-user"></i>
                        Account
                    </Link>
                </div>
                {
                    merchant_type !== 'charity' &&
                    <div className={isActive === '/profile' ? 'link-list active-link' : 'link-list'}>
                        <Link to="/profile">
                            <i className="fas fa-key"></i>
                            Key Management
                        </Link>
                    </div>
                }
                {/*<div className={isActive === '/msetting' ? 'link-list active-link' : 'link-list'}>*/}
                {/*    <Link to="/msetting">*/}
                {/*        <i className="fas fa-key"></i>*/}
                {/*        SMS Notification*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </div>
        }
    </div>
    );
}

export default Sidebar;