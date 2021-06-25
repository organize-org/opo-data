import React from "react";

import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Container, Row, Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

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
      <Row className="justify-content-center siteHeader">
        <Col>
          <StaticImage
            className="headerImg"
            src="../images/Frame.png"
            alt="logo"
          />
        </Col>
        <Col>
          <div className="header">{data.site.siteMetadata.title}</div>
          <div className="subHeader">Performance Comparison</div>
        </Col>
      </Row>
      {children}
    </Container>
  );
}
