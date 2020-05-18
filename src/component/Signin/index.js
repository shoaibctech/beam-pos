import React, {useState} from 'react';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import auth0 from "auth0-js";

var webAuth = new auth0.WebAuth({
    domain:       'dev-ulr4x749.auth0.com',
    clientID:     'XORs41wWGZN6sFlmGXLApXkYJWEnTB50',
});

const Signin = ({userName, setUserName, password, setPassword, errors, validateFields, setLoading, setStep, step}) =>  {

    //test credentials
    // test123@gmail.com
    // test1234
    const [message, setMessage] = useState('');

    console.log(errors)
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
            responseType: 'token'
        }, (err, res) => {
            if(err) {
                console.log('error ::', err)
                setMessage(err.description);
                setLoading(false);
            } else {
                console.log('response ::', res)
                localStorage.setItem('auth_token', res.idToken)
                localStorage.setItem('expiresOn', res.expiresIn);
                localStorage.setItem('access_token', res.accessToken);
                localStorage.setItem('tokenType', res.tokenType);
                setStep(step + 1);
                window.location.reload();
                setLoading(false);
            }
        });
    }

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
                    <p className="link forget-password" style={{boxSizing: 'border-box'}}>Forget password?</p>
                </div>
            </div>
        </div>
    );
}

export default Signin;
