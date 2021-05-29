import React from "react";
import { Container } from "react-bootstrap";
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
    <Container fluid className="text-center">
      <h1>{data.site.siteMetadata.title}</h1>
      {children}
    </Container>
  );
}
