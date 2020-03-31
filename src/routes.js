import React from "react";
import Home from "./container/Home";
import Callback from "./container/Callback";
import { Route, Switch } from "react-router-dom";

const MainRoute = () => {
    return(
        <div>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/callback" component={Callback} />
                <Route>
                    <p>Some thing went wrong</p>
                </Route>
            </Switch>
        </div>
    );
}

export default MainRoute;
