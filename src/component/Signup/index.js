import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import request from 'request';
import { makeRequest } from "../../utils";

import './styles.css';


const Signup = () => {
    let history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({email:'', password:'', merchantId: '', status: ''});
    const [name, setName] = useState();
    const [orgs, setOrgs] = useState([]);

    useEffect( () => {
        getMerchants();
    }, [])

    const onSignup = () => {
        let merchant = orgs.filter( org => org.contact.email1 === email)
        let account;
        if(merchant.length > 0){
            account = merchant[0];
            setName(merchant[0].name);
        } else {
            errors.status = 'This ' + email + ' is not allowed. Please try different email...';
            setErrors(prevState => ({...prevState, ...errors}))
            return;
        }

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
                    merchant_id: account.id,
                    first_name: account.contact.firstName,
                    last_name: account.contact.lastName,
                }
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            if(body.statusCode === '400' || body.statusCode === 400 ){
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
    const getMerchants = async () => {
        try {
            const req =  await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/getorgs`, {}, 'GET');
            setOrgs( prevState => ([...prevState, ...req.data.orgs]))
        } catch (e) {
            console.log('merchant fetching failed')
        }
    }

    return (
        <Fragment>
            <div className="login-container">
                <div className="row">
                    <div>
                        <h1>Welcome to junction</h1>
                    </div>
                </div>
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<div className="row">*/}
                {/*    <div>*/}
                {/*        <p style={{marginLeft: '10%', marginRight: '10%', fontFamily: 'none'}}>*/}
                {/*            Hi <strong>{name}</strong>, welcome to Junction. We've now got all your details, just need your email address and*/}
                {/*           a password to finish creating your account.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}
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
