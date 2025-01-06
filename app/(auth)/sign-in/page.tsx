import React from "react";

// components
import AuthForm from "@/components/AuthForm";

// current page 📄
const signIn = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
};

export default signIn;
