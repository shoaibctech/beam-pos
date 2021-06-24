import React, {useEffect} from "react";
import Logo from "./images/ClearstackLogo.svg";
import vector from "../PaymentMethod/images/Vector.svg";
import BorderTick from "../PaymentMethod/images/borderTick.svg";
import Faq from "../Faqs";

const PaymentMethod = ({step, setStep, product}) => {

    useEffect(() => {
        let element = document.getElementById('payment-method');
        element.scrollIntoView({behavior: "smooth"});
    }, []);

    return (
        <div id="payment-method">
            <div className="bg-paymentDark w-auto pt-10 h-114">
                <div className="bg-blue-light w-auto rounded-lg pt-200 px-5">
                    <div className="flex flex-col w-auto h-114 px-5 bg-white rounded-md-1">
                        <div className="mt-83">
                            <p className="text-input font-inter font-semibold not-italic text-price-color">Payment method</p>
                        </div>
                        <div className="flex justify-between mt-214 py-90 pl-82 w-full border border-borderGrey rounded-md-2">
                            <p className="text-input font-inter font-normal not-italic text-price-color">Via your banking app</p>
                            <img src={BorderTick} alt="tick" className="pr-213" />
                        </div>
                    </div>
                    <div className="flex min-h-full w-auto bg-white rounded-lg my-5">
                        <div className="m-5 w-screen ">
                                <img src={Logo} alt="logo" />

                            <div className="mt-207">
                                <p className="text-input font-inter font-semibold not-italic text-price-color">The fastest, safest way to pay</p>
                            </div>

                            <div className="flex flex-col justify-center mt-212 ">
                                <div className="flex ">
                                    <img src={vector} alt="Product" className="pt-0.5 flex justify-center" />
                                    <p className="pl-83 h-4 font-inter font-medium not-italic text-price-color text-sm">Secure, no details required</p>
                                </div>
                                <div className="flex mt-213">
                                    <img src={vector} alt="Product" className="pt-0.5" />
                                    <p className="pl-83 h-4 font-inter font-medium not-italic text-price-color text-sm">One-click-payment via your banking app</p>
                                </div>
                                <div className="flex justify-start mt-213 h-8">
                                    <img src={vector} alt="Product" className="flex items-start"/>
                                    <p className="pl-83 font-inter font-medium not-italic text-price-color text-sm">Free delivery - we pass our savings on transfer costs back to you</p>
                                </div>
                            </div>

                            <div className="mt-207">
                                <div className="">
                                    <Faq />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="w-auto h-115 bg-white rounded-lg">
                        <div className="pt-83">
                            <p className="text-xxs font-inter text-center font-medium not-italic text-flavour-color">You’ll be redirected to your bank for payment</p>
                        </div>

                        <div className=" mt-5 ">
                            <p className="px-5 text-xs text-center text-gray-400 font-inter font-normal not-italic">
                                Terms and conditions of order text. By confirming this order to Love Hemp you agree to their terms of service and privacy information.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={ () => setStep(step - 1)}
                        className="w-full mt-209 mb-8 rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-flavour-color text-smbtn">
                        Cancel
                    </button>

                </div>
                <div className="flex justify-center sticky bottom-0 bg-white py-205 rounded-md-2 shadow-2xl">
                    <button
                        onClick={ () => setStep(step + 1)}
                        className="w-full mx-5 h-205 bg-darkGrey rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-white text-smbtn">
                        Select your bank
                    </button>
                </div>
            </div>

        </div>
    );
}

export default PaymentMethod;