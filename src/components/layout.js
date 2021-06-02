import React from "react";
import { Container, Row } from "react-bootstrap";
import { useStaticQuery, graphql } from "gatsby";

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
      <Row className="justify-content-center">
        <h1>{data.site.siteMetadata.title}</h1>
      </Row>
      {children}
    </Container>
  );
}
