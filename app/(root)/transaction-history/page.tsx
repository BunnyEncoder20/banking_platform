import React from "react";

// components
import HeaderBox from "@/components/HeaderBox";

// server actions
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";

// utils
import { formatAmount } from "@/lib/utils";
import TransactionsTable from "@/components/TransactionsTable";

// current page 📄
const transactionHistoryPage = async (
  { searchParams: { id, page } }: SearchParamProps,
) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({
    userDocumentId: loggedIn.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  // const rowsPerPage = 10;
  // const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

  // const indexOfLastTransaction = currentPage * rowsPerPage;
  // const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  // const currentTransactions = account?.transactions.slice(
  //   indexOfFirstTransaction, indexOfLastTransaction
  // )

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your recent transactions and bank details"
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name}
            </h2>
            <p className="text-14 text-blue-25">{account?.data.officialName}</p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              {/* last 4 digit of card number */}
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account?.data.mask}</span>
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14">Current Balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data.currentBalance)}
            </p>
          </div>
        </div>

        {/* transactions table */}
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable
            transactions={account?.transactions}
          />
        </section>
      </div>
    </div>
  );
};

export default transactionHistoryPage;
