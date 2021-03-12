import React from "react";
import Home from "./container/Home";
import Callback from "./container/Callback";
import { Route, Switch } from "react-router-dom";
import Nuapay from "./container/Nuapay";
import Bank from "./container/Bank";
import Signup from "./component/Signup";
import Verify from "./component/Verify";
import ConnectBank from "./component/ConnectBank";
import Transactions from "./container/Transactions";
import PrivateRoute from "./component/PrivateRoute";
import Signin from "./component/Signin";
import Charity from "./container/Charity";
import ThankYou from "./container/Thankyou";
import Receipt from "./container/Receipt";
import Profile from "./container/Profile";
import MerchantEdit from "./container/MerchantEdit";
import MessageSetting from "./component/MessageSetting";
import DirectDebit from "./container/DirectDebit";
import DDBank from "./container/DDBank";
import SignDDI from "./container/SignDDI";
import DemoModal from "./container/DemoModal";

import { getUserData } from "./utils";

const MainRoute = () => {
    return(
        <div>
            <Switch>
                <PrivateRoute path="/" exact component={ getUserData() && getUserData().merchant_type === 'charity' ? Charity : Home} />
                <Route path="/login" exact component={Signin}/>
                <Route path="/signup" exact component={Signup}/>
                <Route path="/callback" component={Callback} />
                <Route path="/nuapay" exact component={Nuapay} />
                <Route path="/bank/:token/:payment_type?/:bankId?"  component={Bank} />
                <Route path="/ch/bank/:token"  component={Bank} />
                <Route path="/verify" component={Verify}/>
                <Route path="/verifybank" exact component={ConnectBank}/>
                <PrivateRoute path="/transaction" exact component={Transactions}/>
                <Route path="/thankyou" exact component={ThankYou} />
                <Route path="/paymentdetails/:amount?/:currency?/:bank_name?/:merchant_name?/:status?/:trans_date?/:payer_name?" component={Receipt} />
                <PrivateRoute path="/profile" exact component={Profile} />
                <PrivateRoute path="/merchant-edit" exact component={MerchantEdit} />
                <PrivateRoute path="/msetting" exact component={MessageSetting} />
                <PrivateRoute path="/beamlink" exact component={Home} />
                <Route path="/directdebit" exact component={DirectDebit} />
                <Route path="/d/bank" exact component={DemoModal} />
                <Route path="/directdebit/bank/:token" exact component={DDBank} />
                <Route path="/directdebit/signddi/:paymentId" exact component={SignDDI} />
                <Route>
                    <p>Some thing went wrong</p>
                </Route>
            </Switch>
        </div>
    );
}

export default MainRoute;
