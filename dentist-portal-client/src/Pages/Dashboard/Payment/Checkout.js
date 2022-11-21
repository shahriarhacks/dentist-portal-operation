/* eslint-disable no-unused-vars */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import useHeadersPost from "../../../hooks/useHeadersPost";

const Checkout = ({ booking }) => {
  const headers = useHeadersPost();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [success, setSuccess] = useState("");
  const [transID, setTransID] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const { price, email, patient, _id } = booking;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/create-payment-intent`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ price }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data?.clientSecret);
      });
  }, [headers, price]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
    } else {
      setCardError("");
      //   console.log("[PaymentMethod]", paymentMethod);
    }

    const { paymentIntent, error: paymentError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: patient,
            email: email,
          },
        },
      });

    if (paymentError) {
      setCardError(paymentError.message);
      return;
    }
    setSuccess("");
    setTransID("");
    if (paymentIntent.status === "succeeded") {
      const payment = {
        payAmount: price,
        transId: paymentIntent.id,
        email,
        name: patient,
        bookingId: _id,
      };

      fetch(`${process.env.REACT_APP_SERVER_URL}/payments`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payment),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.acknowledged) {
            setSuccess("Congrats! Your Payment Complete");
            setTransID(paymentIntent?.id);
          }
        });
    }
  };
  return (
    <>
      {cardError && <p className="py-3 text-red-500">{cardError}</p>}
      <form onSubmit={handleSubmit}>
        <CardElement
          className="bg-emerald-200 rounded p-3"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button
          type="submit"
          className="btn btn-sm btn-primary my-4"
          disabled={!stripe || !clientSecret}
        >
          Pay
        </button>
      </form>
      {success && <p className="text-green-500 my-4">{success}</p>}
      {transID && (
        <p className="text-green-500 my-4">
          Your TransID is{" "}
          <span className="text-orange-400 font-semibold">{transID}</span>
        </p>
      )}
    </>
  );
};

export default Checkout;
