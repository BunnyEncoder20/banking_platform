import React from "react";

// UI
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// utils
import {
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";

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
          const isDebit = t.type === "debit";
          return (
            <TableRow key={t.id}>
              {/* Name */}
              <TableCell>
                <div>
                  <h1>
                    {removeSpecialCharacters(t.name)}
                  </h1>
                </div>
              </TableCell>

              {/* Debit */}
              <TableCell>
                {isDebit}
                {isDebit ? `-${amount}` : `${amount}`}
              </TableCell>

              {/* status */}
              <TableCell>
                {status}
              </TableCell>

              {/* date */}
              <TableCell>
                {formatDateTime(new Date(t.date)).dateTime}
              </TableCell>

              {/* channel */}
              <TableCell>
                {t.paymentChannel}
              </TableCell>

              {/* category */}
              <TableCell>
                {t.category}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
