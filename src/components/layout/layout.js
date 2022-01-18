import React from "react";

import { Breadcrumb, Container, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Social from "../../components/social/social";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

import * as styles from "./layout.module.css";
import { Asterisk } from "react-bootstrap-icons";

export default function Layout({ crumbLabel, children, contentWithSources, social }) {
  // Filter sources to only include those with data provided 
  const sources = contentWithSources 
    ? Object.entries(contentWithSources).filter(([_, val]) => !!val?.source)
    : null; 
  
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
        <>
          <hr />
          <Row className={styles.sources}>
            <h2 className={styles.sectionHeader}> <Asterisk /> ADDITIONAL INFORMATION</h2>
            <ol>
              {sources.map(([key, val]) => (
                <li id={`sources-${key}`} key={`sources-${key}`}>
                  <ReactMarkdown>{val.source}</ReactMarkdown>
                </li>
              ))}
            </ol>
          </Row>
        </>
      ) : null}
      <Footer />
    </Container>
  );
}