import React from "react";

import { Breadcrumb, Container, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Social from "../../components/social/social";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

import * as styles from "./layout.module.css";
import Additional from '../../images/icons/additional.svg';

export default function Layout({ crumbLabel, children, contentWithSources, social, className }) {
  // Compose sources object from all provided content,
  // taking only those items with `source` defined
  const sourcesObj = (contentWithSources ?? {}).reduce((withSources, contentObj) => {
    Object.entries(contentObj).forEach(([key, val]) => {
      if(!withSources[key] && val.source) {
        withSources[key] = val
      }
    })  
    return withSources;
  }, {})

  // sort based on the numerical footnote included in the content title
  const footnoteRegex = /\[(\d+)\]\(#sources/;
  const sources = Object.entries(sourcesObj)
    .sort(([_aKey, aVal], [_bKey, bVal]) => {
      const aNum = parseInt(aVal?.title?.match(footnoteRegex)?.[1])
      const bNum = parseInt(bVal?.title?.match(footnoteRegex)?.[1])

      if (aNum == undefined 
        || bNum == undefined 
        || aNum === bNum) return 0;
      return aNum - bNum;
    })

  return (
    <Container fluid className={className}>
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
            <h2 className={styles.sectionHeader}> <Additional /> ADDITIONAL INFORMATION</h2>
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