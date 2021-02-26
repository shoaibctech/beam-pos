import React, { useState } from "react";
import './styles.css';
import Loader from "../UI/Loader";

const PlanCard = ({plan, handlePlanSelect}) => {
    const [loading, setLoading] = useState(false);

    const submitPlanSelect = (plan) => {
        setLoading(true);
        handlePlanSelect(plan);
    }
    return (
        <div className="plan-card">
            <header className="plan-header">
                <div className="cert-icon-block">
                    <i className="fas fa-certificate"  style={{fontSize: '50px'}}></i>
                </div>
                <h2>{plan.name}</h2>
            </header>
            <div className="plan-des">
                <p className="plan-price">£{plan.price} / month</p>
            </div>
            <div className="plan-des">
                <p>{plan.d1}</p>
            </div>
            <div className="plan-des">
                <p>{plan.d2}</p>
            </div>
            <div className="plan-des">
                <p>{plan.d2}</p>
            </div>
            <footer className="plan-footer">
                <div>
                    <button className="btn btn-primary" onClick={() => submitPlanSelect(plan)} >
                        {loading ? <Loader size="1rem" color="secondary"/> : 'Purchase Now'}
                    </button>
                </div>
                <p>24 month contract</p>
            </footer>
        </div>
    );
}

export default PlanCard;