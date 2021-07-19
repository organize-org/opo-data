import React from "react";
import { Col, Row } from "react-bootstrap";
import { BgImage } from "gbimage-bridge";

import * as styles from "./quoteWithImage.module.css";

export default function QuoteWithImage({
  image,
  quote: { attribution, quote },
  side = "right",
}) {
  return (
    <Row>
      <BgImage className={`${styles.background} ${styles[side]}`} image={image}>
        <Col
          className={styles.quote}
          md={{ span: 5, offset: side === "right" ? 6 : 1 }}
        >
          <figure>
            <blockquote>{quote}</blockquote>
          </figure>
          <figcaption>
            &mdash; <cite>{attribution}</cite>
          </figcaption>
        </Col>
      </BgImage>
    </Row>
  );
}
