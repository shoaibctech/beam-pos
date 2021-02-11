import React, { useState, useEffect } from 'react';
import { makeSecureRequest, getUserData } from "../../utils";
import Loader from '../../component/UI/Loader';
import AlertToast from '../../component/UI/AlertToast';
import './styles.css';
import Paper from "@material-ui/core/Paper";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Switch from "@material-ui/core/Switch";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgba(89, 86, 262, 1)'
        },
        // secondary: {
        //     main: green[500],
        // },
    },
});

const Profile = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [keyError, setKeyError] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [tabValue, setTabValue] = useState(0);

//minor change
    useEffect(() => {
        getApiKey();
    }, []);

    const getApiKey = async () => {
        try {
            setIsFetching(true);
            const reqData = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/auth/key/${getUserData().merchant_id}`, {}, 'GET')
            setApiKey(reqData.data.apiKey);
            setIsFetching(false);
        } catch (e) {
            setKeyError('Something went wrong....');
        }
    }
    const refreshApiKey = async () => {
        try {
            setIsFetching(true);
            const reqData = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/auth/key`, {
                merchantId: getUserData().merchant_id
            }, 'PATCH')

            setApiKey(reqData.data.apiKey);
            setIsFetching(false);
            setSuccessMessage('Api key successfully created.');
        } catch (e) {
            setKeyError('Something went wrong....');
        }
    }
    const copyCodeToClipboard = () => {
       let textField = document.createElement('textarea');
       textField.innerText = apiKey;
       document.body.appendChild(textField);
       textField.select();
       document.execCommand('copy');
       textField.remove();
       setIsCopied(true);
    }
    const handleTabChange = (event, value) => {
        setTabValue(value);
    }
    console.log(tabValue);
    return (
        <div>
            <Paper square >
                <ThemeProvider theme={theme}>
                    <Tabs
                        value={tabValue}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleTabChange}
                        aria-label="disabled tabs example">
                        <Tab label="Key Management" />
                        <Tab label="SMS Notification" />
                    </Tabs>
                </ThemeProvider>
            </Paper>
            {
                tabValue === 0 &&
                <div className="login-container">
                    <div>
                        <p className="key-block">
                            <label htmlFor="api-key">Api Key:</label>
                            <div className="tooltip" style={{display: 'inlineBlock'}}>
                            <span className="key-data" onClick={copyCodeToClipboard}>
                                <span className="tooltiptext" id="myTooltip">Copy to clipboard</span>
                                <input type="text" disabled value={apiKey} name="api-key"/>
                            </span>
                            </div>
                        </p>
                        <p className="text-center mr-1">
                            <span className="info-color"><i className="fa fa-info-circle"></i>&nbsp;</span>
                            <span className="key-info">This is your unique key. You can access this key again in here.</span>
                        </p>
                    </div>
                    <br/>
                    { !isFetching && !apiKey &&
                    <div className="text-center">
                        <button className="btn btn-primary mr-1" onClick={refreshApiKey}>
                            { isFetching ? <Loader size="2rem" color="secondary"/> : 'Get New Api Key' }
                        </button>
                        <p className="mr-2 success_message">{successMessage}</p>
                    </div>
                    }
                    {/*<div>*/}
                    {/*    <p className="text-center">*/}
                    {/*        <span className="info-color"><i className="fa fa-info-circle"></i>&nbsp;</span>*/}
                    {/*        <span className="key-info">Note: If a key is compromised, you can create a new key. This will discard old key. </span>*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                    <AlertToast isOpen={isCopied} handleClose={() => setIsCopied(false)} message="copied" />
                </div>
            }
            {
                tabValue === 1 &&
                <div className="login-container">
                    <div>
                        <h3 className="heading_position" >SMS Notification Setting</h3>
                        <div>
                            <div className="status-toggle set-it">
                                <span>allow</span>
                                <Switch
                                    // checked={isPaymentReceived}
                                    // onChange={handleSwitchChange}
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                                <span>disallow</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Profile;