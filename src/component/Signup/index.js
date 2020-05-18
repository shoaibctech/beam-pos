import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import request from 'request';


const Signup = () => {
    let history = useHistory();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [merchantId, setMerchantId] = useState('');
    const [errors, setErrors] = useState({email:'', password:'', merchantId: ''});

    const onSignup = () => {

        var options = {
            method: 'POST',
            url: 'https://dev-ulr4x749.auth0.com/dbconnections/signup',
            headers: {'content-type': 'application/json'},
            body: {
                client_id: 'XORs41wWGZN6sFlmGXLApXkYJWEnTB50',
                username: userName,
                email: email,
                password: password,
                connection: 'Username-Password-Authentication',
                name: userName,
                user_metadata: {BankId: 'redId'}
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            history.push('/');
        });

    }

    return (
        <Fragment>
            <div className="login-container">
                <div className="row">
                    <div>
                        <h1>Welcome to junction</h1>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="row">
                    <div className="icon">
                        <img src={BotUser} alt="Lucy" />
                    </div>
                    <div>
                        <Input
                            error={errors.email}
                            name="email"
                            type="text"
                            value={email}
                            handleChange={setEmail}
                            placeholder="Email"
                        />
                    </div>
                </div>
                <br/>
                <br/>
                <div className="row">
                    <div className="icon">
                        <img src={BotUser} alt="Lucy" />
                    </div>
                    <div>
                        <Input
                            error={errors.userName}
                            name="userName"
                            type="text"
                            value={userName}
                            handleChange={setUserName}
                            placeholder="User Name"
                        />
                    </div>
                </div>
                <br/>
                <br/>
                <div className="row">
                    <div className="icon">
                        <img src={Key} alt="Lucy" />
                    </div>
                    <div>
                        <Input
                            error={errors.password}
                            name="password"
                            type="password"
                            value={password}
                            handleChange={setPassword}
                            placeholder="Password"
                        />
                    </div>
                </div>
                <br/>
                <br/>
                <div className="row">
                    <div className="icon">
                        <img src={Key} alt="Lucy" />
                    </div>
                    <div>
                        <Input
                            error={errors.merchantId}
                            name="merchantId"
                            type="text"
                            value={merchantId}
                            handleChange={setMerchantId}
                            placeholder="Merchant Id"
                        />
                    </div>
                </div>
                <br/>
                <br/>
                <div className="bottom-section-container">
                    <div className="bottom-section">
                        <input type="button" value="Sign Up" onClick={onSignup}/>
                    </div>
                    <div></div>
                </div>
            </div>
        </Fragment>
    );
}

export default Signup;
