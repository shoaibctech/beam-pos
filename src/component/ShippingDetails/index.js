import React, { useState }  from "react";
import axios from 'axios';

import ShopifyStepper from "../UI/ShopifyStepper";

const ShippingDetails = ({step, setStep, product}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [search, setSearch] = useState('');
    const [add1, setAdd1] = useState('');
    const [add2, setAdd2] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipcode] = useState('');
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
    return (
        <div>
            <div className="bg-blue-light w-screen p-5">
                <ShopifyStepper step={step} />
                {/*<div className="flex w-auto h-100 bg-white rounded-md-1">*/}
                {/*</div>*/}

                <div className="flex h-111 w-auto bg-white rounded-lg mt-5">
                    <div className="m-5 w-screen ">
                        <p className="font-inter font-semibold not-italic text-gray-600 text-heading">
                            Shipping information
                        </p>
                        <div className="mt-207">
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                placeholder="Full name"
                            />
                        </div>
                        <div className="mt-5">
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                placeholder="Email"/>
                        </div>
                        <div className="mt-208">
                            <input
                                value={search}
                                onChange={e => getAddress(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                placeholder="Search by postcode"
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
                        </div>
                        <div className="mt-5">
                            <input
                                value={add1}
                                onChange={e => setAdd1(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                placeholder="Address line 1"
                            />
                        </div>
                        <div className="mt-5">
                            <input
                                value={add2}
                                onChange={e => setAdd2(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                placeholder="Address line 2"
                            />
                        </div>
                        <div className="mt-5">
                            <input
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                placeholder="City"
                            />
                        </div>
                        <div className="mt-5">
                            <input
                                value={zipCode}
                                onChange={e => setZipcode(e.target.value)}
                                className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic"
                                placeholder="Postcode"
                            />
                        </div>
                        <button
                            onClick={ () => setStep(step + 1)}
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