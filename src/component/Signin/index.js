import React, {useState} from 'react';
// import { useHistory } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import auth0 from "auth0-js";
import {setUserData, setToken,} from '../../utils/index';
import ForgetPassword from '../ForgetPassword';
import jwt from 'jwt-decode';

var webAuth = new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
});
const namespace = "https://posjunction.com";

const Signin = ({userName, setUserName, password, setPassword, setLoading, setStep, step}) =>  {

    const [message, setMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState({userName: '', password: ''});

    const signin = async () => {
        setLoading(true)
        if(!validateFields()) {
            setLoading(false);
            return;
        }


        webAuth.client.login({
            realm: 'Username-Password-Authentication',
            username: userName,
            email: userName,
            password: password,
            scope: 'openid user_metadata',
        }, (err, res) => {
            if(err) {
                console.log('error ::', err)
                setMessage(err.description);
                setLoading(false);
            } else {
                const decodedIdToken = jwt(res.idToken);
                decodedIdToken.first_name = decodedIdToken[`${namespace}/first_name`];
                decodedIdToken.last_name = decodedIdToken[`${namespace}/last_name`];
                decodedIdToken.merchant_id = decodedIdToken[`${namespace}/merchant_id`];
                setUserData(decodedIdToken);
                setToken(res);
                setStep(step + 1);
                setLoading(false);
            }
        });
    }
    const validateFields = () => {
        errors.userName = '';
        errors.password = '';

        let isValid = true;

        if(!userName){
            errors.userName = 'Enter your username!';
            isValid = false;
        }
        if(password.length < 1){
            errors.password = 'Password must not be empty!';
            isValid = false
        }

        setErrors( prevState => {
            return {...prevState, ...errors};
        });

        return isValid;
    }

    //TODO: un comment when need to check if email is verified or not
    // if(req.data.email_verified === true){
    //     setUserData(req.data);
    //     window.location.reload();
    // } else {
    //  history.push('/verify');
    // }

    //TODO: use this when needed merchant token to store on front end
    // const getMerchantToken = async () => {
    //     try {
    //         const data =  await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant_token/${DEFAULT_MERCHANT}`,
    //             {}, 'GET');
    //         localStorage.setItem('nua_token', data.data.access_token);
    //     } catch (e) {
    //         console.log('NUA PAY organization token fetching failed.')
    //     }

    return (
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
                        error={errors.userName}
                        name="userName"
                        type="text"
                        value={userName}
                        handleChange={setUserName}
                        placeholder="Username"
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
            <div className="bottom-section-container">
                <div className="bottom-section">
                    <input type="button" value="Sign in" onClick={signin}/>
                </div>
                <div></div>
            </div>
            <div className="bottom-section-container">
                <div className="bottom-section">
                    {
                        message && <p className="forget-password" style={{color: 'red'}}>{message}</p>
                    }
                </div>
                <div></div>
            </div>

            <div className="bottom-section-container">
                <div className="bottom-section">
                    <p className="link forget-password" style={{boxSizing: 'border-box'}} onClick={() => setModalIsOpen(true)}>
                        Forget password?
                    </p>
                </div>
            </div>
            <ForgetPassword
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
            />
        </div>
    );
}

export default Signin;