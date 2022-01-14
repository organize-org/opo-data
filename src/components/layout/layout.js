import React from "react";

import { Breadcrumb, Container, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Social from "../../components/social/social";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

import * as styles from "./layout.module.css";

export default function Layout({ crumbLabel, children, sources, social }) {
  return (
    <Container fluid>
      <Navbar />
      {crumbLabel ? (
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>{crumbLabel}</Breadcrumb.Item>
        </Breadcrumb>
      ) : null}
      {social ? <Social /> : null}

      {children}
      {sources?.length ? (
        <Row className={styles.sources}>
          <h2>ADDITIONAL INFORMATION</h2>
          <ol>
            {Object.values(sources).map((source, index) => (
              <li id={`sources-${index + 1}`} key={`sources-${index}`}>
                <ReactMarkdown>{source}</ReactMarkdown>
              </li>
            ))}
          </ol>
        </Row>
      ) : null}
      <Footer />
    </Container>
  );
}