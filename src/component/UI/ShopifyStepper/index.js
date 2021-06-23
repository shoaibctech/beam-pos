import React from 'react';

const ShopifyStepper = ({step}) => {
    const getStepperClasses = (current) => {
        if (current <= step) {
            return "w-full text-center text-type-color";
        } else {
            return "w-full text-center "
        }
    }
    const getborderColor = (current) => {
        if (current <= step) {
            return "border-borderColor border-t-4";
        } else {
            return " border-t-4"
        }
    }
    return (
        <React.Fragment>
            <div className="flex py-4 px-200 text-flavour-color text-stepper font-inter font-medium not-italic justify-between w-auto h-100 bg-white rounded-md-1">
                <div className={`${getStepperClasses(0)}`}>
                    <hr className={`${getborderColor(0)}   rounded-l-sm`} />
                    <div className="pt-92" >Product</div>
                </div>
                <div className={getStepperClasses(1)}>
                    <hr className={`${getborderColor(1)} `}/>
                    <div className="pt-92" >Shipping</div>
                </div>
                <div className={getStepperClasses(2)}>
                    <hr className={`${getborderColor(2)} `}/>
                    <div className="pt-92" >Payment</div>
                </div>
                <div className={`${getStepperClasses(3)}`}>
                    <hr className={`${getborderColor(3)}  rounded-r-sm`}/>
                    <div className="pt-92" >Summery</div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default ShopifyStepper;