import React, {useEffect, useState} from "react";
import BorderTick from "./images/borderTick.svg";
import Search from "./images/search.svg";
import { NUAPAY_LIVE_BANKS } from "../../utils/Constants/index";

const BankSelection = ({step, setStep, bankId, setBankId}) => {
    const [searchBank, setSearchBank] = useState();
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        let element = document.getElementById('bank-selection');
        element.scrollIntoView({behavior: "smooth"});
    }, []);

    const handleSearch = (key) => {
        setSearchInput(key);
        let filterdBank = NUAPAY_LIVE_BANKS.filter(x => x.name.toLowerCase().indexOf(key.toLowerCase()) > -1);
        if(key){
            setSearchBank(filterdBank);
        } else {
            setSearchBank([]);
        }
    }
    const handleSearchSelect = (sb) => {
        setBankId(sb.id);
        let element = document.getElementById(sb.id);
        element.scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
        setSearchBank([]);
        setSearchInput('');
    }
    return (
            <div className="bg-paymentDark w-auto pt-10 h-114" id="bank-selection">
                <div className="bg-blue-light w-auto rounded-t-lg pt-200 px-5">
                    <div className="flex flex-col w-auto h-116 px-5 bg-white rounded-md-1">
                        <div className="mt-83">
                            <p className="text-input font-inter font-semibold not-italic text-price-color">Select your bank</p>
                        </div>
                        <div className="mt-5">
                            <div className="flex p-4 h-112 w-full border border-border rounded-md-2 shopify-input-search">
                                <img src={Search} alt="logo" />
                                <input
                                    className="pl-search font-inter text-input font-inter font-normal not-italic"
                                    placeholder="Search for bank"
                                    value={searchInput}
                                    type="text"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        { searchBank && searchBank.length > 0 &&
                            <div className="relative bg-white rounded-md-2 z-50 shadow-2xl"
                                style={{overflowY: 'scroll', border: '1px solid', maxHeight: '300px'}}
                            >
                                {
                                    searchBank && searchBank.map ((sb, index) =>
                                        <div
                                            key={`search-${sb.id}`}
                                            className="cursor-pointer flex relative"
                                            onClick={() => handleSearchSelect(sb)}
                                        >
                                            <img src={sb.logo} alt="logo" className="pl-4" style={{width: '58px', height: '52px'}} />
                                            <p className="py-4 pl-4 text-price-color font-inter text-input font-inter font-normal not-italic">
                                                {sb.name}
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        }

                        <div className="h-217 mt-5  overflow-auto">
                            <div className="h-112 w-auto">
                                {
                                    NUAPAY_LIVE_BANKS && NUAPAY_LIVE_BANKS.map ((bank, index) =>
                                        <div
                                            className={`${bankId === bank.id ? 'border-borderGrey' : ''} cursor-pointer flex border border-border rounded-md-2  mb-214`}
                                            key={index}
                                            onClick={() => setBankId(bank.id)}
                                            id={bank.id}
                                        >
                                            <img src={bank.logo} alt="logo" className="pl-4" style={{width: '58px', height: '52px'}} />
                                            <p className="py-4 pl-4 text-price-color font-inter text-input font-inter font-normal not-italic">
                                                {bank.name}
                                            </p>
                                            {bankId === bank.id && <img src={BorderTick} alt="tick" className="ml-auto pr-4"/>}
                                        </div>
                                    )
                                }
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