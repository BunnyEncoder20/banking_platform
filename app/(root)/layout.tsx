import Image from "next/image";
import React from "react";
import { redirect } from "next/navigation";

// components
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";

// server action
import { getLoggedInUser } from "@/lib/actions/user.actions";

// layout 🧱
const rootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // fetch user data
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) {
    console.log("❌ user not authenticated, redirecting...");
    redirect("/sign-in");
  }
  console.log("Fetched LoggedIn User");

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedInUser} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedInUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
};

export default rootLayout;
