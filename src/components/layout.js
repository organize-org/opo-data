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
    </Container>
  );
}
