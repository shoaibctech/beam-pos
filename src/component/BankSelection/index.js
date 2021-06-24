import React  from "react";
import BorderTick from "./images/borderTick.svg";
import Search from "./images/search.svg";
import LloydsBank from "./images/Lloyds Bank.svg";
import Nationwide from "./images/Nationwide.svg";
import Revolut from "./images/Revolut.svg";

const BankSelection = ({step, setStep, product}) => {
    return (
            <div className="bg-paymentDark w-auto pt-10 h-114">
                <div className="bg-blue-light w-auto rounded-t-lg pt-200 px-5">
                    <div className="flex flex-col w-auto h-116 px-5 bg-white rounded-md-1">
                        <div className="mt-83">
                            <p className="text-input font-inter font-semibold not-italic text-price-color">Select your bank</p>
                        </div>
                        <div className="mt-5">
                            <div className="flex p-4 h-112 w-full border border-border rounded-md-2 ">
                                <img src={Search} alt="logo" />
                                <input className="pl-search font-inter text-input font-inter font-normal not-italic" placeholder="Search for bank"/>
                            </div>
                        </div>

                        <div className="h-217 mt-5  overflow-auto">
                            <div className="h-112 w-auto">
                                <div className="flex border border-border rounded-md-2 ">
                                    <img src={LloydsBank} alt="logo" className="pl-4 " />
                                    <p className="py-4 pl-4 text-price-color font-inter text-input font-inter font-normal not-italic">
                                        Lolyds Bank
                                    </p>
                                    <img src={BorderTick} alt="tick" className="ml-auto pr-4"/>
                                </div>
                                <div className="flex border border-border rounded-md-2 mt-214">
                                    <img src={Nationwide} alt="logo" className="pl-4 " />
                                    <p className="py-4 pl-4 text-price-color font-inter text-input font-inter font-normal not-italic">
                                        Nationwide
                                    </p>
                                    <img src={BorderTick} alt="tick" className="ml-auto pr-4"/>
                                </div>
                                <div className="flex border border-border rounded-md-2 mt-214">
                                    <img src={Revolut} alt="logo" className="pl-4 " />
                                    <p className="py-4 pl-4 text-price-color font-inter text-input font-inter font-normal not-italic">
                                        Revolut
                                    </p>
                                    <img src={BorderTick} alt="tick" className="ml-auto pr-4"/>
                                </div>
                                <div className="flex border border-border rounded-md-2 mt-214">
                                    <img src={LloydsBank} alt="logo" className="pl-4 " />
                                    <p className="py-4 pl-4 text-price-color font-inter text-input font-inter font-normal not-italic">
                                        Barclays
                                    </p>
                                    <img src={BorderTick} alt="tick" className="ml-auto pr-4"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-auto mt-5 h-115 bg-white rounded-lg">
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
                        className="w-full mt-209 mb-215 rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-flavour-color text-smbtn">
                        Cancel
                    </button>
                </div>
                <div className="flex justify-center sticky bottom-0 bg-white py-205 rounded-md-2 shadow-2xl">
                    <button
                        onClick={ () => setStep(step + 1)}
                        className="w-full mx-5 h-205 bg-darkGrey rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-white text-smbtn">
                        Pay with banking app
                    </button>
                </div>
            </div>
    );
}

export default BankSelection;