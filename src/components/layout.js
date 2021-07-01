import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Container, Row, Col } from "react-bootstrap";

export default function Layout({ children }) {
  const data = useStaticQuery(
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
      <Row className="header">
        <Col md="auto">
          <StaticImage
            className="headerImg  "
            src="../images/logo.png"
            alt="logo"
          />
        </Col>
        <Col md="auto">
          <h1>{data.site.siteMetadata.title}</h1>
          <h2>Performance Comparison</h2>
        </Col>
      </Row>
      {children}
      <Row className="footer">
        <Col xs={6}>
          <p>
            Research supported by Arnold Ventures and Schmidt Futures in
            partnership with Organize and the Federation of American Scientists.
          </p>
        </Col>
        <Col>
          <StaticImage
            src="../images/logos/av.png"
            alt="Arnold Ventures"
            height="35"
          />
        </Col>
        <Col>
          <StaticImage
            src="../images/logos/schmidt.png"
            alt="Schmidt Futures"
            height="35"
          />
        </Col>
        <Col>
          <StaticImage
            src="../images/logos/bloomworks.png"
            alt="Bloomworks"
            height="35"
          />
        </Col>
        <Col>
          <StaticImage
            src="../images/logos/organize.png"
            alt="Organize"
            height="35"
          />
        </Col>
        <Col>
          <StaticImage src="../images/logos/fas.png" alt="FAS" height="35" />
        </Col>
      </Row>
    </Container>
  );
}
