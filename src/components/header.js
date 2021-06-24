import React from "react";

import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Row, Col } from "react-bootstrap";

export default function Header() {
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
    <div>
      <Row>
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
    </div>
  );
}
