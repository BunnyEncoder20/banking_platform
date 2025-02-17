import Link from "next/link";
import React from "react";

// utils
import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import Copy from "./Copy";

// current component ⚛️\
const BankCard = ({
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {
  return (
    <div className="flex flex-col">
      {/* TODO: make card point to bank account details */}
      <Link
        href={`/transaction-history/?id=${account?.appwriteItemId}`}
        className="bank-card min-w-[325px]"
      >
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">
              {account.name}
            </h1>

            <p className="font-ibm-plex-serif font-black text-white">
              {formatAmount(account.currentBalance)}
            </p>
          </div>

          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">{userName}</h1>
              <h2 className="text-12 font-semibold text-white">●● / ●●</h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              {/* last 4 digit of card number */}
              ●●●● ●●●● ●●●● <span className="text-16">{account?.mask}</span>
            </p>
          </article>
        </div>

        <div className="bank-card_icon">
          <Image
            src="/icons/Paypass.svg"
            alt="pay"
            width={20}
            height={24}
          />
          <Image
            src="/icons/mastercard.svg"
            alt="mastercard"
            height={32}
            width={45}
            className="ml-5"
          />
        </div>

        <Image
          src="/icons/lines.svg"
          alt="lines"
          height={190}
          width={316}
          className="absolute top-0 left-0"
        />
      </Link>

      {showBalance && <Copy title={account?.sharableId} />}
    </div>
  );
};

export default BankCard;
