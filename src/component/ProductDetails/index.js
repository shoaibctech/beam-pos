import React, {useEffect} from "react";
import LoveHemp from "./images/Love Hemp.svg";
import stars from "./images/stars.svg";
import d from "./images/Desktop.svg";
import vector from "./images/Vector.svg";
import ShopifyStepper from "../UI/ShopifyStepper";
import './styles.css';

const ProductDetails = ({step, setStep, product, strengthIndex, setStrengthIndex, flavourIndex, setFlavourIndex}) => {

    useEffect(() => {
        let element = document.getElementById('product-details');
        element.scrollIntoView({behavior: "auto"});
    }, []);

    return (
        <div id="product-details">
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
            <div className="bg-blue-light rounded-md-2 h-auto w-screen  px-5">
                <div className="w-auto h-auto shadow-3xl rounded-b-md-2 bg-white">
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

                        <div className="flex mt-201 ">
                            <div className="flex py-2 px-84 w-215 h-107 rounded-md-1 bg-grey">
                                <p className="w-215 text-center font-inter font-medium not-italic tracking-custom text-title-color text-sm1" >
                                    {product && product.strength[strengthIndex]}
                                </p>
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
                            <p className="font-inter font-semibold not-italic text-flavour-color tracking-wider text-xxs">FLAVOUR</p>
                            <div className="flex flex-wrap justify-start mt-83">
                                {
                                    product && product.flavour.map((flavour, index) =>
                                        <button
                                            key={index}
                                            onClick={e => {
                                                e.preventDefault();
                                                setFlavourIndex(index);
                                            }}
                                            className={`${ flavourIndex === index ?
                                                'mb-2 mr-2.5 capitalize px-84 py-302 w-auto whitespace-nowrap h-109 rounded-sm   border border-border bg-darkGrey font-inter font-medium not-italic text-white text-smbtn' : 
                                                'mb-2 mr-2.5 capitalize px-84 py-302 w-auto h-109 whitespace-nowrap border border-border rounded-sm font-inter font-medium not-italic text-smbtn'}`}>
                                            {flavour}
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        <div className="block  mt-203">
                            <p className="font-inter font-semibold not-italic text-flavour-color tracking-wider text-xxs">STRENGTH</p>
                            <div className="flex  mt-83">
                                {
                                    product && product.strength.map( (strn, index) =>
                                        <button
                                            key={index}
                                            onClick={() => setStrengthIndex(index)}
                                            className={`${index === strengthIndex ?
                                                'mb-2 mr-2.5 px-84 py-302 w-auto whitespace-nowrap h-109 rounded-sm   border border-border bg-darkGrey font-inter font-medium not-italic text-white text-smbtn' :
                                                'mb-2 mr-2.5 px-84 py-302 w-auto h-109 whitespace-nowrap border border-border rounded-sm font-inter font-medium not-italic text-smbtn'}`}>
                                            {strn}
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="block mt-205 pb-211 bg-blue-light rounded-b-md-2">
                        <div className="flex px-86 pt-87 justify-between ">
                            <div className=" flex">
                                <p className="text-base leading-8 font-inter font-medium not-italic text-price-color">Price</p>
                            </div>
                            <div className=" flex flex-col text-right">
                                <p className="text-base leading-8 font-inter font-medium not-italic text-price-color">£{product && product.price}</p>
                                <p className="text-xxs font-inter tracking-tight font-semibold not-italic text-flavour-color">
                                    <span className="pr-1 text-xxs line-through font-inter tracking-tight font-semibold not-italic text-gray-400">Was £49.99 </span>
                                    Saving £5.00
                                </p>
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