import React, {useState }  from "react";
import ProductDetails from '../../component/ProductDetails';
import ShippingDetails from '../../component/ShippingDetails';
import OrderSummary from '../../component/OrderSummary';
import PaymentMethod from '../../component/PaymentMethod';

const Product = () => {
    const [step, setStep] = useState(3)
    const components = [ProductDetails, ShippingDetails, OrderSummary, PaymentMethod];

    const renderComponent = () => {
        const Component = components[step];
       return <Component step={step} setStep={setStep} />;
    }
    return (
        <div>{renderComponent()}</div>

    );
}

export default Product;