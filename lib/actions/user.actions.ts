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
import { addFundingSource } from "./dwolla.actions";

// utils
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { encryptId, errorHandler, parseStringify } from "@/lib/utils";

/* ----------------------- Server Actions ----------------------- */

export const appwrite_signIn = async ({ email, password }: signInProps) => {
  console.log(`Signing IN user with email: ${email}...`);
  try {
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);

    console.log("✅ User signed in successfully");
    return parseStringify(response);
  } catch (error) {
    errorHandler("There was a error in appwrite_signIn", error);
  }
};

export const appwrite_signUp = async (userData: SignUpParams) => {
  // destructure
  const { firstName, lastName, email, password } = userData;
  console.log(`Sign UP user ${firstName} ${lastName} with email ${email}...`);

  try {
    const { account } = await createAdminClient();

    // make new account
    console.log("Creating new account...");
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    // make new session
    console.log("Creating new session...");
    const session = await account.createEmailPasswordSession(email, password);

    // make new session cookie
    console.log("Creating new session cookie...");
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    console.log("✅ User created successfully");
    return parseStringify(newUserAccount);
  } catch (error) {
    errorHandler("There was a error in appwrite_signIn", error);
  }
};

export async function getLoggedInUser() {
  console.log("Getting logged in user...");
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    console.log("✅ User data fetched successfully");
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
  console.log(`Making a plaid link token for user ${user.name}...`);
  try {
    console.log("Constructing token params");
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    console.log("Creating link token...");
    const response = await plaidClient.linkTokenCreate(tokenParams);

    console.log("✅ Link token created successfully");
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    errorHandler("There was a error in createLinkToken", error);
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
    console.log("Creating funding source URL...");
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;
    console.log("✅ Funding source URL created successfully");

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    console.log("Creating bank account...");

    // TODO: make createBankAccount server action
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
