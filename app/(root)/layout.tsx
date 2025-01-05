import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import React from "react";

const rootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // TODO: replace temp user data
  const loggedIn = {
    firstname: "Bunny",
    lastname: "Encoder",
  };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
};

export default rootLayout;
