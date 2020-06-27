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
    const [conPassword, setConPassword] = useState('');
    const [errors, setErrors] = useState({email:'', password:'', conPassword:'', merchantId: '', status: ''});
    const [name, setName] = useState();
    const [orgs, setOrgs] = useState([]);

    useEffect( () => {
        getMerchants();
    }, [])

    const onSignup = () => {
        let merchant = orgs.filter( org => org.contact.email1 === email)
        let account;

        if (!validateForm()) {
            return;
        }

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
                client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
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
    const validateForm = () => {

        let formIsValid = true;
        errors.email = '';
        errors.password = '';
        errors.conPassword = '';

        if(!email) {
            formIsValid = false;
            errors.email = 'Enter your email!'
        }
        if(typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors.email = 'Please enter valid email!';
            }
        }

        if(password.length < 1) {
            errors.password = 'Password must not be empty!';
            formIsValid = false;
        }
        if(conPassword.length < 1) {
            errors.conPassword = 'Confirm Password must not be empty!';
            formIsValid = false;
        }
        if(password !== conPassword) {
            errors.conPassword = 'Confirm password did not match!';
            formIsValid = false;
        }

        setErrors( prevState => {
            return {...prevState, ...errors}
        });
        return formIsValid;

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
                <div className="row">
                    <div className="icon">
                        <img src={Key} alt="key icon" />
                    </div>
                    <div>
                        <label className="label">Confirm Password</label>
                        <Input
                            error={errors.conPassword}
                            name="confirmPassword"
                            type="password"
                            value={conPassword}
                            handleChange={setConPassword}
                            placeholder="Confirm Password"
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
