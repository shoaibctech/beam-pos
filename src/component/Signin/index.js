import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import auth0 from "auth0-js";
import { setUserData, setToken, makeSecureRequest } from '../../utils/index';
import ForgetPassword from '../ForgetPassword';
import jwt from 'jwt-decode';
import { useCookies } from "react-cookie";
import Loader from '../../component/UI/Loader';
import axios from 'axios';
import './styles.css';
import AlertToast from '../../component/UI/AlertToast';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

var webAuth = new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
});
const namespace = "https://posjunction.com";
//4S2K - Y7RL - DBX8 - ANK3 - 62BG - 8E35
const Signin = () =>  {

    const [ setCookie] = useCookies(['isToken']);
    const history = useHistory();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState({userName: '', password: ''});
    const [loading, setLoading] = useState(false);
    const [loginStep, setLoginStep] = useState(0);
    const [otpCode, setOtpCode] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [oobCode, setOobCode] = useState('');
    const [phone, setPhone] = useState('44');
    // const [recoveryCodes, setRecoveryCodes] = useState({});
    const [showToast, setShowToast] = useState(false);

    const signin = async () => {
        setMessage('');
        if(!validateFields()) {
            return;
        }

        setLoading(true);
        webAuth.client.login({
            realm: 'Username-Password-Authentication',
            username: userName,
            email: userName,
            password: password,
            scope: 'openid user_metadata',
        }, (err, res) => {
            if(err) {
                if( err.code === 'mfa_required') {
                    showCodePrompt(err.original.response.body.mfa_token);
                    setMfaToken(err.original.response.body.mfa_token);
                } else {
                    setMessage(err.description);
                    setLoading(false);
                }
            }
        });
    }
    const showCodePrompt = async (mfaToken, isResending = false) => {
        setMessage('');
        try {
            const data = await axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/mfa/challenge`, {
                client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
                client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
                mfa_token: mfaToken,
                // challenge_type: 'oob otp'
            }, { headers: {'Content-Type': 'application/json'}});

            setLoading(false);
            setOobCode(data.data.oob_code);
            setLoginStep(1);
            setShowToast(true);
        } catch (e) {
            if(e.response && e.response.data.error === 'association_required'){
                if (!isResending) // Don't update screen
                    setLoginStep(2);

                setLoading(false);
            } else {
                setMessage(e.response && e.response.data.error_description);
                setLoading(false);
            }
        }
    }
    const verifyOtpCode = async () => {
        setLoading(true);
        setMessage('');
        try {
            const data = await axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, {
                grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
                client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
                client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
                mfa_token: mfaToken,
                oob_code: oobCode,
                binding_code: otpCode,
            });
            const res = data.data;
            setLoading(false);
            const decodedIdToken = jwt(res.id_token);
            decodedIdToken.first_name = decodedIdToken[`${namespace}/first_name`];
            decodedIdToken.last_name = decodedIdToken[`${namespace}/last_name`];
            decodedIdToken.merchant_id = decodedIdToken[`${namespace}/merchant_id`];
            decodedIdToken.beneficiary_id = decodedIdToken[`${namespace}/beneficiary_id`];
            decodedIdToken.account_type = decodedIdToken[`${namespace}/account_type`];
            decodedIdToken.merchant_type = decodedIdToken[`${namespace}/merchant_type`];
            setUserData(decodedIdToken);
            setToken(res);

            let milliseconds = new Date().getTime();
            // let expSec = sec + (res.expiresIn * 1000);
            // TODO: change expires time on auth0 side
            // Set Expire time to one hour (60 minutes)
            let expMiliSec = milliseconds + 3600000; // add one hour milli seconds to current time milli seconds
            let expSec = expMiliSec / 1000; // divide milli seconds on 1000 to get seconds
            setCookie('isToken', res.access_token,  { path: '/', expires: new Date(parseInt(expMiliSec)), maxAge: expSec });
            updateOrCreateMerchant(decodedIdToken.name, decodedIdToken.merchant_id, userName, phone);
            addDataToDatabase(decodedIdToken.merchant_id);
            // Todo redirect to home page
            history.push('/transaction');
        } catch (e) {
            setLoading(false);
            const ErrorString = {'Invalid binding_code.' : 'Incorrect code.'}
            setMessage(ErrorString[e.response.data.error_description] ? ErrorString[e.response.data.error_description] : 'Incorrect code.');
        }
    }
    const updateOrCreateMerchant = async (name, merchant_id, email, phone) => {
        try {
            const data = {
                name: name,
                nuapay_merchant_id: merchant_id,
                merchant_hash: merchant_id,
                email: email,
                phone: phone && phone !== '44' ? `+${phone}` : '',
            }
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/create_update`, data, 'POST');
            console.log('req :: ', req.data);
        } catch (e) {
            console.log('Merchant update failed.')
        }
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

    const addDataToDatabase = (merchantId) => {
      try {
          makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/save`, {
              merchantId
          }, 'POST');
      } catch (e) {
          console.log('Error saving data to database!');
      }
    }
    const enrollPhoneNumber = async () => {
        setLoading(true);
        let isValid = true;
        let errorMessage = '';
        setMessage('');
        if (typeof phone !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(phone)) {
                isValid = false;
                errorMessage = "Please enter valid phone number.";
            }else if(phone.length < 12){
                isValid = false;
                errorMessage = "Please enter valid phone number with country code";
            }
        }
        if(!isValid) {
            setMessage(errorMessage);
            setLoading(false);
            return;
        }

        try {
            const data = await axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/mfa/associate`, {
                client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
                client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
                authenticator_types: ["oob"],
                oob_channels: ["sms"],
                phone_number: phone,
            }, {
                headers: {Authorization: 'Bearer ' + mfaToken, 'Content-Type': 'application/json' }
            });
            // setRecoveryCodes(prevState => data);
            setOobCode(data.data.oob_code);
            setLoading(false);
            setLoginStep(1);
        } catch (e) {
            if(e.response && e.response.data.error_description)
                setMessage(e.response.data.error_description);

            console.log('', e.response);
            setLoading(false);
        }
    }
    
    return (
        <div className="login-container">
            <AlertToast isOpen={showToast} handleClose={() => setShowToast(false)} message="Code sent successfully!" />
            <div className="row">
                <div>
                    <h1>Welcome to beam.</h1>
                </div>
            </div>
            <br/>
            <br/>
            {
                loginStep === 0 &&
                <React.Fragment>
                    <div className="row">
                        <div className="icon">
                            <img src={BotUser} alt="Lucy"/>
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
                            <img src={Key} alt="Lucy"/>
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
                            <button className="confirm-btn" style={{width: '100%'}} onClick={signin}>
                                {loading ? <Loader size="2rem" color="secondary"/> : 'Sign In'}
                            </button>
                        </div>
                        <div></div>
                    </div>
                </React.Fragment>
            }
            {
                loginStep === 1 &&
                    <React.Fragment>
                        <br/>
                        <p style={{textAlign: 'center'}}>We just sent you a verification code on your phone</p>
                        <br/>
                        <div className="row">
                            <div>
                                <Input
                                    // error={errors.otp}
                                    className="code-input"
                                    name="otpCode"
                                    type="text"
                                    value={otpCode}
                                    handleChange={setOtpCode}
                                    placeholder="6 digit code"
                                />
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div className="bottom-section-container">
                            <div className="bottom-section">
                                <button className="confirm-btn" style={{width: '100%'}} onClick={verifyOtpCode}>
                                    {loading ? <Loader size="2rem" color="secondary"/> : 'Verify Code'}
                                </button>
                            </div>
                            <div></div>
                        </div>
                        <p style={{textAlign: 'center'}}>
                            <span>Didn't receive the code? </span>
                            <span style={{ color: '#5956E8', cursor: 'pointer'}}  onClick={() => showCodePrompt(mfaToken, true)}>
                                Resend
                            </span>
                        </p>
                    </React.Fragment>
            }
            {
                loginStep === 2 &&
                <React.Fragment>
                    <br/>
                    <p style={{textAlign: 'center'}}>Please register your mobile number for Two Factor Authentication</p>
                    <br/>
                    <br/>
                    <div className="row">
                        <div style={{ width: 'calc(11vw + 268px)'}}>
                            <PhoneInput
                                country={'gb'}
                                enableAreaCodes={true}
                                value={phone}
                                onChange={phone => {
                                    setMessage('');
                                    setPhone(phone)
                                }}
                            />
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <div className="bottom-section-container">
                        <div className="bottom-section">
                            <button className="confirm-btn" style={{width: '100%'}} onClick={enrollPhoneNumber}>
                                {loading ? <Loader size="2rem" color="secondary"/> : 'Enroll Phone Number'}
                            </button>
                        </div>
                        <div></div>
                    </div>
                </React.Fragment>
            }
            {
                loginStep === 3 && //save recovery codes
                <React.Fragment>
                    <br/>
                    <p style={{textAlign: 'center'}}>Please copy this recovery code</p>
                    <br/>
                    <div className="row">
                        <div>
                           <p>dddddddddddddddddddddd</p>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div className="bottom-section-container">
                        <div className="bottom-section">
                            <button className="confirm-btn" style={{width: '100%'}} onClick={() => setLoginStep(1)}>
                                {loading ? <Loader size="2rem" color="secondary"/> : 'Next'}
                            </button>
                        </div>
                        <div></div>
                    </div>
                </React.Fragment>
            }
            <div className="bottom-section-container">
                <div className="bottom-section">
                    {
                        message && <p className="forget-password" style={{color: 'red'}}>{message}</p>
                    }
                </div>
                <div></div>
            </div>
            {
                loginStep === 0 &&
                <div className="bottom-section-container">
                    <div className="bottom-section">
                        <p className="link forget-password" style={{boxSizing: 'border-box'}} onClick={() => setModalIsOpen(true)}>
                            Forgot password?
                        </p>
                    </div>
                </div>
            }
            <ForgetPassword
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
            />
        </div>
    );
}

export default Signin;
