import React from "react";
import { Row, Col } from "react-bootstrap";

import { tierColors } from "../util/tiers";

export default function Tier({ className, tier }) {
  return (
    <Row className={className}>
      <Col className="flex-grow-0 my-auto">
        <div
          style={{
            background: tierColors[tier],
            height: "25px",
            width: "25px",
          }}
        ></div>
      </Col>
      <Col className="my-auto px-0">{tier.split(" ")[1]}</Col>
    </Row>
  );
}
