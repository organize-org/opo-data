import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useStaticQuery, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";

import * as styles from "./equitySection.module.css";

export default function EquitySection({ size = "lg" }) {
  const { equitySectionImg } = useStaticQuery(
    graphql`
      query {
        equitySectionImg: file(
          relativePath: { eq: "images/quotes/equitySection.png" }
        ) {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    `
  );

  return (
    <Row className={styles[size]}>
      <BgImage
        className={styles.background}
        image={getImage(equitySectionImg.childImageSharp)}
      >
        <Col
          className={styles.copy}
          md={size === "lg" ? { span: 6, offset: 5 } : null}
        >
          <h3>
            Patients of color are less likely to receive organ transplants then
            white patients
          </h3>
          {size === "lg" && (
            <h4>To achieve health care equity, we must reform the system</h4>
          )}
          {size === "lg" && (
            <p>
              In order to address the problem, people need to know there is a
              problem. OPOs are failing people of color, and they need to be
              held accountable.
            </p>
          )}
          <Link to="/equity">
            Read are our findings on inequity in the organ donation process.
          </Link>
        </Col>
      </BgImage>
    </Row>
  );
}
