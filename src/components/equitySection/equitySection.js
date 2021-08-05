import React from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Link } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";
import useQuoteImages from "../../hooks/useQuoteImages";

import indexContent from "../../pages/index.content.yml";
import stateContent from "../../pages/state/[state].content.yml";

import useWindowDimensions from "../../hooks/useWindowDimensions";

import * as styles from "./equitySection.module.css";

export default function EquitySection({ page = "main" }) {
  const [{ quoteImagesByPath }] = useQuoteImages();

  const {
    equityEmbed: { image, mobileImage, description, heading, link },
  } = page === "main" ? indexContent : stateContent;

  const width = useWindowDimensions().width;

  return (
    <>
      {page === "state" && (
        <Row className={styles.stateHeader}>
          <h3>{heading}</h3>
        </Row>
      )}
      <Row className={styles[page]}>
        <Col>
          <BgImage
            className={styles.background}
            image={getImage(
              quoteImagesByPath[
                page !== "main"
                  ? image.slice(3, image.length)
                  : width < 800
                  ? mobileImage
                  : image
              ]
            )}
          >
            <div className={styles.copy}>
              {page === "main" && <h3>{heading}</h3>}
              <ReactMarkdown>{description}</ReactMarkdown>
              <Link to="/equity">{link}</Link>
            </div>
          </BgImage>
        </Col>
      </Row>
    </>
  );
}
