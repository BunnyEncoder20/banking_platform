"use client";

import Image from "next/image";
import Link from "next/link";

// constants
import { sidebarLinks } from "@/constants";

// utils
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// components
import Footer from "@/components/Footer";
import PlaidLink from "@/components/PlaidLink";

// current component ⚛️
const Sidebar = ({ user }: SiderbarProps) => {
  // path
  const pathname = usePathname();
  return (
    <section className="sidebar z-10">
      <nav className="flex flex-col gap-4">
        {/* logo */}
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>

        {/* nav links */}
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route ||
            pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
            >
              {/* icon */}
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>

              {/* text */}
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })}

        <PlaidLink user={user} />
      </nav>

      {/* TODO: Footer */}
      <Footer user={user} />
    </section>
  );
};

export default Sidebar;
