import React from "react";
import { useLoaderData } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./Checkout";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const Payment = () => {
  const booking = useLoaderData();
  const { treatment, price, appointmentDate, slot } = booking;
  return (
    <div>
      <h3 className="text-4xl">
        Payment for <strong>{treatment}</strong>
      </h3>
      <p className="text-lg my-4">
        You need to pay for <strong>{treatment}</strong> amount of{" "}
        <strong>${price}</strong> for your appointment on{" "}
        <strong>{appointmentDate}</strong> at <strong>{slot}</strong>
      </p>
      <div className="w-96 my-12">
        <Elements stripe={stripePromise}>
          <Checkout booking={booking} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
