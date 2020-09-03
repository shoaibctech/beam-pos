// src/components/PrivateRoute.js

import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import {checkToken, removeUserData} from "../../utils";


const PrivateRoute = ({ component: Component, path, ...rest }) => {
    const history = useHistory();
    const isAuthenticated = checkToken();
    const [cookies, setCookie, removeCookie] = useCookies(['isToken']);

        if(!cookies.isToken){
            removeCookie('isToken');
            removeUserData();
        }
    const render = props =>
        isAuthenticated && cookies.isToken ? <Component {...props} /> : <Redirect to="/login" />;

    return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
