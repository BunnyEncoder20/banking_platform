import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";

// current page 📄
const HomePage = () => {
  const loggedIn = {
    firstName: "Bunny",
    lastName: "Encoder",
    email: "bunnyEncoder@email.com",
  };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome, "
            user={loggedIn?.firstName ?? "Guest"}
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

      <RightSidebar user={loggedIn} transactions={[]} banks={[]} />
    </section>
  );
};

export default HomePage;
