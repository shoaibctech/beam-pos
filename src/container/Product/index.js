import React, {useState }  from "react";
import ProductDetails from '../../component/ProductDetails';
import ShippingDetails from '../../component/ShippingDetails';
import OrderSummary from '../../component/OrderSummary';

const Product = () => {
    const [step, setStep] = useState(2)
    const components = [ProductDetails, ShippingDetails, OrderSummary];

    const renderComponent = () => {
        const Component = components[step];
       return <Component step={step} setStep={setStep} />;
    }
    return (
        <div>{renderComponent()}</div>

    );
}

export default Product;