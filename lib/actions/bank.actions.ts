"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getBanks, getBank } from "./user.actions";
import { getTransactionsByBankId } from "./transaction.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userDocumentId }: getAccountsProps) => {
  console.log(
    `Getting all bank accounts for userDocumentId: ${userDocumentId}...`
  );
  try {
    // get banks from db
    console.log("Fetching banks...");
    const banks = await getBanks({ userDocumentId });
    console.log("✅ Banks fetched successfully");

    console.log("Extracting data...");
    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };

        return account;
      })
    );

    console.log("✅ All accounts fetched successfully");
    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce(
      (total: number, account: Account) => {
        return total + account.currentBalance;
      },
      0
    );

    console.log("✅ Total banks and current balanace calculated successfully", {
      data: accounts,
      totalBanks,
      totalCurrentBalance,
    });
    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  console.log(`Getting account with documentId: ${appwriteItemId}...`);
  try {
    // get bank from db
    console.log("Fetching bank...");
    const bank = await getBank({ documentId: appwriteItemId });
    if (bank) console.log("✅ Bank fetched successfully");

    // get account info from plaid
    console.log(
      `Fetching account from plaid for accessToken ${bank.accessToken}...`
    );
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];
    if (accountData)
      console.log("✅ Plaid account fetched successfully", accountData);

    // get transfer transactions from appwrite
    // console.log(
    //   `Fetching transfer transactions data for bankId: ${bank.$id}...`
    // );
    // const transferTransactionsData = await getTransactionsByBankId({
    //   bankId: bank.$id,
    // });
    // if (transferTransactionsData)
    //   console.log(
    //     `✅ Transfer transactions data fetched successfully: ${transferTransactionsData}`
    //   );

    // console.log(`Extracting transfer transactions from data...`);
    // const transferTransactions = transferTransactionsData.documents.map(
    //   (transferData: Transaction) => ({
    //     id: transferData.$id,
    //     name: transferData.name!,
    //     amount: transferData.amount!,
    //     date: transferData.$createdAt,
    //     paymentChannel: transferData.channel,
    //     category: transferData.category,
    //     type: transferData.senderBankId === bank.$id ? "debit" : "credit",
    //   })
    // );
    // if (transferTransactions)
    //   console.log(
    //     "✅ Transfer transactions extracted successfully",
    //     transferTransactions
    //   );

    // get institution info from plaid
    console.log("Fetching Institute info from plaid...");
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });
    if (institution) console.log("✅ Institution fetched successfully");

    // get transactions
    console.log("Fetching transactions...");
    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });
    if (transactions)
      console.log("✅ Transactions fetched successfully:", transactions);

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    console.log("Sorting transactions...");
    const allTransactions = [
      ...transactions,
      // ...transferTransactions
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log("✅ All getAccount completed successfully");
    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  console.log(`Fetching transactions for accessToken: ${accessToken}...`);
  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    if (transactions)
      console.log("✅ Transactions fetched successfully", transactions);
    return parseStringify(transactions);
  } catch (error) {
    console.error(
      "An error occurred while getting the accounts:",
      error.response?.data
    );
  }
};
