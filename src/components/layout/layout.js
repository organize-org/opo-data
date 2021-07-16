import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Container, Row, Col } from "react-bootstrap";

import * as styles from "./layout.module.css";

export default function Layout({ children }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return (
    <Container fluid>
      <Row className={styles.header}>
        <StaticImage
          className={styles.headerImg}
          src="../../images/logo.png"
          alt="logo"
        />
        <Link to="/">
          <h1>{site.siteMetadata.title}</h1>
          <h2>Performance Comparison</h2>
        </Link>
        <a
          href="https://58425eca-649a-42d4-b265-d1e1743b6c48.filesusr.com/ugd/581bc3_4344f40b3ba74ef4a7845cc1d4798120.pdf"
          target="_blank"
          rel="noreferrer"
        >
          <p>About our Organ Donation System</p>
        </a>
      </Row>
      {children}
      <Row className={styles.footer}>
        <Col xs={6}>
          <p>
            Research supported by Arnold Ventures and Schmidt Futures in
            partnership with Organize and the Federation of American Scientists.
          </p>
        </Col>
        <Col>
          <StaticImage
            src="../../images/logos/av.png"
            alt="Arnold Ventures"
            height={35}
          />
        </Col>
        <Col>
          <StaticImage
            src="../../images/logos/schmidt.png"
            alt="Schmidt Futures"
            height={35}
          />
        </Col>
        <Col>
          <StaticImage
            src="../../images/logos/bloomworks.png"
            alt="Bloomworks"
            height={35}
          />
        </Col>
        <Col>
          <StaticImage
            src="../../images/logos/organize.png"
            alt="Organize"
            height={35}
          />
        </Col>
        <Col>
          <StaticImage src="../../images/logos/fas.png" alt="FAS" height={35} />
        </Col>
      </Row>
    </Container>
  );
}
