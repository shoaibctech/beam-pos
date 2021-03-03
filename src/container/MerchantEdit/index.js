import React, { useState, useEffect } from "react";
import ImageUploader from 'react-images-upload';
import S3 from 'react-aws-s3';
import { makeSecureRequest, getUserData } from "../../utils";
import Loader from "../../component/UI/Loader";
import AlertToast from '../../component/UI/AlertToast';
import './styles.css';
import Switch from "@material-ui/core/Switch";

const config = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
}

const MerchantEdit = () => {
    const [logo, setLogo] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isImg, setIsImg] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [toastMessage, setToastMessage] = useState('Logo uploaded successfully!');
    const [notificationToggle, setNotificationToggle] = useState(true);


    useEffect(() => {
        getSmsNotificationSetting();
    }, []);

    const onDrop = (picture) => {
        if (picture[0]) {
            setLogo(picture[0]);
            setIsImg(true);
        } else {
            setLogo(null);
            setIsImg(false);
        }
    }

    const uploadLogoS3 = async () => {
        try {
            setIsFetching(true);
            await deleteOldLogo();
            const ReactS3Client = new S3(config);
            const newFileName = logo.name.slice(0, -4);
            ReactS3Client
                .uploadFile(logo, newFileName)
                .then(data => updateLogoUrl(data))
                .catch(err => console.error(err))

        } catch (e){
            console.log('Something went wrong...');
        }
    }
    const deleteOldLogo = async () => {
        try {
            const reqData = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/get-logo/${getUserData().merchant_id}`, {}, 'GET');
            if (reqData && reqData.data.isLogo) {
                const arrayData = reqData.data.logo.split('/');
                const fileName = arrayData[arrayData.length -1];

                const ReactS3Client = new S3(config);
                ReactS3Client
                    .deleteFile(fileName)
                    .then(response => console.log(response))
                    .catch(err => console.error(err))
            }
        } catch (e) {
            console.log('Something went wrong...');
        }
    }

    const updateLogoUrl = async (data) => {
        try {
            const LOGO_TYPE = getUserData().merchant_type === 'charity' ? 'charity' : 'beam';
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/update-logo`,
                {
                    logoUrl: data.location,
                    merchantId: getUserData().merchant_id,
                    logoType: LOGO_TYPE
                }, 'POST');

            console.log('successfully uploaded logo ::', req.data);
            setIsFetching(false);
            setToastMessage('Logo uploaded successfully!');
            setShowMessage(true);
        } catch (e) {
            console.log('Error: ', e);
        }
    }
    const handleSwitchChange = async (event) => {
        setNotificationToggle(event.target.checked);
        try {
             await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/sms/notification/${getUserData().merchant_id}`, {
                isSendNotification: event.target.checked,
                merchantId: getUserData().merchant_id
            }, 'POST');

            setToastMessage('Successfully updated Sms Notification settings.');
            setShowMessage(true);
        } catch (e) {
            console.log('sow Error :: ', e);
        }
    }
    const getSmsNotificationSetting = async () => {
        try {
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/sms/notification/${getUserData().merchant_id}`, {}, 'GET');
            setNotificationToggle(req.data.smsNotification);
        } catch (e) {
            console.log('show error :: ', e);
        }
    }
    return (
        <React.Fragment>
            <div className="settings-box">
                <div className="settings-inner-border">
                    <span>Upload Logo</span>
                </div>
                <div className="settings-content">
                    <div>
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose Logo'
                            onChange={onDrop}
                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            maxFileSize={5242880}
                            withPreview={true}
                            name={logo && logo.name}
                        />
                    </div>
                    {
                        isImg &&
                        <div className="text-center">
                            <button onClick={uploadLogoS3} className="btn btn-primary" style={{ width: '200px' }}>
                                { isFetching ? <Loader size="1.5rem" color="secondary"/> : 'Upload' }
                            </button>
                        </div>
                    }
                </div>
            </div>
            <div className="settings-box">
                <div className="settings-inner-border">
                    <span>SMS Notifications</span>
                </div>
                <div className="settings-content">
                    <div className="sms-ntf-txt">
                        Notifications are received by merchant whenever a transaction is complete or failed.
                    </div>
                    <div className="sms-toggle">
                        <Switch
                            checked={notificationToggle}
                            onChange={handleSwitchChange}
                            color="secondary"
                            name="checkedB"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <span>Enable or disable SMS notifications</span>
                    </div>
                </div>
            </div>
            <AlertToast isOpen={showMessage} handleClose={() => setShowMessage(false)} message={toastMessage} />
        </React.Fragment>
    );
}

export default MerchantEdit;