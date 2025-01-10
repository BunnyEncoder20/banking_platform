"use server";

// appwrite client
import { createAdminClient, createSessionClient } from "@/lib/appwrite";

// Plaid & dwolla
import { plaidClient } from "@/lib/plaid";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

// utils
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import {
  decryptId,
  encryptId,
  errorHandler,
  extractCustomerIdFromUrl,
  parseStringify,
} from "@/lib/utils";

// env variables
const {
  APPWRITE_DATABASE_ID: DATABASE,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION,
} = process.env;

/* ----------------------- Server Actions ----------------------- */

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  console.log(`Getting user info for ${userId}...`);
  try {
    const { database } = await createAdminClient();

    console.log(`Querying user collection...`);
    const user = await database.listDocuments(DATABASE!, USER_COLLECTION!, [
      Query.equal("userId", [userId]),
    ]);

    console.log("✅ User info fetched successfully");
    return parseStringify(user.documents[0]);
  } catch (error) {
    errorHandler("There was a error in getUserInfo", error);
  }
};

export const appwrite_signIn = async ({ email, password }: signInProps) => {
  console.log(`Signing IN user with email: ${email}...`);
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const appwrite_signUp = async ({
  password, // we don't want to send the password to the db, hence extract it here, removing it from the userData object
  ...userData
}: SignUpParams) => {
  // destructure
  const { firstName, lastName, email } = userData;
  console.log(`Sign UP user ${firstName} ${lastName} with email ${email}...`);

  // TODO: make this entire function Atomic
  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    // make new account
    console.log("Creating new account...");
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    if (!newUserAccount)
      throw new Error("Error while creating appwrite user account.");
    console.log("✅ Appwrite user account created successfully");

    // make a dwolla customer
    console.log("Creating dwolla customer...");
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });
    if (!dwollaCustomerUrl)
      throw new Error("Error while creating dwolla customer.");
    console.log("✅ Dwolla customer created successfully");

    console.log("Extracting dwolla customerId...");
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    console.log("✅ Dwolla customerId extracted successfully");

    // making appwrite db user document
    console.log("Entering new user document in user collection...");
    const newUser = await database.createDocument(
      DATABASE!,
      USER_COLLECTION!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId: encryptId(dwollaCustomerId),
        dwollaCustomerUrl,
      }
    );
    if (!newUser) throw new Error("Error while entering new user document.");
    console.log("✅ New user document entered successfully");

    // make new session
    console.log("Creating new session...");
    const session = await account.createEmailPasswordSession(email, password);
    console.log("✅ Appwrite Session created successfully");

    // make new session cookie
    console.log("Creating new session cookie...");
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    console.log("✅ Session cookie created successfully");

    console.log("✅ User created process successfull");
    return parseStringify(newUser);
  } catch (error) {
    errorHandler("There was a error in appwrite_signUp", error);
  }
};

export async function getLoggedInUser() {
  console.log("Getting logged in user...");
  try {
    console.log(`checking for session cookie...`);
    const { account } = await createSessionClient();
    const result = await account.get();

    console.log(`✅ session data fetched successfully`);
    console.log(`Fetching user data...`);
    const user = await getUserInfo({ userId: result.$id });

    console.log("✅ User data fetched successfully:");
    return parseStringify(user);
  } catch (error) {
    errorHandler("There was a error in getLoggedInUser", error);
    return null;
  }
}

export const logoutUser = async () => {
  console.log("Log out request made...");
  try {
    const { account } = await createSessionClient();

    console.log("Deleting session cookie...");
    (await cookies()).delete("appwrite-session");

    console.log("Deleting current session...");
    await account.deleteSession("current");

    console.log("✅ User logged out successfully");
    return true;
  } catch (error) {
    errorHandler("There was a error in logoutAccount", error);
    return false;
  }
};

/* ----------------------- PLaid Server Actions ----------------------- */

export const createLinkToken = async (user: User) => {
  console.log(`Making a plaid link token for user ${user.$id}...`);
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth", "transactions"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    console.log("✅ Link token request successfully");

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    errorHandler("There was a error in createLinkToken", error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  // this action just makes a bank account doucment in the banks collection of appwrite (not an actual bank account)
  console.log("Initilizing creation of bank account...");
  try {
    const { database } = await createAdminClient();

    console.log("Sending bank data to bankend...");
    const bankAccount = await database.createDocument(
      DATABASE!,
      BANK_COLLECTION!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      }
    );

    console.log("✅ Bank account created successfully");
    return parseStringify(bankAccount);
  } catch (error) {
    errorHandler("There was a error in createBankAccount", error);
  }
};

// This function exchanges a public token for an access token and item ID from plaid
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  console.log("Initlizing exchanging of public token...");

  try {
    // Exchange public token for access token and item ID
    console.log("Exchanging short-lived public token for access token...");
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    console.log("✅ Access token and item ID fetched successfully");

    // Get account information from Plaid using the access token
    console.log("Fetching Plaid account information...");
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];
    console.log("✅ Plaid account information fetched successfully");

    // Create a processor token for Dwolla (payment processor) using the access token and account ID
    console.log("Creating processor token for Dwolla...");
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;
    console.log("✅ Dwolla Processor token created successfully");

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: decryptId(user.dwollaCustomerId),
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;
    console.log("✅ Funding source URL created successfully");

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    console.log("Creating bank account...");
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });
    console.log("✅ Bank account created successfully");

    // Revalidate the path to reflect the changes
    console.log("Revalidating path for fresh data...");
    revalidatePath("/");

    // Return a success message
    console.log("✅ Public token exchange completed successfully");
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    // Log any errors that occur during the process
    errorHandler("An error occurred while creating exchanging token:", error);
  }
};

/* ----------------------- Bank Server Actions ----------------------- */

export const getBank = async ({ documentId }: getBankProps) => {
  console.log(`Getting bank document with id: ${documentId}...`);
  try {
    console.log("Creating admin client...");
    const { database } = await createAdminClient();

    console.log(`Fetching bank document with id: ${documentId}...`);
    const bank = await database.listDocuments(DATABASE!, BANK_COLLECTION!, [
      Query.equal("$id", [documentId]),
    ]);

    console.log("✅ Bank document fetched successfully");
    return parseStringify(bank.documents[0]);
  } catch (error) {
    errorHandler("There was a error in getBank", error);
  }
};

export const getBanks = async ({ userDocumentId }: getBanksProps) => {
  console.log(`Getting banks for userId: ${userDocumentId}...`);
  try {
    console.log("Creating admin client...");
    const { database } = await createAdminClient();

    console.log("Fetching banks...");
    const banks = await database.listDocuments(DATABASE!, BANK_COLLECTION!, [
      Query.equal("userId", [userDocumentId]),
    ]);

    console.log("✅ Banks fetched successfully");
    return parseStringify(banks.documents);
  } catch (error) {
    errorHandler("There was a error in getBanks", error);
  }
};
