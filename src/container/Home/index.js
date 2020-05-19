import React, { useState, useEffect } from "react";
import { setPusherClient } from 'react-pusher';
import Pusher from 'pusher-js';
import { Auth0Client } from '@auth0/auth0-spa-js';

import './styles.css';
import EditInvoice from "../../component/EditInvoice";
import Payment from "../../component/Payment";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import QRCode from "../../component/QRCode";
import Signin from "../../component/Signin";

const TRANSACTION_FEE = '1.50';
const StepElement = ({message}) => {
    return (
        <span className="parent-tag">
                <span style={{marginRight: '10px'}}><img src={require('./img/bill.svg')} className="step-img" alt="recipt" /></span>
                <span>{message}</span>
            </span>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '50%',
        margin: '0 auto',
        backgroundColor: '#ffffff !important',
    },

    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    }
}));

const getStep = () => {
    return  localStorage.getItem('auth_token') && localStorage.getItem('auth_token').length > 5 ? 1 :  0;
}

const getSteps = () => {
    return ['Amount', 'Confirm', 'Pay']
}
const Home =  () => {
    const [step, setStep] = useState(getStep());
    const [user, setUser] = useState({});
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isSkip, setIsSkip] = useState(false);
    const [successStep, setSuccessStep] = useState(['Amount','Confirm', 'Pay']);
    const [emailStatus, setIsEmailStatus] = useState(false);
    const [errorStatus, setIsErrorStatus] = useState(false);
    const [link, setLink] = useState('')
    const [token, setToken] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [isStatus, setIsStatus] = useState(false);
    const [statusData, setStatusData] = useState({});

    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = getSteps();

    var pusherClient = new Pusher('08afbf07160d195dc8dd', {
        cluster: 'ap2'
    });
    setPusherClient(pusherClient);


    useEffect(() => {
        var channel = pusherClient.subscribe('my-channel');
        channel.bind('my-event', function(data) {
            alert(JSON.stringify(data));
        });

        // var channel = pusherClient.subscribe('my-channel');
        channel.bind('qr-code-event', function(data) {
            // alert(JSON.stringify(data));
            console.log('data ::', data);
            setLoading(true);
        });

        channel.bind('status-event', function(data) {
            // alert(JSON.stringify(data));
            console.log('data ::', data.data);
            setStatusData(data.data);
            setIsStatus(true);
            setLoading(false);
        });

        const prevDate = localStorage.getItem('expiresOn');
        if(prevDate){
            if( new Date(new Date() - new Date(prevDate)).getMinutes() > 59 ) {
                localStorage.clear()
                setStep(0);
            }
        }
        if(step > 0 && loading){
            document.querySelector('.loader').style.height = 150 + 'vh';
        }
    },[step, loading]);


    const onLogin = async () => {
        if(validateFields()){
            // setLoading(true);

            // const data = {
            //     login_id: userName,
            //     api_key: password
            // };
            // const config = {
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded'
            //     }
            // }
            // axios.post(`${process.env.REACT_APP_CURRENCY_CLOUD_URL}/authenticate/api`, qs.stringify(data), config)
            //     .then( res => {
            //         localStorage.setItem('auth_token', res.data.auth_token)
            //         localStorage.setItem('expiresOn', new Date());
            //         // setStep(step + 1);
            //         window.location.reload();
            //         setLoading(false);
            //     })
            //     .catch( err => {
            //         let error = {};
            //         error.password = 'Username or Password is incorrect!';
            //         setErrors(error);
            //         setLoading(false);
            //     });
            // localStorage.setItem('auth_token', 'tokenfffffffffffffffffffffffffffffffffff')
            // localStorage.setItem('expiresOn', new Date());
            // setStep(step + 1);
            // window.location.reload();
            // setLoading(false);
        }
    }

    const parseImg = (xml_String) => {
        var doc = new DOMParser().parseFromString(xml_String, 'application/xml');
        var el = document.getElementById('svgCon')
        el.appendChild(
            el.ownerDocument.importNode(doc.documentElement, true)
        )
    }

    const getAccessToken = async () => {

        localStorage.setItem('user', JSON.stringify(user))
        setLoading(true);
        try {


            const token = await axios.post(`${process.env.REACT_APP_NUAPAY_API}/api/nuapay`,
                {
                    amount: user.amount,
                    currency: 'GBP',
            } );
            console.log('token ::', token);

            setPaymentId(token.data.paymentData.id);
            setToken(token.data);

            setIsEmailStatus(token.data.success);
            setIsErrorStatus(false);
            setLoading(false);
            setStep(step + 1);
            setActiveStep(activeStep + 1)

        } catch (e) {
            console.log('error :: ', e)
            setIsErrorStatus(true);
            setIsEmailStatus(false);
            setLoading(false);
        }

    }
    const getQrCode = async () => {
        setLoading(true);
        const org_id = 'lby3aled2d';
        try {
            const link = `${window.location.origin}/bank/${org_id}/${user.amount}`
            const code = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/getQrCode`, { link });
            setTimeout(() => {
                parseImg(code.data.qrCode);
            }, 1000)
            setLink(code.data.link);
            console.log(code)

            setIsErrorStatus(false);
            setLoading(false);
            setStep(step + 1);
            setActiveStep(activeStep + 1)
        } catch (e) {
            console.log(e)
            setIsErrorStatus(true);
            setLoading(false);
        }
    }

    const validateFields = () => {
        let err = {};
        if(!userName){
            err.userName = 'Enter your username!'
        }
        if(password.length < 1){
            err.password = 'Password must not be empty!';
        }
        if(Object.getOwnPropertyNames(err).length === 0 ){
            return false;
        } else {
            setErrors(err)
            return true;
        }
    }

    const handleEdit = (index) => {
        setActiveStep(index);
        setIsStatus(false);
        setIsErrorStatus(false);
        setIsEmailStatus(false);
    }
    const getSuccessStep = (index) => {
        return successStep[index];
    }

    return(
        <main>
            {   loading &&
            <div className="loader">
                <div id="loaderdiv">
                <Loader type="TailSpin" color="black" height={100} width={100}/>
                </div>
            </div>
            }
            { step === 0 &&
                <Signin
                userName={userName}
                setUserName={setUserName}
                password={password}
                setPassword={setPassword}
                errors={errors}
                validateFields={validateFields}
                setLoading={setLoading}
                step={step}
                setStep={setStep}
                />
            }
            {
                step > 0 &&
                <div>
                    <div className={`${classes.root} step-root`}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel >
                                        {
                                            index < activeStep  ?
                                                <div className="success-step">
                                                    <h3>{getSuccessStep(index)}</h3>
                                                    <button
                                                        className="step-edit"
                                                        onClick={() => handleEdit(index)}
                                                        disabled={(index === 2 && isSkip)}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                                :
                                                index === activeStep ?
                                                    <h2 style={index === activeStep ? {color: '#333333', marginLeft: '1.6rem'} :{color: '#959595', marginLeft: '2rem'}}>
                                                        {label}
                                                    </h2>
                                                    :
                                                    <h4 style={index === activeStep ? {color: '#333333', marginLeft: '1.6rem'} :{color: '#959595', marginLeft: '2rem'}}>
                                                        {label}
                                                    </h4>

                                        }
                                    </StepLabel>
                                    <StepContent>
                                        <div className="step-margin">
                                            {
                                                index === 0 &&
                                                <EditInvoice
                                                    step={step}
                                                    setStep={setStep}
                                                    activeStep={activeStep}
                                                    setActiveStep={setActiveStep}
                                                    setLoading={setLoading}
                                                    successStep={successStep}
                                                    setSuccessStep={setSuccessStep}
                                                    setUser={setUser}
                                                    setIsSkip={setIsSkip}
                                                />

                                            }
                                            {
                                                index === 1  &&
                                                    <Payment
                                                    isSkip={isSkip}
                                                    user={user}
                                                    TRANSACTION_FEE={TRANSACTION_FEE}
                                                    getAccessToken={getQrCode}
                                                    emailStatus={emailStatus}
                                                    errorStatus={errorStatus}
                                                />
                                            }   {
                                                index === 2  &&
                                                   <QRCode
                                                       link={link}
                                                       isStatus={isStatus}
                                                       statusData={statusData}
                                                   />
                                            }
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                </div>
            }
        </main>
    );
}
export default Home;
