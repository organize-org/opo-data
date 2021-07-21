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
          relativePath: { eq: "images/quotes/equity.png" }
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
          <h3>OPO Reform is and Urgent Equity Issue</h3>
          {size === "lg" && (
            <>
              <p>
                Patients of color are less likely to receive organ transplants
                than white patients because of inferior OPO service. We must
                drive reforms to hold OPOs accountable.
              </p>
              <p>
                See our report cataloguing peer-reviewed research on the
                inequitable service OPOs provide to different ethnic
                communities. As bipartisan, bicameral Congressional leaders have
                written, OPO reforms have “urgent implications for health
                equity”.
              </p>
            </>
          )}
          <Link to="/equity">
            We must drive reforms to hold OPOs accountable.
          </Link>
        </Col>
      </BgImage>
    </Row>
  );
}
