"use server";

// appwrite client
import { createSessionClient } from "../appwrite";

// error handler
import { errorHander } from "@/lib/utils";

/* ----------------------- Server Actions ----------------------- */
export const appwrite_signIn = async (email: string, password: string) => {
  try {
    // use to make Mutations / Databases / fetch
  } catch (error) {
    errorHander("There was a error in appwrite_signIn", error);
  }
};

export const appwrite_signUp = async (userData: SignUpParams) => {
  try {
    // use to make Mutations / Databases / fetch
  } catch (error) {
    errorHander("There was a error in appwrite_signIn", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    errorHander("There was a error in getLoggedInUser", error);
    return null;
  }
}
