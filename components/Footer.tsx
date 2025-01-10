import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// sevrer action
import { logoutUser } from "@/lib/actions/user.actions";

// current component ⚛️
const Footer = ({ user, type = "desktop" }: FooterProps) => {
  // states and hooks
  const router = useRouter();

  // handlers
  const handleLogout = async () => {
    router.push("/sign-in");
    await logoutUser();
  };

  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">
          {user?.firstName[0]}
        </p>
      </div>

      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate  text-gray-700 font-semibold">
          {user?.firstName}
        </h1>

        <p className="text-14 truncate font-normal text-gray-600">
          {user.email}
        </p>
      </div>

      <div className="footer_image" onClick={handleLogout}>
        <Image
          src="icons/logout.svg"
          alt="logout btn"
          fill
        />
      </div>
    </footer>
  );
};

export default Footer;
