"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
import CustomFormField from "./CustomFormField";

// current component ⚛️
const AuthForm = ({
  type,
}: {
  type: string;
}) => {
  // states
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form...");
    setIsLoading(true);

    try {
      console.log(values);
    } catch (error) {
      console.error("❌ There was a error in submitting AuthForm:\n", error);
    } finally {
      setIsLoading(false);
    }
  }

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
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
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
            {/* TODO: PlaidLink */}
          </div>
        )
        : (
          <>
            <Form {...form}>
              {type === "sign-up" && (
                <>
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
                    name="firstName"
                    label="First Name"
                    placeholder="Doe"
                  />

                  {/* address */}
                  <CustomFormField
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Enter permanent address"
                  />

                  {/* address */}
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
                    name="aadharCardNumber"
                    label="Aadhar Card Number"
                    placeholder="eg: 1234 5678 9012"
                  />
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
