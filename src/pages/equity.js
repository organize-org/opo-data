import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Tweet } from "react-twitter-widgets";
import { graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/layout/layout";
import Social from "../components/social/social";
import QuoteWithImage from "../components/quoteWithImage/quoteWithImage";

import * as styles from "./equity.module.css";
import content from "./equity.content.yml";

const stepColors = ["yellow", "lightRed", "darkRed"];

const SmallQuote = ({ attribution, quote }) => (
  <div className={styles.smallQuote}>
    <figure className="red">
      <blockquote>"{quote}"</blockquote>
    </figure>
    <figcaption>
      &mdash; <cite>{attribution}</cite>
    </figcaption>
  </div>
);

export default function Equity({ data: { bottomImage, topImage } }) {
  const {
    bottomQuote,
    embedded,
    funnel,
    smallQuotes,
    tables,
    topQuote,
    tweet,
    sources,
  } = content;

  return (
    <Layout
      crumbLabel="Inequities in Organ Procurement Across the Nation"
      sources={sources}
    >
      <Row className={styles.topBar}>
        <Col md="8">
          <h2>Inequities in Organ Procurement Across the Nation</h2>
        </Col>
        <Social />
      </Row>
      <QuoteWithImage image={getImage(topImage)} quote={topQuote} side="left" />
      <Row className={styles.main}>
        <h3>{embedded.heading}</h3>
        <Col md="7">
          <Row>
            <ReactMarkdown>{embedded.description}</ReactMarkdown>
          </Row>
          <Row className={styles.tables}>
            <Col>
              <h4>
                <ReactMarkdown>{tables.table1Heading}</ReactMarkdown>
              </h4>
              <Table striped>
                <thead>
                  <tr>
                    <th scope="col">Hispanic Americans</th>
                    <th scope="col">Black Americans</th>
                    <th scope="col">Native Americans</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="red">
                    <td>1.5</td>
                    <td>3x</td>
                    <td>4x</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <h4>
                <ReactMarkdown>{tables.table2Heading}</ReactMarkdown>
              </h4>
              <Table striped>
                <thead>
                  <tr>
                    <th scope="col">
                      Asian
                      <br /> American
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="red">
                    <td>4x</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className={styles.steps}>
            <h3>{funnel.heading}</h3>
            {funnel.steps.map(({ description, heading }, i) => (
              <Row key={`step-${i}`}>
                <Col md="1" className={styles.stepContainer}>
                  <div className={`${styles.step} ${styles[stepColors[i]]}`}>
                    <span>{i + 1}</span>
                  </div>
                </Col>
                <Col>
                  <h4>{heading}</h4>
                  <ReactMarkdown>{description}</ReactMarkdown>
                </Col>
              </Row>
            ))}
          </Row>
        </Col>
        <Col className={styles.quotes}>
          <h4>Voices for organ donation reform</h4>
          {smallQuotes.map(({ attribution, quote }, i) => (
            <SmallQuote
              key={`smallquote-${i}`}
              attribution={attribution}
              quote={quote}
            />
          ))}
          <Tweet tweetId={tweet} />
        </Col>
      </Row>
      <Row className={styles.quoteWithImage}>
        <QuoteWithImage
          image={getImage(bottomImage)}
          quote={bottomQuote}
          side="left"
        />
      </Row>
    </Layout>
  );
}

export const query = graphql`
  query {
    bottomImage: file(relativePath: { eq: "images/quotes/equityPage.png" }) {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
      }
    }
    topImage: file(relativePath: { eq: "images/quotes/equity.png" }) {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
      }
    }
  }
`;
