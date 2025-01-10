import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";

// current page 📄
const paymentTransfer = () => {
  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please fill out the form below to initiate a payment transfer"
      />

      <section className="size-full pt-5">
      </section>
    </section>
  );
};

export default paymentTransfer;
