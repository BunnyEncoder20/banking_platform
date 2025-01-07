"use server";

// appwrite client
import { createAdminClient, createSessionClient } from "@/lib/appwrite";

// utils
import { cookies } from "next/headers";
import { ID } from "node-appwrite";

// error handler
import { errorHander, parseStringify } from "@/lib/utils";

/* ----------------------- Server Actions ----------------------- */
export const appwrite_signIn = async (email: string, password: string) => {
  try {
    // use to make Mutations / Databases / fetch
  } catch (error) {
    errorHander("There was a error in appwrite_signIn", error);
  }
};

export const appwrite_signUp = async (userData: SignUpParams) => {
  // destructure
  const { firstName, lastName, email, password } = userData;
  console.log(`Trying to sign up user ${firstName} ${lastName}...`);

  try {
    const { account } = await createAdminClient();

    // make new account
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    // make new session
    const session = await account.createEmailPasswordSession(email, password);

    // make new session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    errorHander("There was a error in appwrite_signIn", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    errorHander("There was a error in getLoggedInUser", error);
    return null;
  }
}
