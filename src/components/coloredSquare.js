import React from "react";

import { tierColors } from "../util/tiers";

export default function ColoredSquare({
  tier,
  height = "25px",
  width = "30px",
}) {
  return (
    <div
      style={{
        background: tierColors[tier],
        height,
        width,
      }}
    ></div>
  );
}
