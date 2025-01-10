"use server";

// appwrite
import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";

// utils
import { parseStringify } from "../utils";

// envs
const {
  APPWRITE_DATABASE_ID: DATABASE,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION,
} = process.env;

/* ----------------------- Transaction Server Actions ----------------------- */

export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
  console.log(
    `Entering Transaction from ${transaction.senderId} to ${transaction.receiverId}...`
  );
  try {
    const { database } = await createAdminClient();

    console.log("sending data to transaction collection...");
    const newTransaction = await database.createDocument(
      DATABASE!,
      TRANSACTION_COLLECTION!,
      ID.unique(),
      {
        channel: "online",
        category: "Transfer",
        ...transaction,
      }
    );

    if (newTransaction)
      console.log("✅ Transaction document created successfully");

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  console.log(`Getting transactions for bankId: ${bankId}...`);
  try {
    const { database } = await createAdminClient();

    console.log("Querying sent transactions...");
    const senderTransactions = await database.listDocuments(
      DATABASE!,
      TRANSACTION_COLLECTION!,
      [Query.equal("senderBankId", bankId)]
    );
    console.log("✅ fetched sent transactions");

    console.log("Querying received transactions...");
    const receiverTransactions = await database.listDocuments(
      DATABASE!,
      TRANSACTION_COLLECTION!,
      [Query.equal("receiverBankId", bankId)]
    );
    console.log("✅ fetched received transactions");

    console.log("Compiling transactions...");
    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [
        ...senderTransactions.documents,
        ...receiverTransactions.documents,
      ],
    };

    console.log("✅ Appwrite Transactions fetched successfully");
    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
};
