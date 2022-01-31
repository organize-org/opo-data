import React from "react";

import { Breadcrumb, Container, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Social from "../../components/social/social";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

import * as styles from "./layout.module.css";
import Additional from '../../images/icons/additional.svg';

export default function Layout({ crumbLabel, children, contentWithSources, social, className }) {
  // Compose sources list from all provided content,
  // taking all objects with `source` defined.
  // Then sort based on numerical footnote included in the content title
  const footnoteRegex = /\[(\d+)\]\(#sources/;
  const sources = (contentWithSources ?? [])
    .reduce((withSources, contentObj) => {
      return [
        ...withSources,
        ...Object.values(contentObj).filter(({ source }) => !!source)
      ]
    }, [])
    .sort((a, b) => {
      const aNum = parseInt(a?.title?.match(footnoteRegex)?.[1])
      const bNum = parseInt(b?.title?.match(footnoteRegex)?.[1])

      if (aNum == undefined 
        || bNum == undefined 
        || aNum === bNum) return 0;
      return aNum - bNum;
    })

  return (
    <Container fluid className={className}>
      <Navbar />
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
        <div className={styles.sources}>
          <hr />
          <Row>
            <h2 className={styles.sectionHeader}> <Additional /> ADDITIONAL INFORMATION</h2>
            <ol>
              {sources.map(({ source }, idx) => (
                <li id={`sources-${idx + 1}`} key={`sources-${idx + 1}`}>
                  <ReactMarkdown>{source}</ReactMarkdown>
                </li>
              ))}
            </ol>
          </Row>
        </div>
      ) : null}
      <Footer />
    </Container>
  );
}