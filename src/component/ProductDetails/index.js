import React from "react";
import LoveHemp from "./images/Love Hemp.svg";
import stars from "./images/stars.svg";
import d from "./images/Desktop.svg";
import vector from "./images/Vector.svg";
import ShopifyStepper from "../UI/ShopifyStepper";

const ProductDetails = ({step, setStep, product}) => {

    console.log('product de:: ', product);

    return (
        <div>
            <div className="relative w-auto h-98 bg-blue px-5 pt-81">
                <ShopifyStepper step={step} />
                <div className="flex justify-center w-auto h-45 mt-8 mb-8 ">
                    <img src={product && product.img} alt="Product" />
                </div>
                <div className="flex h-101 justify-between bg-ratingDiv rounded-t-md-1">
                    <div className="pl-4 flex">
                        <img src={LoveHemp} alt="love hemp" />
                    </div>
                    <div className="pr-4 flex">
                        <img src={stars} alt="stars" />
                    </div>
                </div>
            </div>
            <div className="bg-blue-light w-screen  px-5">
                <div className="w-auto h-102 shadow-3xl bg-white">
                    <div className="block  pt-4 pl-82 pr-83">
                        <div className="flex w-auto h-104 justify-center bg-grey rounded-md-2">
                            {/*<p className="py-3 font-inter font-semibold not-italic text-orange-500 tracking-wide text-sm">FREE DELIVERY (UK ONLY)</p>*/}
                            <img src={d} alt="stars" />
                        </div>
                        <div className="flex w-auto h-12 mt-200 bg-white">
                            <p className="font-inter font-semibold not-italic tracking-custom text-title-color text-lg">
                                {product && product.title}
                            </p>
                        </div>

                        <div className="flex  mt-201 ">
                            <div className="flex h-107 rounded-md-1 bg-grey">
                                <p className="py-2 px-84  font-inter font-medium not-italic tracking-custom text-title-color text-sm1" >{'{'} Strength {'}'}</p>
                            </div>
                            <div className="flex h-107 ml-202 rounded-md-1 bg-grey">
                                <p className="py-2 px-84 font-inter font-medium not-italic tracking-custom text-title-color text-sm1" >30ml</p>
                            </div>
                        </div>

                        <div className="flex justify-start mt-203 ">
                            <div className="flex ">
                                <img src={vector} alt="Product" className="h-83" />
                                <p className="pl-85 h-4 font-inter font-medium not-italic text-type-color text-sm">Vegan</p>
                            </div>
                            <div className="flex pl-204">
                                <img src={vector} alt="Product" className="h-83" />
                                <p className="pl-85 h-4 font-inter font-medium not-italic text-type-color text-sm">Gluten free</p>
                            </div>
                            <div className="flex pl-204">
                                <img src={vector} alt="Product" className="h-83" />
                                <p className="pl-85 h-4 font-inter font-medium not-italic text-type-color text-sm">Zero THC</p>
                            </div>
                        </div>

                        <div className="block  mt-203">
                            <h1 className="font-inter font-semibold not-italic text-flavour-color tracking-wider text-sm">FLAVOUR</h1>
                            <div className="flex  mt-4">
                                <button className="px-84 py-2.5 w-auto h-109 rounded-sm bg-darkGrey font-inter font-medium not-italic text-white text-smbtn">Flavour 1</button>
                                <button className="ml-2.5 px-84 py-2.5 w-auto h-109 border border-border rounded-sm font-inter font-medium not-italic text-smbtn">Flavour 2</button>
                            </div>
                        </div>
                        <div className="block  mt-203">
                            <h1 className="font-inter font-semibold not-italic text-flavour-color tracking-wider text-sm">STRENGTH</h1>
                            <div className="flex  mt-4">
                                <button className="px-84 py-2.5 w-auto h-109 rounded-sm bg-darkGrey font-inter font-medium not-italic text-white text-smbtn">1%</button>
                                <button className="ml-2.5 px-84 py-2.5 w-auto h-109 border border-border rounded-sm font-inter font-medium not-italic text-btn-text-color text-smbtn">2%</button>
                                <button className="ml-2.5 px-84 py-2.5 w-auto h-109 border border-border rounded-sm font-inter font-medium not-italic text-btn-text-color text-smbtn">4%</button>
                                <button className="ml-2.5 px-84 py-2.5 w-auto h-109 border border-border rounded-sm font-inter font-medium not-italic text-btn-text-color text-smbtn">10%</button>
                                <button className="ml-2.5 px-84 py-2.5 w-auto h-109 border border-border rounded-sm font-inter font-medium not-italic text-btn-text-color text-smbtn">20%</button>
                            </div>
                        </div>
                    </div>
                    <div className="block mt-205 h-110 bg-blue-light rounded-b-md-1">
                        <div className="flex px-86 pt-87 justify-between ">
                            <div className=" flex">
                                <p className="text-base leading-8 font-inter font-medium not-italic text-price-color">Price</p>
                            </div>
                            <div className=" flex">
                                <p className="text-base leading-8 font-inter font-medium not-italic text-price-color">£{product && product.price}</p>
                            </div>
                        </div>
                        <div className="flex px-86 pt-87 justify-between ">
                            <div className=" flex">
                                <p className="text-base leading-8 font-inter font-medium not-italic text-price-color">Delivery</p>
                            </div>
                            <div className=" flex">
                                <p className="text-base leading-8 font-inter font-medium not-italic text-price-color">3-5 days</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex justify-center py-206 ">
                    <p className="px-4 text-xs text-center text-gray-400 font-inter font-normal not-italic">
                        Terms and conditions of order text. By confirming this order to Love Hemp you agree to their terms of service and privacy information.
                    </p>
                </div>
            </div>
            <div className="flex justify-center sticky bottom-0 bg-white py-205 rounded-md-2 shadow-2xl">
                <button
                    onClick={ () => setStep(step+1)}
                    className="w-full mx-5 h-205 bg-darkGrey rounded-md-2 font-inter text-base font-inter text-center font-medium not-italic text-white text-smbtn">
                    Continue to shipping
                </button>
            </div>

        </div>
    );
}

export default ProductDetails;