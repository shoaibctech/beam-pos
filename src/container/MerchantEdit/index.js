import React, { useState } from "react";
import ImageUploader from 'react-images-upload';
import S3 from 'react-aws-s3';
import { makeSecureRequest, getUserData } from "../../utils";
import Loader from "../../component/UI/Loader";
import AlertToast from '../../component/UI/AlertToast';

const config = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
}

const MerchantEdit = ({}) => {
    const [logo, setLogo] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isImg, setIsImg] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const onDrop = (picture) => {
        setLogo(picture[0]);
        setIsImg(true);
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
            const req = await makeSecureRequest(`${process.env.REACT_APP_BACKEND_URL}/api/merchant/update-logo`,
                {
                    logoUrl: data.location,
                    merchantId: getUserData().merchant_id,
                    logoType: 'beam'
                }, 'POST');

            console.log('successfully uploaded logo ::', req.data);
            setIsFetching(false);
            setShowMessage(true);
        } catch (e) {
            console.log('Error: ', e);
        }
    }
    return (
        <React.Fragment>
            <ImageUploader
                withIcon={true}
                buttonText='Choose Logo'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
            {
                isImg &&
                <div className="text-center">
                    <button onClick={uploadLogoS3} className="btn btn-primary" style={{ width: '200px' }}>
                        { isFetching ? <Loader size="1.5rem" color="secondary"/> : 'Upload' }
                    </button>
                </div>
            }
            <AlertToast isOpen={showMessage} handleClose={() => setShowMessage(false)} message="Logo uploaded successfully!" />
        </React.Fragment>
    );
}

export default MerchantEdit;