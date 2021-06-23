import React  from "react";
import ShopifyStepper from "../UI/ShopifyStepper";

const ShippingDetails = ({step, setStep, product}) => {
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
                            <input className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic" placeholder="Full name"/>
                        </div>
                        <div className="mt-5">
                            <input className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic" placeholder="Email"/>
                        </div>
                        <div className="mt-208">
                            <input className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic" placeholder="Search by postcode"/>
                        </div>
                        <div className="mt-5">
                            <input className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic" placeholder="Address line 1"/>
                        </div>
                        <div className="mt-5">
                            <input className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic" placeholder="Address line 2"/>
                        </div>
                        <div className="mt-5">
                            <input className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic" placeholder="City"/>
                        </div>
                        <div className="mt-5">
                            <input className="p-4 h-112 w-full border border-border rounded-md-2 font-inter text-input font-inter font-normal not-italic" placeholder="Postcode"/>
                        </div>
                        <button
                            //onClick={ () => setStep(step+1)}
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