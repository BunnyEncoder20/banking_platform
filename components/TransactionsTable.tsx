import React from "react";

// UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// utils
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";

// constants
import { transactionCategoryStyles } from "@/constants";

// categoryBadge helper component
const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[
    category as keyof typeof transactionCategoryStyles
  ] || transactionCategoryStyles.default;

  return (
    <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
      <div className={cn("size-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  );
};

// current component ⚛️
const TransactionsTable = ({
  transactions,
}: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transactions</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: Transaction) => {
          const status = getTransactionStatus(new Date(t.date));
          const amount = formatAmount(t.amount);
          const isDebit = t.type === "debit" || amount[0] === "-";
          const isCredit = amount[0] !== "-";

          return (
            <TableRow
              key={t.id}
              className={`${
                isDebit || amount[0] === "-"
                  ? "bg-[#fffbfa]"
                  : "bg-[#f6fef9] !over:bg-none !border-b-DEFAULT"
              }`}
            >
              {/* Name */}
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name)}
                  </h1>
                </div>
              </TableCell>

              {/* Debit */}
              <TableCell
                className={`pl-2 pr-10 font-semibold ${
                  isDebit || amount[0] === "-"
                    ? "text-[#f04438]"
                    : "text-[#039855]"
                }`}
              >
                {isCredit ? `+${amount}` : amount}
              </TableCell>

              {/* status */}
              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>

              {/* date */}
              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.date)).dateTime}
              </TableCell>

              {/* channel */}
              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                {t.paymentChannel}
              </TableCell>

              {/* category */}
              <TableCell className="pl-2 pr-10 max-md:hidden">
                <CategoryBadge category={t.category} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
