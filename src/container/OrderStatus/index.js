import React, {useState }  from "react";
import OrderSuccessful from "../../component/OrderSuccessful";
import OrderFailed from "../../component/OrderFailed";

const OrderStatus = () => {
    const [step, setStep] = useState(0);

    const components = [OrderSuccessful, OrderFailed];

    const renderComponent = () => {
        const Component = components[step];
        return <Component />;
    }
    return (
        <div>{renderComponent()}</div>

    );
}

export default OrderStatus;