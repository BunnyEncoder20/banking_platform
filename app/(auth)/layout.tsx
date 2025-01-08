import Image from "next/image";
import React from "react";

const authLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}

      {/* image */}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="auth image"
            height={500}
            width={500}
          />
        </div>
      </div>
    </main>
  );
};

export default authLayout;
