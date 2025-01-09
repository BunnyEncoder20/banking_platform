"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// form utils
import { authFormSchema } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// form UI
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// components
import CustomFormField from "@/components/CustomFormField";
import PlaidLink from "@/components/PlaidLink";

// server actions
import { appwrite_signIn, appwrite_signUp } from "@/lib/actions/user.actions";

// current component ⚛️
const AuthForm = ({
  type,
}: {
  type: string;
}) => {
  // states & hooks
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Shad Form
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // handlers 🤙
  // console.log(`Type: ${type} | User: ${user}`);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting form...");
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const signUp_data = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };
        const newUser = await appwrite_signUp(signUp_data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await appwrite_signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          console.log("✅ User data fetched:", response);
          setUser(response);
          router.push("/");
        } else {
          throw new Error("❌ Did not get user data back from backend");
        }
      }

      // TODO: create plaid token
    } catch (error) {
      console.error("❌ There was a error in submitting AuthForm:\n", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        {/* logo */}
        <Link
          href="/"
          className="cursor-pointer flex items-center gap-1 px-4"
        >
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Log In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>

      {user
        ? (
          <div className="flex flex-col gap-4">
            <PlaidLink
              user={user}
              variant="primary"
            />
          </div>
        )
        : (
          <>
            <Form {...form}>
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    {/* first name */}
                    <CustomFormField
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="John"
                    />

                    {/* last name */}
                    <CustomFormField
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Doe"
                    />
                  </div>

                  {/* address */}
                  <CustomFormField
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter permanent address"
                  />

                  {/* City */}
                  <CustomFormField
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />

                  <div className="flex gap-4">
                    {/* TODO: try to make this into a dropdown menu for US states: shadcn select */}
                    {/* State */}
                    <CustomFormField
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="eg: Punjab"
                    />

                    {/* postal code */}
                    <CustomFormField
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="eg: 400005"
                    />
                  </div>

                  <div className="flex gap-4">
                    {/* dob */}
                    <CustomFormField
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />

                    {/* aadhar number */}
                    <CustomFormField
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="*** *** ***"
                    />
                  </div>
                </>
              )}

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* email */}
                <CustomFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />

                {/* password */}
                <CustomFormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />

                {/* Submit button */}
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="form-btn"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? (
                        <>
                          <Loader2
                            size={20}
                            className="animate-spin"
                          />{" "}
                          &nbsp; Loading...
                        </>
                      )
                      : type === "sign-in"
                      ? "Sign In"
                      : "Sign Up"}
                  </Button>
                </div>
              </form>
            </Form>

            <footer className="flex justify-center gap-1">
              <p className="text-14 font-normal text-gray-600">
                {type === "sign-in"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="form-link"
              >
                {type === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </footer>
          </>
        )}
    </section>
  );
};

export default AuthForm;
