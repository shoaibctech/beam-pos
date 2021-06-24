import React  from "react";
import Vector from "./images/Vector.svg";
import LoveHemp from "./images/Love Hemp.svg";

const OrderFailed = () => {
    return (
        <div>
            <div className="bg-blue-light pt-300 pb-301 w-auto min-h-auto px-5">
                <div className="relative  w-auto shadow-3xl rounded-lg bg-white">
                    <div className="block  px-4 pt-4">
                        <div className="flex w-auto h-104 justify-center bg-grey rounded-md-2">
                            <img src={Vector} alt="stars" className="py-202" />
                            <p className="py-202 pl-2 font-inter font-semibold not-italic text-price-color tracking-wide text-sm">ORDER COMPLETE</p>
                        </div>
                        <div className="flex justify-center h-119 px-115 pt-94">
                            <img src={LoveHemp} alt="LoveHemp"/>
                        </div>
                        <div className="flex justify-center mt-200">
                            <p className="text-heading text-center text-price-color font-inter font-bold not-italic">
                                Payment not received
                            </p>
                        </div>
                        <div className="flex justify-center mt-201">
                            <p className="text-input text-center text-price-color font-inter font-medium not-italic">
                                We are very sorry, It looks like your payment has not gone through. Please try again.
                            </p>
                        </div>
                        <div className=" flex justify-center mt-200">
                            <p className="text-input text-center text-price-color font-inter font-semibold not-italic">A canceled payment reciept
                            <span className="pl-1 text-input text-price-color font-inter font-medium not-italic">
                                has been emailed to you. </span></p>
                        </div>
                        <div className=" flex justify-center my-200">
                            <p className=" text-center text-input text-price-color font-inter font-medium not-italic">If the problem persists you may wish to
                                <span className="pl-1 text-input text-price-color font-inter font-semibold not-italic">
                                try using a different bank.</span></p>
                        </div>
                    </div>


                    <div className="block bg-blue-light h-120 mt-6 rounded-b-md-1">
                        <div className="flex px-94 py-5 justify-between ">
                            <div className=" flex">
                                <p className="text-input font-inter font-medium not-italic text-price-color">Cancelled reference</p>
                            </div>
                            <div className=" flex">
                                <p className="text-input font-inter font-medium not-italic text-price-color">12345</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center sticky bottom-0 bg-white py-205 rounded-md-2 shadow-2xl">
                <button
                    // onClick={ () => setStep(step+1)}
                    className="w-full mx-5 h-205 bg-darkGrey rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-white text-smbtn">
                    Continue to shipping
                </button>
            </div>
        </div>
    );
}

export default OrderFailed;