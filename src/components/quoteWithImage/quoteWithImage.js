import React from "react";
import { Col } from "react-bootstrap";
import { getImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";
import useQuoteImages from "../../hooks/useQuoteImages";

import * as styles from "./quoteWithImage.module.css";

export default function QuoteWithImage({
  quote: { attribution, image, quote },
  side = "right",
}) {
  const [{ quoteImagesByPath }] = useQuoteImages();

  return (
    <BgImage
      className={`${styles.background} ${styles[side]}`}
      image={getImage(quoteImagesByPath[image])}
    >
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
  );
}
