import React, { useEffect, useState } from "react";
import { graphql, navigate } from "gatsby";
import { Row, Col, ButtonGroup, Button } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import Layout from "../components/layout/layout";
import SelectState from "../components/selectState/selectState";
import EquitySection from "../components/equitySection/equitySection";
import MainMap from "../components/map/mainMap";
import Social from "../components/social/social";
import QuoteWithImage from "../components/quoteWithImage/quoteWithImage";

import News from "../images/icons/news.svg";
import Data from "../images/icons/data.svg";
import Performance from "../images/icons/performance.svg";

import * as styles from "./index.module.css";
import content from "./index.content.yml";

export default function Dashboard({ location, data: { articleImages } }) {
  const { mapContent, articles, stats, quote, video } = content;
  const articleImgsByPath = articleImages?.edges?.reduce(
    (imgMap, { node }) => ({
      ...imgMap,
      [`../${node.relativePath}`]: node,
    }),
    {},
  );

  const [mapView, setMapView] = useState(
    location?.hash ? location.hash.substring(1) : "opo-performance",
  );

  useEffect(() => {
    if (
      ![
        "",
        "#opo-performance",
        "#house-investigations",
        "#black-procurement-disparities",
        "#senate-investigations",
      ].includes(location?.hash)
    )
      navigate("/");
    setMapView(location?.hash ? location.hash.substring(1) : "opo-performance");
  }, [location]);

  // For whatever reason on initial load the map is not rendered correctly
  // (something to do with the map container not rendering on initial load, so map is incorrectly sized)
  // Quick hack fix is force map to re-render by using a counter state obj as component key
  const [rerenderMap, setRerenderMap] = useState(0);
  useEffect(() => {
    if (rerenderMap === 0) setRerenderMap(r => r + 1);
  }, [rerenderMap]);

  return (
    <Layout className={styles.index}>
      <Social />
      <Row className={styles.topBar}>
        <Col className={styles.topHeader}>
          <h2>
            {" "}
            <Data />
            Data on U.S. Organ Procurement Organizations (OPO)
          </h2>
        </Col>
      </Row>

      <Row className={styles.mapToggleButtons}>
        <Col xs={12} lg={8}>
          <ButtonGroup>
            <Button
              variant="outline-secondary"
              className={styles.mapToggleButtons}
              active={mapView === "opo-performance"}
              onClick={() => navigate("/")}
            >
              OPO Performance
            </Button>
            <Button
              variant="outline-secondary"
              className={styles.mapToggleButtons}
              active={mapView === "house-investigations"}
              onClick={() => navigate("/#house-investigations")}
            >
              House Investigations
            </Button>
            <Button
              variant="outline-secondary"
              className={styles.mapToggleButtons}
              active={mapView === "senate-investigations"}
              onClick={() => navigate("/#senate-investigations")}
            >
              Senate Investigations
            </Button>

            <Button
              variant="outline-secondary"
              className={styles.mapToggleButtons}
              active={mapView === "black-procurement-disparities"}
              onClick={() => navigate("/#black-procurement-disparities")}
            >
              Black Procurement Disparities
            </Button>
          </ButtonGroup>
        </Col>
        <Col>
          <SelectState opo={mapView !== "opo-performance"} />
        </Col>
      </Row>
      {/* Map content (specific to current map view) */}
      <Row className={styles.mapIntroContent}>
        <ReactMarkdown>{mapContent[mapView]}</ReactMarkdown>
      </Row>
      <MainMap key={rerenderMap} mapView={mapView} />

      <Col className={styles.secondHeader} xs={12} lg={6}>
        <h2>
          <Performance />
          Cost of OPO Performance Failures
        </h2>
      </Col>
      <Row className={styles.statsSection}>
        {Object.values(stats).map(({ title, value }) => (
          <Col key={title}>
            <Row className={styles.statsHeaders}>
              <h3>
                <ReactMarkdown>{title}</ReactMarkdown>
              </h3>
            </Row>
            <Row className="justify-content-center align-items-end">
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
      <Col className={styles.secondHeader} xs={10} md={5}>
        <h2>
          <News />
          Organ donation in the news
        </h2>
      </Col>
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
            gatsbyImageData(
              placeholder: BLURRED
              height: 240
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`;
