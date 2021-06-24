import React  from "react";
import Logo from "./images/logo.png";
import Vector from "./images/Vector.svg";
import LoveHemp from "./images/Love Hemp.svg";

const OrderSuccessful = () => {
    return (
        <div>
            <div className="absolute w-full h-117 bg-blue-soft">
                <div className="flex justify-center w-full">
                    <img src={Logo} alt="Product" />
                </div>
            </div>
            <div className="bg-blue-light pt-93 pb-4 w-auto h-auto px-5">
                <div className="relative  w-auto h-auto shadow-3xl rounded-lg bg-white">
                    <div className="block  p-4">
                        <div className="flex w-auto h-104 justify-center bg-grey rounded-md-2">
                            <img src={Vector} alt="stars" className="py-202" />
                            <p className="py-202 pl-2 font-inter font-semibold not-italic text-price-color tracking-wide text-sm">ORDER COMPLETE</p>
                        </div>
                        <div className="flex justify-center h-119 px-115 pt-94">
                            <img src={LoveHemp} alt="LoveHemp"/>
                        </div>
                        <div className="flex justify-center mt-200">
                            <p className="text-xl text-center text-price-color font-inter font-bold not-italic">
                                Good news!
                            </p>
                        </div>
                        <div className="flex justify-center mt-201">
                            <p className="text-base text-center text-price-color font-inter font-medium not-italic">
                                We’ve recived your payment and your order will be on its way, very soon!
                            </p>
                        </div>
                        <div className="flex justify-center mt-4">
                            <p className="text-input text-center text-price-color font-inter font-medium not-italic">
                                Thanks for shopping with </p>
                                <p className="text-input pl-1 text-center text-price-color font-inter font-semibold not-italic">LOVEHEMP</p>
                        </div>
                    </div>


                    <div className="block bg-blue-light h-120 mt-6 rounded-b-md-1">
                        <div className="flex px-94 py-5 justify-between ">
                            <div className=" flex">
                                <p className="text-input font-inter font-medium not-italic text-price-color">Order</p>
                            </div>
                            <div className=" flex">
                                <p className="text-input font-inter font-medium not-italic text-price-color">12345</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-auto h-121 my-5 bg-white rounded-lg shadow-2xl">
                    <div className="flex justify-center">
                        <button
                            // onClick={ () => setStep(step + 1)}
                            className="w-full mt-5 mx-5 h-205 bg-darkGrey rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-white text-smbtn">
                            Sign up for notifications
                        </button>
                    </div>
                    <div className=" mt-5 ">
                        <p className="px-5 pb-4 text-xs text-center text-gray-400 font-inter font-normal not-italic">
                            By signing up to this newsletter you agree to let Love Hemp send you updates and offers about thier products in acordance with thier terms of service and privacy information.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default OrderSuccessful;