"use client";

import React from "react";

// utils
import CountUp from "react-countup";

const AnimatedCounter = ({
  amount,
}: {
  amount: number;
}) => {
  return (
    <div className="w-full">
      <CountUp
        decimal="."
        decimals={2}
        prefix="₹ "
        end={amount}
      />
    </div>
  );
};

export default AnimatedCounter;
