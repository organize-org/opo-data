import React from "react";
import { graphql } from "gatsby";
import { Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";

import Layout from "../components/layout";
import Map from "../components/map";

import * as styles from "./index.module.css";
import content from "./index.content.yml";

export default function Dashboard({ data: { articleImages, quoteImage } }) {
  const { articles, stats, quote, video } = content;
  const articleImgsByPath = articleImages?.edges?.reduce(
    (imgMap, { node }) => ({
      ...imgMap,
      [`../${node.relativePath}`]: node,
    }),
    {}
  );

  return (
    <Layout>
      <Map interactive={true} />
      <Row className={styles.statsSection}>
        {Object.values(stats).map(({ title, value }) => (
          <Col className="mx-5" key={title}>
            <Row className="h-50">
              <h3>{title}</h3>
            </Row>
            <Row className="justify-content-center">
              <p>{value}</p>
            </Row>
          </Col>
        ))}
      </Row>
      <Row>
        <BgImage
          className={styles.quoteImgBackground}
          image={getImage(quoteImage)}
        >
          <Col className={styles.quoteSection} md={{ span: 5, offset: 6 }}>
            <figure>
              <blockquote>{quote.quote}</blockquote>
            </figure>
            <figcaption>
              &mdash; <cite>{quote.attribution}</cite>
            </figcaption>
          </Col>
        </BgImage>
      </Row>
      <Row className={`mx-5 ${styles.videoSection}`}>
        <Col className="mx-5">
          <Row>
            <h3>{video.title}</h3>
          </Row>
          <Row>
            <ReactMarkdown>{video.description}</ReactMarkdown>
          </Row>
          <Row>
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
          </Row>
        </Col>
        <Col className="align-items-center">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${video.youtube}`}
          />
        </Col>
      </Row>
      <Row className={`mx-4 ${styles.articlesSection}`}>
        {articles.map(({ description, title, image, link }) => (
          <Col className="mx-4" key={title}>
            <Row>
              <GatsbyImage
                image={getImage(articleImgsByPath[image])}
                alt={title}
              />
            </Row>
            <Row className="h-25">
              <h3>{title}</h3>
            </Row>
            <Row className="h-25">
              <ReactMarkdown>{description}</ReactMarkdown>
            </Row>
            <Row>
              <a href={link} target="_blank" rel="noreferrer">
                <h4>
                  Read more
                  <ArrowRight className={styles.rightArrow} />
                </h4>
              </a>
            </Row>
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
    quoteImage: file(relativePath: { eq: "images/quoteImage.png" }) {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
      }
    }
  }
`;
