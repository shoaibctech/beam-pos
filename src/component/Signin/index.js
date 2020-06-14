import React, {useState} from 'react';
// import { useHistory } from 'react-router-dom';
import BotUser from "../../container/Home/img/user-1.svg";
import Input from "../UI/Input";
import Key from "../../container/Home/img/key-1.svg";
import auth0 from "auth0-js";
import axios from 'axios';
import {setUserData, setToken } from '../../utils/index';

var webAuth = new auth0.WebAuth({
    domain: 'dev-1e11vioj.eu.auth0.com',
    clientID:'eSfzYw2LlW9FcF00Em0xmuGF3giFHzCE',
    audience: "http://localhost:4000",
});

const Signin = ({userName, setUserName, password, setPassword, errors, validateFields, setLoading, setStep, step}) =>  {

    // const history = useHistory();
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
        }, (err, res) => {
            if(err) {
                console.log('error ::', err)
                setMessage(err.description);
                setLoading(false);
            } else {
                console.log(res)
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

        //TODO: use this when needed merchant token to store on front end
        // await getMerchantToken();
        window.location.reload();


        // get user data
        // const req1 = await axios.get(`https://dev-1e11vioj.eu.auth0.com/api/v2/users/${req.data.sub}`, '',{
        //             headers: {
        //                 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkhIM0lQeEpaQV9SRUUtVEhBMl91cSJ9.eyJpc3MiOiJodHRwczovL2Rldi0xZTExdmlvai5ldS5hdXRoMC5jb20vIiwic3ViIjoiWWxtWmNaSjV5ZnByaHF1QzllNEhwTE91UmMxTVRwMVJAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LTFlMTF2aW9qLmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTkxODIzNDA3LCJleHAiOjE1OTE5MDk4MDcsImF6cCI6IllsbVpjWko1eWZwcmhxdUM5ZTRIcExPdVJjMU1UcDFSIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.PrFlRkXZharlrxhYKRToBzTt1b9mFm1m7T2KVzICbm4xBgD9ZKb6jbehGt-UgpPX_X9tx58UqUEiKHfCOxp9F76hKejH_Qs-suZdLKE6U03-XfK8nzlfwvaZ5tO5rAFYeJQ_M9_sbAV-RcMm1-CcCH64pJejB0PuedXcLDrwTk5lXjaBaGRcdSdc4rGjLm03GHnc1kAOQxtHyQgfczn3WRy8Od1UKFeoFGScKgTeU-vGBI4qUfh_7yGkw8AxTlkqmyzHrrceDly863Obs8SJjRf9ja-tCTURyFtIFQNzSZFPCBRXzepsueIWXjH9GyhiOYXb6pNXsk6L-pERYenfIg',
        //                 'Content-Type': 'application/json',
        //             }
        //         });

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
                    <p className="link forget-password" style={{boxSizing: 'border-box'}}>Forget password?</p>
                </div>
            </div>
        </div>
    );
}

export default Signin;
