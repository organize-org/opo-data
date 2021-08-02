import React from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Link } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";
import useQuoteImages from "../../hooks/useQuoteImages";

import indexContent from "../../pages/index.content.yml";
import stateContent from "../../pages/state/[state].content.yml";

import * as styles from "./equitySection.module.css";

export default function EquitySection({ page = "main" }) {
  const [{ quoteImagesByPath }] = useQuoteImages();

  const {
    equityEmbed: { image, description, heading, link },
  } = page === "main" ? indexContent : stateContent;

  return (
    <Row className={styles[page]}>
      <Col>
        <BgImage
          className={styles.background}
          image={getImage(
            quoteImagesByPath[
              page !== "main" ? image.slice(3, image.length) : image
            ]
          )}
        >
          <div className={styles.copy}>
            <h3>{heading}</h3>
            {page === "main" && <ReactMarkdown>{description}</ReactMarkdown>}
            <Link to="/equity">{link}</Link>
          </div>
        </BgImage>
      </Col>
    </Row>
  );
}
