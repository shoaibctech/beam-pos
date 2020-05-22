import React from "react";
import Home from "./container/Home";
import Callback from "./container/Callback";
import { Route, Switch } from "react-router-dom";
import Nuapay from "./container/Nuapay";
import Bank from "./container/Bank";
import Signup from "./component/Signup";
import Verify from "./component/Verify";
import ConnectBank from "./component/ConnectBank";


const MainRoute = () => {
    return(
        <div>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signup" exact component={Signup}/>
                <Route path="/callback" component={Callback} />
                <Route path="/nuapay" exact component={Nuapay} />
                <Route path="/bank/:org_id/:amount"  component={Bank} />
                <Route path="/verify" component={Verify}/>
                <Route path="/verifybank" exact component={ConnectBank}/>
                <Route>
                    <p>Some thing went wrong</p>
                </Route>
            </Switch>
        </div>
    );
}

export default MainRoute;
