import React, { useState } from "react";
import ImageUploader from 'react-images-upload';

const MerchantEdit = ({}) => {
    const [pictures, setPictures] = useState([]);

    const onDrop = (picture) => {
        setPictures(picture);
        console.log('picture ::', picture);
    }

    return (
        <div>
            <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
        </div>
    );
}

export default MerchantEdit;