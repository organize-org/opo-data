import React from "react";
import { graphql } from "gatsby";
import { Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import EquitySection from "../components/equitySection/equitySection";
import Layout from "../components/layout/layout";
import Map from "../components/map/map";
import Social from "../components/social/social";
import QuoteWithImage from "../components/quoteWithImage/quoteWithImage";
import SelectState from "../components/selectState/selectState";

import * as styles from "./index.module.css";
import content from "./index.content.yml";

export default function Dashboard({ data: { articleImages, quoteImage } }) {
  const { articles, stats, quote, video, sources } = content;

  const articleImgsByPath = articleImages?.edges?.reduce(
    (imgMap, { node }) => ({
      ...imgMap,
      [`../${node.relativePath}`]: node,
    }),
    {}
  );

  return (
    <Layout sources={sources}>
      <Row className={styles.topBar}>
        <Col>
          <SelectState label="View state data" />
        </Col>
        <Social />
      </Row>
      <Map interactive={true} legend={true} zoomControl={true} />
      <Row className={styles.statsSection}>
        {Object.values(stats).map(({ title, value }) => (
          <Col className="mx-5" key={title}>
            <Row className="h-50">
              <h3>
                <ReactMarkdown>{title}</ReactMarkdown>
              </h3>
            </Row>
            <Row className="justify-content-center">
              <ReactMarkdown className={styles.statsValues}>
                {value}
              </ReactMarkdown>
            </Row>
          </Col>
        ))}
      </Row>
      <Row>
        <QuoteWithImage quote={quote} />
      </Row>
      <EquitySection />
      <Row className={styles.videoSection}>
        <Col>
          <h3>{video.title}</h3>
          <ReactMarkdown>{video.description}</ReactMarkdown>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtube}`}
            target="_blank"
            rel="noreferrer"
          >
            <h4>
              See the full video
              <ArrowRight className={styles.rightArrow} />
            </h4>
          </a>
        </Col>
        <Col>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${video.youtube}`}
            width="100%"
          />
        </Col>
      </Row>
      <Row className={styles.articlesSection}>
        {articles.map(({ description, image, link, source, title }) => (
          <Col md={3} key={title}>
            <GatsbyImage
              image={getImage(articleImgsByPath[image])}
              alt={title}
            />
            <h3>{title}</h3>
            <ReactMarkdown>{description}</ReactMarkdown>
            <a href={link} target="_blank" rel="noreferrer">
              <h4>
                Read more from {source}
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </a>
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export const query = graphql`
  query {
    articleImages: allFile(
      filter: { relativeDirectory: { eq: "images/articles" } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  }
`;
