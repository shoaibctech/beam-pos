import React from "react";
import PlanCard from '../../component/PlanCard';
import './styles.css';
// import useViewPort from '../../utils/'
import { makeRequest, getUserData } from "../../utils";

const DirectDebit = () => {
    const planList = [{
        name: 'Beam Lite',
        price: '0.30',
        currency: 'GBP',
        d1: 'Description one',
        d2: 'Description two'
        },
        {
            name: 'Beam Standard',
            price: '40.00',
            currency: 'GBP',
            d1: 'Description one',
            d2: 'Description two'
        },
        // {
        //     name: 'Beam Platinum',
        //     price: '100.00',
        //     currency: 'GBP',
        //     d1: 'Description one',
        //     d2: 'Description two'
        // }
    ];

    const handleSelectPlan = async (plan) => {
        console.log('show Plan ', plan);
        try {
            const req = await makeRequest(`${process.env.REACT_APP_BACKEND_URL}/api/directdebit/getpaymentlink`,
                {
                    amount: 0.30,
                    email: 'linktofarooq@gmail.com',
                    merchantId: getUserData().merchant_id,
                    merchantName: 'Test Merchant B',
                    merchantType: 'nontip',
                }, 'POST');
            console.log('req :: ', req.data);
            window.open(req.data.link, '_self');
        } catch (e) {

        }
    }

    return (
        <div>
            <div className="plans-container desktop-m-top">
                {
                    planList.map ((plan, index) =>
                        <PlanCard key={index + plan.name} plan={plan} handlePlanSelect={() => handleSelectPlan(plan)} />
                    )
                }
            </div>
        </div>
    );
}

export default DirectDebit;