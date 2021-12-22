import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Breadcrumb, Container, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Social from "../../components/social/social";

import Navbar from "../navbar/navbar";

import * as styles from "./layout.module.css";

export default function Layout({ crumbLabel, children, sources, social }) {
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
      <Navbar site={site.siteMetadata.title} />
      {crumbLabel ? (
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>{crumbLabel}</Breadcrumb.Item>
        </Breadcrumb>
      ) : null}
      {children}
      {sources?.length ? (
        <Row className={styles.sources}>
          <h3>Sources</h3>
          <ol>
            {Object.values(sources).map((source, index) => (
              <li id={`sources-${index + 1}`} key={`sources-${index}`}>
                <ReactMarkdown>{source}</ReactMarkdown>
              </li>
            ))}
          </ol>
        </Row>
      ) : null}
      <Row className={styles.footer}>
        <p>
          Research supported by Arnold Ventures and Schmidt Futures in
          partnership with Organize and the Federation of American Scientists.
        </p>
        <StaticImage
          src="../../images/logos/Arnold Ventures.png"
          alt="Arnold Ventures"
          height={35}
        />
        <StaticImage
          src="../../images/logos/Schmidt Futures.png"
          alt="Schmidt Futures"
          height={35}
        />
        <StaticImage src="../../images/logos/fas.png" alt="FAS" height={35} />
        <StaticImage
          src="../../images/logos/bloomworks.png"
          alt="Bloomworks"
          height={35}
        />
        <StaticImage
          src="../../images/logos/organize.png"
          alt="Organize"
          height={30}
        />
      </Row>
    </Container>
  );
}
