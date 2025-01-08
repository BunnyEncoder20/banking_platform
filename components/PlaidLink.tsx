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
        ? <Button>Connect Bank</Button>
        : <Button>Connect Bank</Button>}
    </>
  );
};

export default PlaidLink;
