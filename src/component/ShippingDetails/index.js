import React, { useState }  from "react";
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { validateEmail } from '../../utils/index';

import ShopifyStepper from "../UI/ShopifyStepper";
import Search from "./images/search.svg";

const ShippingDetails = ({step, setStep, product, shippingDetail, setShippingDetail}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [search, setSearch] = useState('');
    const [add1, setAdd1] = useState('');
    const [add2, setAdd2] = useState('');
    const [city, setCity] = useState('');
    const [postCode, setPostCode] = useState('');
    const [error, setError] = useState({});
    const [isSearch, setIsSearch] = useState(false);
    const [places, setPlaces] = useState();

    const getAddress = async (searchKey) => {
        try {
            setIsSearch(true);
            setSearch(searchKey);
            const placeReq = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/location/search`, {
                search: searchKey
            })
            console.log('place data ::', placeReq.data.location);
            if (placeReq.data.location) {
                setPlaces(placeReq.data.location.predictions)
            }
            setIsSearch(false);
        } catch (e){

        }
    }
    const handlePlaceSelect = (place) => {
        console.log(place);
        // setPlaces([]);
    }
    const validateForm = () => {
        let errorObj = {};
        let emailError = validateEmail(email);
        if (!name) {
            errorObj.name = "Full name is required!"
        } else if (emailError) {
            errorObj.email = emailError;
        } else if (!add1 && !add2){
            errorObj.add1 = 'Address line 1 is required!'
        }  else if (!city){
            errorObj.city = 'City is required!'
        }  else if (!postCode){
            errorObj.postCode = 'Post code is required!'
        }
        if (Object.keys(errorObj) && Object.keys(errorObj).length > 0){
            setError(errorObj);
        } else {
            let shippingD = {
                name: name,
                email: email,
                address1: add1,
                address2: add2,
                city: city,
                postCode: postCode
            };
            setShippingDetail(shippingD);
            setStep(step + 1);
        }

    }
    const handleInputChange = (value, callback) => {
        setError({});
        callback(value);
    }
    return (
        <div>
            <div className="bg-blue-light w-screen p-5">
                <ShopifyStepper step={step} />

                <div className="flex min-h-full w-auto bg-white rounded-lg mt-5">
                    <div className="m-5 w-screen ">
                        <p className="font-inter font-semibold not-italic text-gray-600 text-heading">
                            Shipping information
                        </p>
                        <div className="mt-207 shopify-input">
                            <TextField
                                value={name}
                                onChange={e => handleInputChange(e.target.value, setName)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                label="Full name"
                                variant="outlined"
                                helperText={error && error.name}
                            />
                        </div>
                        <div className="mt-5 shopify-input">
                            <TextField
                                value={email}
                                onChange={e => handleInputChange(e.target.value, setEmail)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                label="Email"
                                variant="outlined"
                                helperText={error && error.email}
                            />
                        </div>
                        <div className="mt-208 shopify-input">
                            <TextField
                                value={search}
                                onChange={e => getAddress(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                label="Search by postcode"
                                variant="outlined"
                            />
                            { places && places.length > 0 &&
                                <div>
                                    {
                                        places && places.length && places.map((place, index) =>
                                            <p key={index} onClick={() => handlePlaceSelect(place)}>
                                                {place.description}
                                            </p>)
                                    }
                                </div>
                            }
                            <div className="flex p-4 h-112 w-full border border-border rounded-md-2 ">
                                <img src={Search} alt="logo" />
                                <input className="pl-search font-inter text-input font-inter font-normal not-italic" placeholder="Search by postcode"/>
                            </div>
                        </div>
                        <div className="mt-5 shopify-input">
                            <TextField
                                value={add1}
                                onChange={e => handleInputChange(e.target.value, setAdd1)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                id="outlined-basic"
                                label="Address line 1"
                                variant="outlined"
                                helperText={error && error.add1}
                            />
                        </div>
                        <div className="mt-5 shopify-input">
                            <TextField
                                value={add2}
                                onChange={e => handleInputChange(e.target.value, setAdd2)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                label="Address line 2"
                                variant="outlined"
                            />
                        </div>
                        <div className="mt-5 shopify-input">
                            <TextField
                                value={city}
                                onChange={e => handleInputChange(e.target.value, setCity)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                label="City"
                                variant="outlined"
                                helperText={error && error.city}
                            />
                        </div>
                        <div className="mt-5 shopify-input">
                            <TextField
                                value={postCode}
                                onChange={e => handleInputChange(e.target.value, setPostCode)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                label="Post code"
                                variant="outlined"
                                helperText={error && error.postCode}
                            />
                        </div>
                        <button
                            onClick={validateForm}
                            className="w-full mt-10 h-205 bg-darkGrey rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-white text-smbtn">
                            View order summary
                        </button>
                        <div className=" mt-5">
                            <p className=" text-xs text-center text-gray-400 font-inter font-normal not-italic">
                                Terms and conditions of order text. By confirming this order to Love Hemp you agree to their terms of service and privacy information.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={ () => setStep(step - 1)}
                    className="w-full mt-209 mb-210 rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-flavour-color text-smbtn">
                    Back to product
                </button>
            </div>
        </div>
    );
}
export default ShippingDetails;