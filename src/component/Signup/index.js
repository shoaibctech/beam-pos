import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import request from 'request';
import { makeRequest, validateEmail } from "../../utils";

import './styles.css';
import Loader from "../UI/Loader";


const Signup = () => {
    // let history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [errors, setErrors] = useState({email:'', password:'', conPassword:'', merchantId: '', status: ''});
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);

    useEffect( () => {
        getMerchants();
    }, [])

    const onSignup = async () => {
        let merchant = orgs.filter( org => org.contact.email1.toLowerCase().trim() === email.toLowerCase());
        let account;
        setIsSignedUp(false);

        if (!validateForm()) {
            return;
        }

        if(merchant.length > 0){
            account = merchant[0];
        } else {
            errors.status = 'This ' + email + ' is not allowed. Please try different email...';
            setErrors(prevState => ({...prevState, ...errors}))
            return;
        }

        setLoading(true);

        //check if merchant is enhanced (have Nuapay bank account)
        const enhancedData = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/account/enhanced`, {
            merchantId: account.id
        }, 'POST');

        var options = {
            method: 'POST',
            url: 'https://dev-1e11vioj.eu.auth0.com/dbconnections/signup',
            headers: {'content-type': 'application/json'},
            body: {
                client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
                email: email.toLowerCase(),
                password: password,
                connection: 'Username-Password-Authentication',
                name: account.name,
                user_metadata: {
                    merchant_id: account.id,
                    first_name: account.contact.firstName,
                    last_name: account.contact.lastName,
                    account_type: enhancedData.data.enhanced ? 'enhanced' : 'basic',
                    beneficiary_id: "",
                    merchant_type: "nontip"
                }
            },
            json: true
        };

        request(options, async function (error, response, body) {
            if (error) throw new Error(error);

            if(body.statusCode === '400' || body.statusCode === 400 ){
                console.log('des ::', body.description)
                errors.status = body.message || body.description;
                let data = {...errors};
                setErrors(data)
                setLoading(false);
            } else if (body.error){
                errors.status = body.error;
                let data = {...errors};
                setErrors(data)
                setLoading(false);
            } else  {
                await saveMerchant(account.id, account.name, account.id, '');
                setLoading(false);
                // history.push('/');
                setIsSignedUp(true);
            }
        });
    }
    const saveMerchant = async (m_id, m_name, m_hash, m_logo ) => {
        try {
            const req =  await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/create_update`, {
                name: m_name,
                logo: m_logo,
                email: email,
                nuapay_merchant_id: m_id,
                merchant_hash: m_hash
            }, 'POST');
            console.log('data ', req.data)
        } catch (e) {
            console.log('merchant fetching failed')
        }
    }
    const getMerchants = async () => {
        try {
            const req =  await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchants`, {}, 'GET');
            setOrgs( prevState => ([...prevState, ...req.data.orgs]))
            console.log('data ', req.data)
        } catch (e) {
            //Todo: add check if this api fails
            console.log('merchant fetching failed')
        }
    }
    const validateForm = () => {

        let formIsValid = true;
        errors.email = '';
        errors.password = '';
        errors.conPassword = '';
        const isValidEmail = validateEmail(email);

        if(!!isValidEmail){
            errors.email = isValidEmail;
            formIsValid = false;
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
                        <h1>Welcome to beam.</h1>
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
                            handleChange={(value) => {
                                setEmail(value);
                                setErrors(prevState => ({...prevState, email: ''}));
                            }}
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
                            handleChange={(value) => {
                                setPassword(value);
                                setErrors(prevState => ({...prevState, password: ''}));
                            }}
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
                            handleChange={(value) => {
                                setConPassword(value);
                                setErrors(prevState => ({...prevState, conPassword: ''}));
                            }}
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>
                <br/>
                <div className="bottom-section-container">
                    <div className="bottom-section">
                        <button className="confirm-btn" style={{width: '100%'}} onClick={onSignup}>
                            {loading ? <Loader size="2rem" color="secondary"/> : 'Sign Up'}
                        </button>
                    </div>
                    <div></div>
                </div>
                {
                    isSignedUp &&
                    <div className="bottom-section-container signup-link">
                        <p className="mr-1" style={{color: "green"}}>You account has been registered. <Link to="/">click here to Login</Link></p>
                    </div>
                }
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
