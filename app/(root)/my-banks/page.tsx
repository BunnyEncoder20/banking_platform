import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";

// server actions
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccounts } from "@/lib/actions/bank.actions";
import BankCard from "@/components/BankCard";

// Current Page 📄
const myBanksPage = async () => {
  // fetch logged in user
  const loggedInUser = await getLoggedInUser();

  // fetch accounts
  const accounts = await getAccounts({
    userDocumentId: loggedInUser.$id,
  });
  if (!accounts) return;

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities"
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your Cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((a: Account) => (
              <BankCard
                key={accounts.id}
                account={a}
                userName={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default myBanksPage;
