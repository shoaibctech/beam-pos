import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import request from 'request';
import axios from 'axios';

import './styles.css';


const Signup = () => {
    let history = useHistory();
    let location = useLocation();
    const [userName, setUserName] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [merchantId, setMerchantId] = useState('');
    const [isFilled, setIsFilled] = useState(false);
    const [errors, setErrors] = useState({email:'', password:'', merchantId: '', status: ''});
    const [account, setAccount] = useState({});
    const [accountList, setAccountList] = useState([]);
    const [name, setName] = useState('');

    useEffect( () => {
        const access_token = location.search ? location.search.split('&')[0].substr(6) : null;
        if(access_token){
            setAccessToken(access_token);
            console.log('access_ token :: ', access_token);
            getToken(access_token);
        }
    }, [])

    const getToken = async (token) => {
        const res = await  axios.post(`${process.env.REACT_APP_NUAPAY_API}/api/datatoken`, {code: token})
        setAccountList(res.data.accounts);
        setAccount(res.data.accounts[0]);
        setName(res.data.accounts[0].display_name)
    }

    const onSignup = () => {

        var options = {
            method: 'POST',
            url: 'https://dev-1e11vioj.eu.auth0.com/dbconnections/signup',
            headers: {'content-type': 'application/json'},
            body: {
                client_id: 'eSfzYw2LlW9FcF00Em0xmuGF3giFHzCE',
                email: email,
                password: password,
                connection: 'Username-Password-Authentication',
                name: name,
                user_metadata: {
                    account_number: account.account_number.number,
                    sort_code: account.account_number.sort_code,
                }
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log('error ::', error)
            console.log('body ::', body);

            if(body.statusCode == '400' || body.statusCode == 400 ){
                console.log('des ::', body.description)
                errors.status = body.message || body.description;
                let data = {...errors};
                setErrors(data)
            } else if (body.error){
                errors.status = body.error;
                let data = {...errors};
                setErrors(data)
            } else  {
                history.push('/');
            }
        });

    }
    const handleChange = (event) => {
        setName(event.target.value);
        const selectedAccount = accountList.filter( data => data.display_name === event.target.value)
        setAccount(selectedAccount[0]);
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
                    <div>
                        <p style={{marginLeft: '10%', marginRight: '10%', fontFamily: 'none'}}>
                            Hi <strong>{name}</strong>, welcome to Junction. We've now got all your details, just need your email address and
                           a password to finish creating your account.
                        </p>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="row">
                    <div className="icon">
                        <img src={BotUser} alt="Lucy" />
                    </div>
                    <div>
                        <label className="label">Email</label>
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
                        <img src={Key} alt="Lucy" />
                    </div>
                    <div>
                        <label className="label">Password</label>
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
                <div className="bottom-section-container">
                    <div className="bottom-section">
                        <input type="button" value="Sign Up" onClick={onSignup}/>
                    </div>
                    <div></div>
                </div>
                <div className="bottom-section-container">
                    <div className="bottom-section">
                        {
                            errors.status && <p className="forget-password" style={{color: 'red'}}>{errors.status}</p>
                        }
                    </div>
                    <div></div>
                </div>
            </div>
        </Fragment>
    );
}

export default Signup;
