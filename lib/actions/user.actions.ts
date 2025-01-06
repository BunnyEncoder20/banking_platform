"use server";

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
