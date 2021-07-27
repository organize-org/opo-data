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

export default function EquitySection({ location, size = "lg" }) {
  const [{ quoteImagesByPath }] = useQuoteImages();

  const {
    equityEmbed: { image, description, heading, link },
  } = location.pathname === "/" ? indexContent : stateContent;

  return (
    <Row className={styles[size]}>
      <BgImage
        className={styles.background}
        image={getImage(quoteImagesByPath[location.pathname.includes("state") ? image.slice(3, image.length) : image])}
      >
        <Col
          className={styles.copy}
          md={size === "lg" ? { span: 6, offset: 5 } : null}
        >
          <h3>{heading}</h3>
          {size === "lg" && (
            <>
              <ReactMarkdown>{description}</ReactMarkdown>
            </>
          )}
          <Link to="/equity">{link}</Link>
        </Col>
      </BgImage>
    </Row>
  );
}
