import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import { Row, Col, ButtonGroup, Button } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import EquitySection from "../components/equitySection/equitySection";
import Layout from "../components/layout/layout";
import MainMap from "../components/map/mainMap";
import Social from "../components/social/social";
import QuoteWithImage from "../components/quoteWithImage/quoteWithImage";
import SelectState from "../components/selectState/selectState";

import News from '../images/icons/news.svg';
import Data from '../images/icons/data.svg';
import Performance from '../images/icons/performance.svg';

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

  const [mapView, setMapView] = useState('opo-performance');

  // For whatever reason on initial load the map is not rendered correctly
  // (something to do with the map container not rendering on initial load, so map is incorrectly sized)
  // Quick hack fix is force map to re-render by using a counter state obj as component key
  const [rerenderMap, setRerenderMap] = useState(0);
  useEffect(() => {
    if(!rerenderMap) setRerenderMap(r => r + 1);
  })

  return (
    <Layout className={styles.index}>
      <Row className={styles.topBar}>
        <Col className={styles.topHeader} xs={12} md={8}>
          <h2> <Data />Data on U.S. Organ Procurement Organizations (OPO)</h2>
        </Col>
        <Social />
      </Row>

      <Row className={styles.mapToggleButtons}>
        <Col xs={7}>
          <ButtonGroup>
            <Button variant="outline-secondary" className={styles.mapToggleButtons} active={mapView==='opo-performance'} onClick={() => setMapView('opo-performance')}>OPO Performance</Button>
            <Button variant="outline-secondary" className={styles.mapToggleButtons} active={mapView==='congressional-investigation'} onClick={() => setMapView('congressional-investigation')}>Under Congressional Investigation</Button>
            <Button variant="outline-secondary" className={styles.mapToggleButtons} active={mapView==='black-procurement-disparity'} onClick={() => setMapView('black-procurement-disparity')}>Black Procurement Disparities</Button>
          </ButtonGroup>
        </Col>
        <Col>
          <SelectState opo={mapView  !== 'opo-performance'} />
        </Col>
      </Row>
      {/* Map content (specific to current map view) */}
      <Row className={styles.mapIntroContent}>
        <div>{getMapIntroContent(mapView)}</div>
      </Row>  
      <MainMap key={rerenderMap} mapView={mapView}/>

      <Col className={styles.secondHeader} xs={10} md={6}>
        <h2><Performance />Poor OPO Performance Costs Lives</h2>
      </Col>
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
      <Col
        className={`${styles.thirdHeader} + ${styles.secondHeader}`}
        xs={10}
        md={5}
      >
        <h2><News />Organ donation in the news</h2>
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
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  }
`;

const getMapIntroContent = (view) => {
  if (view === "opo-performance") {
    return (
      <>
        <p>The Centers for Medicare & Medicaid Services (CMS) ranks OPOs into 3 different tiers. Rankings incorporate the number of donors and the number of organs transplanted. The majority of the nation’s OPOs are failing to meet Tier 1 standards, leading to thousands of unnecessary deaths each year, which disproportionately harm patients of color. </p>
        <p>The map below shows the current ranking of U.S. OPOs by location, based on 2019 data. <a href="https://www.cms.gov/newsroom/fact-sheets/organ-procurement-organization-opo-conditions-coverage-final-rule-revisions-outcome-measures-opos" rel="noreferrer" target="_blank">Find more information here. </a></p>
      </>
    )
  }

  if (view === "congressional-investigation") {
    return (
      <>
        <p>In the face of inadequate patient safety standards and procurement rates, the House and Senate have launced congressional investigations into the practices and performance of several OPOs across the U.S.
          <ul>
            <li><a target="_blank" rel="noreferrer" href="https://oversight.house.gov/sites/democrats.oversight.house.gov/files/OPO%20Letters.pdf">Read the release from the House committee</a></li>
            <li><a target="_blank" rel="noreferrer" href="https://www.finance.senate.gov/chairmans-news/finance-committee-members-probe-us-organ-transplant-system">Read the release from the Senate Finance committee</a></li>
          </ul>
        </p>
      </>
    )
  }

  if (view === "black-procurement-disparity") {
    return (
      <>
        <p>In 2019, CMS released data on organ donation success rates by ethnicity. The data highligted significant disaparities between white donors and people of color, especially black donors — who had a 10-fold difference between recovery from white donors. This gap can be attributed to ineffective community outreach, education, and lack of cultural sensitivity by some OPOs.</p>
        <p><a target="_blank" rel="noreferrer" href="https://www.axios.com/organ-donation-recovery-worse-people-of-color-8d42a213-4ef7-48a3-85fb-dd15cfc4301b.html">Read the article from Axios covering this issue. </a></p>
      </>
    )
  }
}
