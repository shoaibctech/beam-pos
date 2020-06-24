import React, {useState} from 'react';
// import { useHistory } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import auth0 from "auth0-js";
import axios from 'axios';
import {setUserData, setToken, makeSecureRequest, setUserMetaData} from '../../utils/index';
import ForgetPassword from '../ForgetPassword';

var webAuth = new auth0.WebAuth({
    domain: 'dev-1e11vioj.eu.auth0.com',
    clientID:'eSfzYw2LlW9FcF00Em0xmuGF3giFHzCE',
    audience: "http://localhost:4000",
});

const Signin = ({userName, setUserName, password, setPassword, errors, validateFields, setLoading, setStep, step}) =>  {

    // const history = useHistory();
    const [message, setMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // console.log(errors)
    const signin = async () => {
        setLoading(true)
        if(validateFields())
            return

        webAuth.client.login({
            realm: 'Username-Password-Authentication',
            username: userName,
            email: userName,
            password: password,
            scope: 'openid',
        }, (err, res) => {
            if(err) {
                console.log('error ::', err)
                setMessage(err.description);
                setLoading(false);
            } else {
                // console.log(res)
                setToken(res);
                getUserInfo();
                setStep(step + 1);
                setLoading(false);
            }
        });
    }

    const getUserInfo = async () => {
        const req = await axios.post('https://dev-1e11vioj.eu.auth0.com/userInfo', '',{
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
        const userMetaData = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/user/${req.data.sub}`, {},
            'GET');
        console.log("user meta data ::", userMetaData.data.data)
        //TODO: un comment when need to check if email is verified or not
        // if(req.data.email_verified === true){
        //     setUserData(req.data);
        //     window.location.reload();
        // } else {
        //  history.push('/verify');
        // }

        //TODO: remove below 2 line when will un comment above code
        //allow with out verification.
        setUserData(req.data);
        setUserMetaData(userMetaData.data.data);

        //TODO: use this when needed merchant token to store on front end
        // await getMerchantToken();
        window.location.reload();
    }

    //TODO: use this when needed merchant token to store on front end
    // const getMerchantToken = async () => {
    //     try {
    //         const data =  await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant_token/${DEFAULT_MERCHANT}`,
    //             {}, 'GET');
    //         localStorage.setItem('nua_token', data.data.access_token);
    //     } catch (e) {
    //         console.log('NUA PAY organization token fetching failed.')
    //     }
    //
    // }

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
                    <p className="link forget-password" style={{boxSizing: 'border-box'}} onClick={() => setModalIsOpen(true)}>Forget password?</p>
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
