import React from 'react';
import {checkToken} from "../../utils";
import {Link} from "react-router-dom";

const Logout = ({cookies, userData, logout}) =>{
    return (
        <div className="logout-dropdown">
            {/*<span className="cross-icon cursor-pointer" onClick={() => setIsShowMenu(false)}>*/}
            {/*       <i className="fa fa-times" aria-hidden="true"></i>*/}
            {/*</span>*/}
            <ul>
                <li>
                   <span>
                        <i className="fas fa-user"></i>
                   </span>
                    <span className="cursor-pointer">
                        <strong>
                            {userData.name}
                        </strong>
                    </span>
                </li>
                {/*{ userData && userData.merchant_type !== 'charity' &&*/}
                {/*<li>*/}
                {/*    <span>*/}
                {/*        <i className="fas fa-key"></i>*/}
                {/*    </span>*/}
                {/*    { cookies.isToken && checkToken() &&*/}
                {/*    <Link to="/profile" className="mobile-nav-link">*/}
                {/*        Key Management*/}
                {/*    </Link>*/}
                {/*    }*/}
                {/*</li>*/}
                {/*}*/}
                {/*{ userData &&*/}
                {/*<li>*/}
                {/*    <span>*/}
                {/*        <i className="fas fa-upload"></i>*/}
                {/*    </span>*/}
                {/*    { cookies.isToken && checkToken() &&*/}
                {/*    <Link to="/merchant-edit" className="mobile-nav-link">*/}
                {/*        Merchant Logo*/}
                {/*    </Link>*/}
                {/*    }*/}
                {/*</li>*/}
                {/*}*/}
                <li>
                    <span>
                        <i className="fas fa-sign-out-alt"></i>
                    </span>
                    <span className="cursor-pointer" name="logout-btn" id="logout-btn" onClick={logout}>Logout</span>
                </li>
            </ul>
        </div>
    );
}

export default Logout;