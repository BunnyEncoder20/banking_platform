import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import RecentTransactions from "@/components/RecentTransactions";

// server actions
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";

// current page 📄
const HomePage = async ({ searchParams: { id, page } }: SearchParamProps) => {
  // states and hooks
  const currentPage = Number(page as string) || 1;

  // fetch logged in user
  const loggedInUser = await getLoggedInUser();

  // fetch accounts
  const accounts = await getAccounts({
    userDocumentId: loggedInUser.$id,
  });
  if (!accounts) return;

  // fetch singular account details
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });

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

        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={loggedInUser}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default HomePage;
