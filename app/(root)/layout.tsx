import Sidebar from "@/components/Sidebar";
import React from "react";

const rootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main>
      <Sidebar />
      {children}
    </main>
  );
};

export default rootLayout;
