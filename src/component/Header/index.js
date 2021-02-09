import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
// import auth0 from 'auth0-js';
import { useCookies } from "react-cookie";

// import Logo from './img/Junction-pos.png';
import Logo from './img/Light-Logo.png';
import Logout from "../Logout";
import Avatar from '@material-ui/core/Avatar';

import "./styles.css";
import { checkToken, removeUserData, getUserData, makeSecureRequest } from "../../utils";

// const webAuth = new auth0.WebAuth({
//     domain: process.env.REACT_APP_AUTH0_DOMAIN,
//     clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
// });

const COMPONENT_NAMES = {
    '/': 'Home',
    '/profile': 'Key Management',
    '/transaction': 'Transactions',
    '/merchant-edit': 'Upload Merchant Brand Icon',
    '/msetting': 'Sms Notification Setting'
};

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
    const [isShowMenu, setIsShowMenu] = useState(false);

    const [cookies, setCookie, removeCookie] = useCookies(['isToken']);
    const ref = useRef(null);

    const handleHideDropdown = (event) => {
        if (event.key === "Escape") {
            setIsShowMenu(false);
        }
    };

    const handleClickOutside = event => {
        // if (ref.current && !ref.current.contains(event.target)) {
        if (ref.current && event.target.id !== 'logout-btn' && event.target.id !== 'menu-btn-id') {
            setIsShowMenu(false);
        }
    };

    useEffect(() => {
        if (typeof handleClickOutside == 'function' && typeof handleHideDropdown == 'function'){
            document.addEventListener("keydown", handleHideDropdown, true);
            document.addEventListener("click", handleClickOutside, true);
        }

        return () => {
            if (typeof handleClickOutside == 'function' && typeof handleHideDropdown == 'function') {
                document.removeEventListener("keydown", handleHideDropdown, true);
                document.removeEventListener("click", handleClickOutside, true);
            }
        };
    });


    const logout = async (e) => {
        deleteUserData();
        removeUserData();
        removeCookie('isToken');
        // webAuth.logout({
        //     returnTo: window.location.origin
        // });
        // console.log('Logout remove cookie.')
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

   const getNameAcronym = (name) => {
       var matches = name.match(/\b(\w)/g); // ['J','S','O','N']
       var acronym = matches.join(''); // JSON
       acronym = acronym.substr(0, 2);

       let nameAcronymElement = <span className="acronym">{acronym.toUpperCase()}</span>
       // let nameAcronymElement = <Avatar>{acronym.toUpperCase()}</Avatar>
           // <span className="acronym"></span>
       return nameAcronymElement;
   }
    // console.log(cookies.isToken);
    // console.log(checkToken());
    return (
        <header className="header">
            { ( !checkToken()) ?
                <div className="app-title">
                    <h1><Link to='/'><img src={Logo} alt="logo" className="app-logo" /> </Link></h1>
                </div>
                :
                <h3 className="component-names">{COMPONENT_NAMES[location.pathname]}</h3>
            }
            {/*<div className="app-title">*/}
            {/*    <div className="nav-link">*/}
            {/*        { cookies.isToken && checkToken() &&*/}
            {/*        <Link to="/transaction" className="mobile-nav-link">*/}
            {/*            Transactions*/}
            {/*        </Link>*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="logout">
                {
                    cookies.isToken && checkToken() ?
                        <div>
                                {
                                    <span className="cursor-pointer" id="menu-btn-id" onClick={() => setIsShowMenu(!isShowMenu)}>
                                        {userData && getNameAcronym(userData.name)}
                                        {userData && userData.name} {' '}
                                        {isShowMenu ? <i className="fas fa-angle-up theme-primary-color"></i> :
                                            <i className="fas fa-angle-down theme-primary-color"></i> }
                                    </span>
                                }
                                { isShowMenu &&
                                <div ref={ref}>
                                    <Logout cookies={cookies} logout={logout} userData={userData}/>
                                </div>
                                }
                        </div>
                        :
                        <PathComponent/>
                }
            </div>
        </header>
    );
}
export default Header;
