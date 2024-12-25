import React, { useState } from "react";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import Label from "../../components/Label";
import Button from "../../components/Button";
import { url, reservation } from "../../utils/api";

const PaymentForm = ({ totalPrice, handlePayment }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [disableButton, setDisableButton] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const createPaymentIntent = async (price) => {
        const token = localStorage.getItem("token");
        const values = { amount: price };
        const response = await axios.post(`${url}${reservation}/create-payment-intent`, values, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.clientSecret;
    };

    const confirmPayment = async (clientSecret, cardElement) => {
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement }
        });
        return { error, paymentIntent };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrorMessage("");
        setDisableButton(true);

        if (!stripe || !elements) {
            setFormErrorMessage("Stripe.js has not loaded yet.");
            setDisableButton(false);
            return;
        }

        try {
            const clientSecret = await createPaymentIntent(totalPrice);
            const cardNumberElement = elements.getElement(CardNumberElement);
            const { error, paymentIntent } = await confirmPayment(clientSecret, cardNumberElement);

            if (error) {
                setFormErrorMessage(error.message);
                setDisableButton(false);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                handlePayment();
            }
        } catch (err) {
            setFormErrorMessage("An error occurred during payment. Please try again.");
            setDisableButton(false);
        }
    };

    const elementOptions = {
        style: {
            base: {
                color: "#101828",
                '::placeholder': { color: '#3F536F' },
                fontWeight: '400',
                fontSize: '16px',
                letterSpacing: '0.005rem'
            },
            invalid: { color: "#D92D20" },
            complete: { color: "#101828" }
        }
    };

    return (
        <form onSubmit={ handleSubmit }>
            <p className="text-neutral-700 font-semibold">Card Number</p>
            <Label className="!text-neutral-900 h-48" leftIcon={ <FontAwesomeIcon className="h-16" icon={ fas.faCreditCard } /> }>
                <CardNumberElement className="w-full" options={ elementOptions } />
            </Label>

            <div className="flex gap-8 pt-24">
                <div className="w-[50%]">
                    <p className="font-semibold text-neutral-700">Expiry Date</p>
                    <Label className="h-48">
                        <CardExpiryElement className="w-full" options={ elementOptions } />
                    </Label>
                </div>
                <div className="w-[50%]">
                    <p className="font-semibold text-neutral-700">CVC</p>
                    <Label className="h-48">
                        <CardCvcElement className="w-full" options={ elementOptions } />
                    </Label>
                </div>
            </div>

            { formErrorMessage && <p className="text-body-m text-error-600">{ formErrorMessage }</p> }

            <Button className="!w-full mt-[95px]" disabled={ disableButton }>
                Make Payment - { totalPrice } KM
            </Button>
        </form>
    );
};

export default PaymentForm;
