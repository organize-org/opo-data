import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { Container } from "react-bootstrap";
import { useStaticQuery, graphql } from "gatsby";

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
      <h1>{data.site.siteMetadata.title}</h1>
      {children}
    </Container>
  );
}
