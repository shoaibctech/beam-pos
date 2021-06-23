import React  from "react";
import ShopifyStepper from "../UI/ShopifyStepper";

const OrderSummary = ({step, setStep, product}) => {
    return (
        <div>
            <div className="bg-blue-light  w-screen px-5 pt-5">
                <ShopifyStepper step={step} />

                <div className="flex h-113 w-auto bg-white rounded-lg mt-5">
                    <div className="m-5 w-screen ">
                        <div className="flex justify-between pb-83 border-b border-greyBorder">
                            <div className=" flex">
                                <p className="text-input font-inter font-medium not-italic text-price-color">Your information</p>
                            </div>
                            <div className="flex flex-col text-right">
                                <p className="text-input font-inter font-medium not-italic text-price-color">Thomas Fry</p>
                                <p className="pt-88 text-input font-inter font-medium not-italic text-price-color">tom@email.com</p>
                                <p className="pt-83 text-input font-inter font-medium not-italic text-price-color">Address line 1</p>
                                <p className="pt-88 text-input font-inter font-medium not-italic text-price-color">Address line 2</p>
                                <p className="pt-88 text-input font-inter font-medium not-italic text-price-color">City</p>
                                <p className="pt-88 text-input font-inter font-medium not-italic text-price-color">Postcode</p>

                            </div>
                        </div>
                        <div className="flex pt-81 pb-81 border-b border-greyBorder justify-between ">
                            <div className=" flex">
                                <p className="text-input leading-8 font-inter font-medium not-italic text-price-color">Price</p>
                            </div>
                            <div className="flex flex-col text-right">
                                <p className="text-base font-inter font-semibold not-italic text-price-color">£44.99</p>
                                <p className="text-xxs font-inter tracking-tight font-medium not-italic text-flavour-color">Saving £5.00</p>
                            </div>
                        </div>
                        <div className="flex pt-81 pb-81 border-b border-greyBorder justify-between ">
                            <div className=" flex">
                                <p className="text-input leading-8 font-inter font-medium not-italic text-price-color">Delivery</p>
                            </div>
                            <div className="flex flex-col text-right">
                                <p className="text-base font-inter font-semibold not-italic text-price-color">Free</p>
                                <p className="text-xxs font-inter tracking-tight font-medium not-italic text-flavour-color">3-5 business days</p>
                            </div>
                        </div>
                        <div className="flex pt-89 pb-200 justify-between ">
                            <div className=" flex">
                                <p className="text-sm1 leading-5 font-inter font-semibold not-italic text-black1">Total</p>
                            </div>
                            <div className=" flex">
                                <p className="text-totalPrice tracking-tight font-inter font-semibold not-italic text-black1">£49.99</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-xxs font-inter text-center font-medium not-italic text-flavour-color">You’ll be redirected to your bank for payment</p>
                        </div>

                        <div className=" mt-2.5 ">
                            <p className=" text-xs text-center text-gray-400 font-inter font-normal not-italic">
                                Terms and conditions of order text. By confirming this order to Love Hemp you agree to their terms of service and privacy information.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={ () => setStep(step - 1)}
                    className="w-full mt-211 mb-8 rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-flavour-color text-smbtn">
                    Back to shipping
                </button>
            </div>

            <div className="flex justify-center sticky bottom-0 bg-white py-205 rounded-md-2 shadow-2xl">
                <button
                    onClick={ () => setStep(step + 1)}
                    className="w-full mx-5 h-205 bg-darkGrey rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-white text-smbtn">
                    Finalise your order
                </button>
            </div>
        </div>
    );
}

export default OrderSummary;
