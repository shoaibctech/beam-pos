import React  from "react";
import { Link, useLocation } from "react-router-dom";

import Logo from './img/Junction-pos.png';
import "./styles.css";

const PathComponent = () => {
    let location = useLocation();

    if(location.pathname === '/signup') {
        return <Link to="/" style={{boxSizing: 'border-box'}}>Log in</Link>;
    } else {
        return <Link to="/signup" style={{boxSizing: 'border-box'}}>Sign Up</Link>
    }
}


const Header = () => {
    const logout = (e) => {
        localStorage.clear();
        window.location.replace('/');
        e.preventDefault();
    }

    return(
        <header className="header">
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
                        <PathComponent/>
                }
            </div>
        </header>
    );
}
export default Header;
