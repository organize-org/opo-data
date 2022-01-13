import React from "react";
import { Row, Col } from "react-bootstrap";

import { donorMapColors } from "../../utils/utils";

export default function DonorTier({ className, tier, altText = null }) {
  return (
    <Row className={className}>
      <Col className="flex-grow-0 my-auto">
        <div
          style={{
            background: donorMapColors[tier],
            height: `20px`,
            width: `20px`,
            borderRadius: `2rem`,
          }}
        ></div>
      </Col>
      <Col className="my-auto px-0">{altText ? altText : tier}</Col>
    </Row>
  );
}
