import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";

// current page 📄
const HomePage = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const loggedInUser = await getLoggedInUser();

  // fetch accounts
  console.log(`[DEBUG] LoggedInUser: `, loggedInUser);
  const accounts = await getAccounts({
    userDocumentId: loggedInUser.$id,
  });
  if (!accounts) return;

  // fetch singular account details
  const accountsData = accounts?.data;
  const appwriteItemId = accountsData[0]?.appwriteItemId || (id as string);
  console.log("AppwriteItemId: ", appwriteItemId);
  const account = await getAccount({ appwriteItemId });

  console.log("Accounts data: ", accountsData);
  console.log("Singular account data: ", account);

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome, "
            user={loggedInUser?.firstName ?? "Guest"}
            subtext="Access and manage your account and transactions with ease."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        {/* TODO: recent transactions */}
        Recent transactions
      </div>

      <RightSidebar
        user={loggedInUser}
        transactions={accounts?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default HomePage;
