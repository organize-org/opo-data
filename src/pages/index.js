import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, StaticImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";
import { Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactPlayer from "react-player";

import Layout from "../components/layout";
import Map from "../components/map";

import * as styles from "./index.module.css";

export default function Dashboard({
  data: { dsaGeoData, statesGeoData, opoData, quoteImage },
}) {
  const tierData = opoData?.nodes?.reduce(
    (opoDataMap, { Tier, OPO }) => ({
      ...opoDataMap,
      [OPO]: Tier,
    }),
    {}
  );

  const transformedDSAData = {
    ...dsaGeoData?.childGeoJson,
    features: dsaGeoData?.childGeoJson?.features?.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        tier: tierData[feature.properties.name],
      },
    })),
  };

  return (
    <Layout>
      <Map
        dsaGeoJSON={transformedDSAData}
        interactive={true}
        statesGeoJSON={statesGeoData.childGeoJson}
      />
      <Row className={styles.statsSection}>
        <Col className="mx-5">
          <Row className="h-50">
            <h3>National Waitlist as of June 1, 2021</h3>
          </Row>
          <Row className="justify-content-center">
            <p>107,419</p>
          </Row>
        </Col>
        <Col className="mx-5">
          <Row className="h-50">
            <h3>
              Number of Americans projected to die before an OPO loses it’s
              contract
            </h3>
          </Row>
          <Row className="justify-content-center">
            <p>60,000</p>
          </Row>
        </Col>
        <Col className="mx-5">
          <Row className="h-50">
            <h3>Average reported CEO Compensation for failing OPOs (2019)</h3>
          </Row>
          <Row className="justify-content-center">
            <p>$535,630</p>
          </Row>
        </Col>
      </Row>
      <Row>
        <BgImage
          className={styles.quoteImgBackground}
          image={getImage(quoteImage)}
        >
          <Col className={styles.quoteSection} md={{ span: 5, offset: 6 }}>
            <figure>
              <blockquote>
                An astounding lack of accountability and oversight in the
                nation’s creaking, monopolistic organ transplant system is
                allowing hundreds of thousands of potential organ donations to
                fall through the cracks.
              </blockquote>
            </figure>
            <figcaption>
              &mdash; <cite>NYT editorial board</cite>
            </figcaption>
          </Col>
        </BgImage>
      </Row>
      <Row className={`mx-5 ${styles.videoSection}`}>
        <Col className="mx-5">
          <Row>
            <h3>Rep. Katie Porter speaks about OPO Reform</h3>
          </Row>
          <Row>
            <p>
              Organ Procurement Organizations (OPOs) are supposed to swiftly
              retrieve organs from donors. Yet, they're often havens for waste
              and abuse, in part because they can manipulate data to escape
              accountability, while vacationing on private jets—literally.
            </p>
            <p>
              Congresswoman Katie Porter (CA-45) called out an industry lobbyist
              for this during a recent Oversight Committee hearing.
            </p>
          </Row>
          <Row>
            <Link to="https://www.youtube.com/watch?v=siDYyRClKKk">
              <h4>
                See the full video on YouTube
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="align-items-center">
          <ReactPlayer url="https://www.youtube.com/embed/siDYyRClKKk" />
        </Col>
      </Row>
      <Row className={`mx-4 ${styles.articlesSection}`}>
        <Col className="mx-4">
          <Row>
            <StaticImage src="../images/editorial1.png" alt="news-article" />
          </Row>
          <Row className="h-25">
            <h3>They Survived Covid. Now They Need New Lungs.</h3>
          </Row>
          <Row className="h-25">
            <p>
              He survived Covid-19, but his lungs were ravaged. After months of
              deep sedation, he is delirious, his muscles atrophied. And this
              61-year-old still cannot breathe on his own.
            </p>
          </Row>
          <Row>
            <Link to="https://www.nytimes.com/2021/04/29/opinion/covid-19-lung-transplants.html">
              <h4>
                Read this article on NYTimes.com
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="mx-4">
          <Row>
            <StaticImage src="../images/editorial2.png" alt="news-article" />
          </Row>
          <Row className="h-25">
            <h3>
              New Organ Donation Rule Is A Win For Black Patients And Health
              Equity
            </h3>
          </Row>
          <Row className="h-25">
            <p>
              The Department of Health and Human Services (HHS) recently
              finalized reforms targeted at the government contractors that run
              the organ donation system.
            </p>
          </Row>
          <Row>
            <Link to="https://www.healthaffairs.org/do/10.1377/hblog20201211.229975/full/">
              <h4>
                Read this article on Health Affairs Blog
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="mx-4">
          <Row>
            <StaticImage src="../images/editorial3.png" alt="news-article" />
          </Row>
          <Row className="h-25">
            <h3>
              Organ collection agencies told to improve performance or face
              tighter rules
            </h3>
          </Row>
          <Row className="h-25">
            <p>
              With 107,000 people waiting for kidneys, hearts, livers and other
              organs, a congressional subcommittee renewed efforts to force
              organ procurement organizations to improve.
            </p>
          </Row>
          <Row>
            <Link to="https://www.washingtonpost.com/health/organ-collection-agencies-told-to-improve-performance-or-face-tighter-rules/2021/05/04/68847bce-ad06-11eb-acd3-24b44a57093a_story.html">
              <h4>
                Read this article on Washington Post
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}

export const query = graphql`
  query {
    quoteImage: file(relativePath: { eq: "images/quoteImage.png" }) {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
      }
    }
    dsaGeoData: file(relativePath: { eq: "data/dsas.geojson" }) {
      childGeoJson {
        features {
          geometry {
            type
            coordinates
          }
          properties {
            name
            opo
          }
          type
        }
      }
    }
    statesGeoData: file(relativePath: { eq: "data/states.geojson" }) {
      childGeoJson {
        features {
          geometry {
            type
            coordinates
          }
          properties {
            name
          }
          type
        }
      }
    }
    opoData: allMetricsCsv {
      nodes {
        Board
        CEO
        Donors
        Notes
        OPO
        Organs
        States
        Tier
        Waitlist
      }
    }
  }
`;
