import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";

// server actions
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccounts } from "@/lib/actions/bank.actions";

// current page 📄
const paymentTransfer = async () => {
  const loggedInUser = await getLoggedInUser();

  // fetch accounts
  const accounts = await getAccounts({
    userDocumentId: loggedInUser.$id,
  });
  if (!accounts) return;

  // fetch singular account details
  const accountsData = accounts?.data;

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please fill out the form below to initiate a payment transfer"
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default paymentTransfer;
