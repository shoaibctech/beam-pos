// src/components/PrivateRoute.js

import React  from "react";
import { Route, Redirect } from "react-router-dom";
import {checkToken} from "../../utils";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
    const isAuthenticated = checkToken();

    console.log('s ', isAuthenticated);
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         return;
    //     }
    // }, [ isAuthenticated]);

    const render = props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />;

    return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
