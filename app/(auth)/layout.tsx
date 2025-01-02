import React from "react";

const authLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main>
      {children}
    </main>
  );
};

export default authLayout;
