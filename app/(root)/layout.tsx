import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import React from "react";

const rootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // TODO: replace temp user data
  const loggedInUser = await getLoggedInUser();

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
