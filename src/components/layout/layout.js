import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Breadcrumb, Container, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Social from "../../components/social/social";

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
      <Row>
        {crumbLabel ? (
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{crumbLabel}</Breadcrumb.Item>
          </Breadcrumb>
        ) : null}
        {social ? <Social /> : null}
      </Row>

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
    </Container>
  );
}
