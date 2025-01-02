import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";

// current page 📄
const HomePage = () => {
  const loggedIn = {
    firstname: "Bunny",
  };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome, "
            user={loggedIn?.firstname ?? "Guest"}
            subtext="Access and manage your account and transactions with ease."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={15000.35}
          />
        </header>
      </div>
    </section>
  );
};

export default HomePage;
