"use server";

// appwrite client
import { createAdminClient, createSessionClient } from "@/lib/appwrite";

// utils
import { cookies } from "next/headers";
import { ID } from "node-appwrite";

// error handler
import { errorHandler, parseStringify } from "@/lib/utils";

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
