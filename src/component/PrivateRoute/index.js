// src/components/PrivateRoute.js

import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth_token');

    useEffect(() => {
        if (isAuthenticated) {
            return;
        }
    }, [ isAuthenticated]);

    const render = props =>
        isAuthenticated && isAuthenticated.length > 5 ? <Component {...props} /> : <Redirect to="/" />;

    return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
