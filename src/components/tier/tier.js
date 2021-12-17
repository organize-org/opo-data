import React from "react";
import { Row, Col } from "react-bootstrap";

import { tierColors } from "../../utils/utils";

export default function Tier({ className, tier }) {
  return (
    <Row className={className}>
      <Col className="flex-grow-0 my-auto">
        <div
          style={{
            background: tierColors[tier],
            height: `20px`,
            width: `20px`,
            borderRadius: `2rem`,
          }}
        ></div>
      </Col>
      <Col className="my-auto px-0">{tier.split(" ")[1]}</Col>
    </Row>
  );
}
