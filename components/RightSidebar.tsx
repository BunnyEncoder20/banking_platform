import React from "react";
import Image from "next/image";
import Link from "next/link";

// components
import BankCard from "@/components/BankCard";
import Category from "@/components/Category";

// utils
import { countTransactionCategories } from "@/lib/utils";

// current component ⚛️
const RightSidebar = ({
  user,
  transactions,
  banks,
}: RightSidebarProps) => {
  // budgetCategoryies
  const categories: CategoryCount[] = countTransactionCategories(transactions);
  console.log(categories);
  return (
    <aside className="right-sidebar">
      {/* profile section */}
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {user.firstName[0]}
            </span>
          </div>

          {/* Name email */}
          <div className="profile-details">
            <h1 className="profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* current banks */}
      <section className="banks">
        {/* My Bank & Add bank */}
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image
              src="/icons/plus.svg"
              height={20}
              width={20}
              alt="plus"
            />
            <h2 className="text-14 font-semibold text-grey-600">
              Add Bank
            </h2>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>

            {/* if multiple banks accounts, we showing ✌️ cards */}
            {banks[1] && (
              <div className="absolute z-0 right-0 top-8 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}

        {/* cateogry budgets */}
        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top Category</h2>
          <div className="space-y-5">
            {categories.map((category, index) => (
              <Category key={index} category={category} />
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;
