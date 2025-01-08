import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";

// current page 📄
const HomePage = async () => {
  const loggedInUser = await getLoggedInUser();
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome, "
            user={loggedInUser?.name ?? "Guest"}
            subtext="Access and manage your account and transactions with ease."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={15000.35}
          />
        </header>

        {/* TODO: recent transactions */}
        Recent transactions
      </div>

      <RightSidebar
        user={loggedInUser}
        transactions={[]}
        banks={[{ currentBalance: 125.50 }, { currentBalance: 250.10 }]}
      />
    </section>
  );
};

export default HomePage;
