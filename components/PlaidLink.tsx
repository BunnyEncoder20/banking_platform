import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// UI
import { Button } from "@/components/ui/button";

// Plaid
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";

// server action
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";

// current component ⚛️
const PlaidLink = ({
  user,
  variant,
}: PlaidLinkProps) => {
  // states and hooks
  const [token, setToken] = useState("");
  const router = useRouter();

  // set LinkToken on mount
  useEffect(() => {
    // TODO: make getLinkToken server action
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    // call the asyn function (cause we cannot directly make the useEffect func async)
    getLinkToken();
  }, [user]);

  // plaid handlers
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken: string) => {
      await exchangePublicToken({ publicToken, user });
      router.push("/");
    },
    [user],
  );

  // plaid config object
  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  // plaid link hook
  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary"
        ? (
          <Button
            onClick={() => open()}
            disabled={!ready}
            className="plaidlink-primary"
          >
            Connect Bank
          </Button>
        )
        : variant === "ghost"
        ? (
          <Button
            variant="ghost"
            className="plaidlink-ghost"
            onClick={() => open()}
          >
            <Image
              src="/icons/connect-bank.svg"
              alt="connect bank"
              height={24}
              width={24}
            />
            <p className=" hidden text-[16px] font-semibold text-black-2 xl:block">
              Connect Bank
            </p>
            Connect Bank
          </Button>
        )
        : (
          <Button
            className="plaidlink-default"
            onClick={() => open()}
          >
            <Image
              src="/icons/connect-bank.svg"
              alt="connect bank"
              height={24}
              width={24}
            />
            <p className="text-[16px] font-semibold text-black-2 max-xl:hidden">
              Connect Bank
            </p>
          </Button>
        )}
    </>
  );
};

export default PlaidLink;
