import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Assuming you create and import App.css for styling

const API_URL = 'https://demo-deploy1.onrender.com/api';

const CreateSubscription = () => {
    const [formData, setFormData] = useState({
        plan_id: '',
        total_count: '',
    });

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscriptionId, setSubscriptionId] = useState("");
    const [error, setError] = useState(null);
    const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`${API_URL}/plans`);
                setPlans(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching plans', error);
                setError('Error fetching plans. Please try again later.');
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(${API_URL}/create-subscription, formData);
        console.log('Response:', response.data); // Log the entire response
        if (response.data.short_url) {
            alert('Subscription created successfully!');
            setSubscriptionId(response.data.id);
            console.log('Opening URL:', response.data.short_url); // Log the URL to be opened

            const paymentWindow = window.open(response.data.short_url, '_blank');
            console.log('Payment window:', paymentWindow); // Log the payment window object

            const pollSubscriptionStatus = setInterval(async () => {
                const validateResponse = await axios.get(${API_URL}/create-subscription/${response.data.id});
                const subscriptionStatus = validateResponse.data.status;

                if (subscriptionStatus === "active") {
                    setIsSubscriptionActive(true);
                    alert("Subscription active");
                    clearInterval(pollSubscriptionStatus);
                    if (paymentWindow) {
                        paymentWindow.close();
                    }
                }
            }, 3000);
        } else {
            console.error('short_url is missing in the response.');
        }
    } catch (error) {
        alert('Error creating subscription');
        console.error(error);
    }
};

    const handleCancel = async () => {
        if (!subscriptionId) {
            alert("No subscription found to cancel.");
            return;
        }

        try {
            await axios.post(`${API_URL}/cancel-subscription`, {
                subscription_id: subscriptionId
            });
            alert('Subscription cancelled successfully!');
            setSubscriptionId("");
            setIsSubscriptionActive(false);
        }  catch (error) {
            alert('Error cancelling subscription');
            console.error(error);
        }
    };

    return (
        <div className="subscription-container">
            <div className="create-subscription-section">
                <h2>Create Subscription</h2>
                {loading ? (
                    <p>Loading plans...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="subscription-form">
                        <select name="plan_id" value={formData.plan_id} onChange={handleChange} required className="input-field">
                            <option value="">Select Plan</option>
                            {plans.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.item.name} - {plan.item.amount / 100} {plan.item.currency}
                                </option>
                            ))}
                        </select>
                        <input type="number" name="total_count" value={formData.total_count} onChange={handleChange} placeholder="Total Count" required className="input-field" />
                        <br />
                        <button type="submit" className="submit-button">Create Subscription</button>
                    </form>
                )}
            </div>
            {isSubscriptionActive && (
                <div className="cancel-subscription-section">
                    <h2>Cancel Subscription</h2>
                    <button onClick={handleCancel} className="cancel-button">Cancel Subscription</button>
                </div>
            )}
        </div>
    );
};

export default CreateSubscription;
