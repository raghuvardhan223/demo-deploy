import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get('http://localhost:5000/plans');
                setPlans(response.data.items);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPlans();
    }, []);

    const handleSubscribe = async (planId) => {
        try {
            const response = await axios.post('http://localhost:5000/subscription', {
                plan_id: planId,
                customer_notify: 1,
                quantity: 1,
                total_count: 1,
            });
            alert('Subscription created! Check console for details.');
            console.log(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (plans.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Available Plans</h2>
            {plans.map(plan => (
                <div key={plan.id}>
                    <h3>{plan.item.name}</h3>
                    <p>Amount: {plan.item.amount / 100} {plan.item.currency}</p>
                    <button onClick={() => handleSubscribe(plan.id)}>Subscribe</button>
                </div>
            ))}
        </div>
    );
};

export default Plans;
