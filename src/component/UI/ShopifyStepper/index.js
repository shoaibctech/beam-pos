import React from 'react';

const ShopifyStepper = ({step}) => {
    const getStepperClasses = (current) => {
        if (current <= step) {
            return "w-full text-center border-t-4 border-grey-900";
        } else {
            return "w-full text-center border-t-4"
        }
    }
    return (
        <React.Fragment>
            <div className="flex p-4 justify-between w-auto h-100 bg-white rounded-md-1">
                <div className={getStepperClasses(0)}>Product</div>
                <div className={getStepperClasses(1)}>Shipping</div>
                <div className={getStepperClasses(2)}>Payment</div>
                <div className={getStepperClasses(3)}>Summery</div>
            </div>
        </React.Fragment>
    );
}
export default ShopifyStepper;