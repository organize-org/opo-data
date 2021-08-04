import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Breadcrumb, Container, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

import * as styles from "./layout.module.css";

export default function Layout({ crumbLabel, children, sources }) {
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
        <Link to="/" className={styles.logoWithText}>
          <StaticImage
            src="../../images/logo.png"
            alt="logo"
            placeholder="none"
          />
          <div className={styles.logoText}>
            <h1>{site.siteMetadata.title}</h1>
            <h2>Performance Comparison</h2>
          </div>
        </Link>
        <Link to="/faqs" className={styles.faqLink}>
          <p>About Our Organ Donation System</p>
        </Link>
      </Row>
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
              {Object.values(sources)
                .map((source, index) => (
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
        <StaticImage
          src="../../images/logos/Bloomworks.png"
          alt="Bloomworks"
          height={35}
        />
        <StaticImage
          src="../../images/logos/Organize.png"
          alt="Organize"
          height={35}
        />
        <StaticImage src="../../images/logos/FAS.png" alt="FAS" height={35} />
      </Row>
    </Container>
  );
}
