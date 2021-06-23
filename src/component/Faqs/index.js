import React, { useState } from "react";
import Up from "./images/up.svg";
import Down from "./images/down.svg";

const FaqItem = ({title, message} ) => {

    const [open, setOpen] = useState(false)

    return (
        <div>
            <div className="flex justify-between" onClick={() => setOpen(!open)}>
                <p className=" text-input font-inter font-normal not-italic text-btn-text-color" >{title}</p>
                {!open ? <img src={Down} alt="logo" className="pr-1" /> : <img src={Up} alt="logo" className="pr-1" /> }
            </div>
            {
                open &&
                <div>
                    <p>{message}</p>
                </div>
            }
        </div>
    );
}
 const Faqs = ( ) => {

     const [open, setOpen] = useState(false)

     return (
         <div>
             <p className="text-input font-inter font-semibold not-italic text-price-color"  onClick={() => setOpen(!open)}>FAQ's</p>
             {
                 open &&
                 <div className="pt-83">
                     <FaqItem title={"FAQ #1"} message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}/>
                     <FaqItem title={"FAQ #2"} message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}/>
                     <FaqItem title={"FAQ #3"} message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}/>
                     <FaqItem title={"FAQ #4"} message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}/>
                 </div>
             }
         </div>
     );
 }

 export default Faqs;