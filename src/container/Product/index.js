import React, {useState }  from "react";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
import ProductDetails from '../../component/ProductDetails';
import ShippingDetails from '../../component/ShippingDetails';
import OrderSummary from '../../component/OrderSummary';
import PaymentMethod from '../../component/PaymentMethod';
import BankSelection from "../../component/BankSelection";

const Product = () => {
    const [step, setStep] = useState(0);
    // const [product, setProduct] = useState();
    const product = {
        title: 'Love Hemp® CBD Liquid Oral Oil Drops,  1,200mg CBD',
        price: '29.99',
        img: 'https://cdn.shopify.com/s/files/1/0556/4900/9833/products/Homepage-CategoriesOils_600x1_cbb13d10-a374-4509-b3eb-7ed16a0f89ac.png?v=1624286394',
        quantity: 71
    }
    // const { token } = useParams();
    const components = [ProductDetails, ShippingDetails, OrderSummary, PaymentMethod, BankSelection];


    // useEffect(() => {
    //     getProduct();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const renderComponent = () => {
        const Component = components[step];
        return <Component step={step} setStep={setStep} product={product} />;
    }
    // const getProduct = async () => {
    //     try {
    //         const reqProduct = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product/${token}`);
    //         setProduct(reqProduct.data.item);
    //     } catch (e) {
    //         console.log('error : ', e);
    //     }
    // }
    return (
        <div>{renderComponent()}</div>

    );
}

export default Product;