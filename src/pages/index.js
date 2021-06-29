import React from "react";
import { graphql } from "gatsby";
import { getImage, StaticImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";
import { Link } from "gatsby";
import { Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactPlayer from "react-player";

import Layout from "../components/layout";
import Map from "../components/map";

import * as homeStyles from "../styles/home.module.css";

export default function Dashboard({ data }) {
  const geoData = data.allGeoJson.edges.map(({ node }) => ({ ...node }));
  const tableData = data.allMetricsCsv.edges.map(({ node }) => ({ ...node }));
  const pluginImage = getImage(data.placeholderImage);

  const tierData = tableData.reduce(
    (tableDataMap, { Tier, OPO }) => ({
      ...tableDataMap,
      [OPO]: Tier,
    }),
    {}
  );

  const transformedGeoData = {
    ...geoData[0],
    features: geoData[0].features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        tier: tierData[feature.properties.name],
      },
    })),
  };

  return (
    <Layout>
      <Map geoData={transformedGeoData} />
      {/* HOME Stats Section */}
      <Row>
        <Col className="mx-5">
          <Row className="h-50">
            <h3 className={homeStyles.headerThree}>
              National Waitlist as of June 1, 2021
            </h3>
          </Row>
          <Row className="justify-content-center">
            <h1 className={homeStyles.headerOne}>107,419</h1>
            {/* TODO: https://trello.com/c/fIOy4kiM/24-add-learn-more-content <Link to="/">
            <h4 className={homeStyles.headerFour}>
              Learn more about this projection
              <ArrowRight className={homeStyles.rightArrow} />
            </h4>
          </Link> */}
          </Row>
        </Col>
        <Col className="mx-5">
          <Row className="h-50">
            <h3 className={homeStyles.headerThree}>
              Number of Americans projected to die before an OPO loses it’s
              contract
            </h3>
          </Row>
          <Row className="justify-content-center">
            <h1 className={homeStyles.headerOne}>60,000</h1>
            {/* TODO: https://trello.com/c/fIOy4kiM/24-add-learn-more-content <Link to="/">
            <h4 className={homeStyles.headerFour}>
              Learn more about this projection
              <ArrowRight className={homeStyles.rightArrow} />
            </h4>
          </Link> */}
          </Row>
        </Col>
        <Col className="mx-5">
          <Row className="h-50">
            <h3 className={homeStyles.headerThree}>
              Average reported CEO Compensation for failing OPOs (2019)
            </h3>
          </Row>
          <Row className="justify-content-center">
            <h1 className={homeStyles.headerOne}>$535,630</h1>
            {/* TODO: https://trello.com/c/fIOy4kiM/24-add-learn-more-content <Link to="/">
            <h4 className={homeStyles.headerFour}>
              Learn more about this projection
              <ArrowRight className={homeStyles.rightArrow} />
            </h4>
          </Link> */}
          </Row>
        </Col>
      </Row>
      {/* Home Image Section */}
      <Row>
        <BgImage
          className={homeStyles.imgBackground}
          image={pluginImage}
          style={{
            backgroundPosition: "left center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#b00e0c",
          }}
        >
          <div>
            <Col md={{ span: 5, offset: 6 }}>
              <figure className={homeStyles.quote}>
                <blockquote>
                  An astounding lack of accountability and oversight in the
                  nation’s creaking, monopolistic organ transplant system is
                  allowing hundreds of thousands of potential organ donations to
                  fall through the cracks.
                </blockquote>
              </figure>
              <figcaption className={homeStyles.quoteSource}>
                &mdash; <cite>NYT editorial board</cite>
              </figcaption>
            </Col>
          </div>
        </BgImage>
      </Row>

      {/* Editorial section */}

      <Row className="mx-5">
        <Col className="mx-5">
          <Row>
            <h4 className={homeStyles.editorialHeading}>
              Rep. Katie Porter speaks about OPO Reform
            </h4>
          </Row>
          <Row>
            <p className={homeStyles.editorialText}>
              Organ Procurement Organizations (OPOs) are supposed to swiftly
              retrieve organs from donors. Yet, they're often havens for waste
              and abuse, in part because they can manipulate data to escape
              accountability, while vacationing on private jets—literally.
            </p>
            <p className={homeStyles.editorialText}>
              Congresswoman Katie Porter (CA-45) called out an industry lobbyist
              for this during a recent Oversight Committee hearing.
            </p>
          </Row>
          <Row>
            <Link to="https://www.youtube.com/watch?v=siDYyRClKKk">
              <h4 className={homeStyles.youtubeLink}>
                See the full video on YouTube
                <ArrowRight className={homeStyles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>

        <Col className="align-self-end">
          <ReactPlayer
            url="https://www.youtube.com/embed/siDYyRClKKk"
            className={homeStyles.iframeMargin}
            // width="760px"
            // height="428px"
          />
        </Col>
      </Row>

      {/* Articles Section */}

      <Row className="mx-5">
        <Col className="mx-5 ">
          <Row>
            <StaticImage
              className={homeStyles.staticImage}
              src="../images/editorial1.png"
              alt="news-article"
            />
          </Row>
          <Row className={homeStyles.editorialHeadingTwo}>
            <h4 className={homeStyles.articleHeading}>
              They Survived Covid. Now They Need New Lungs.
            </h4>
          </Row>
          <Row className={homeStyles.editorialText}>
            <p className={homeStyles.articleText}>
              He survived Covid-19, but his lungs were ravaged. After months of
              deep sedation, he is delirious, his muscles atrophied. And this
              61-year-old still cannot breathe on his own.
            </p>
          </Row>
          <Row>
            <Link to="https://www.nytimes.com/2021/04/29/opinion/covid-19-lung-transplants.html">
              <h4 className={homeStyles.editorialLink}>
                Read this article on NYTimes.com
                <ArrowRight className={homeStyles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="mx-5">
          <Row>
            <StaticImage
              className={homeStyles.staticImage}
              src="../images/editorial2.png"
              alt="news-article"
            />
          </Row>
          <Row className={homeStyles.editorialHeadingTwo}>
            <h4 className={homeStyles.articleHeading}>
              New Organ Donation Rule Is A Win For Black Patients And Health
              Equity
            </h4>
          </Row>
          <Row className={homeStyles.editorialText}>
            <p className={homeStyles.articleText}>
              In an important win for patients, and health equity, the
              Department of Health and Human Services (HHS) recently finalized
              reforms targeted at the government contractors that run the organ
              donation system.
            </p>
          </Row>
          <Row>
            <Link to="https://www.healthaffairs.org/do/10.1377/hblog20201211.229975/full/">
              <h4 className={homeStyles.editorialLink}>
                Read this article on Health Affairs Blog
                <ArrowRight className={homeStyles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="mx-5 ">
          <Row>
            <StaticImage
              className={homeStyles.staticImage}
              src="../images/editorial3.png"
              alt="news-article"
            />
          </Row>
          <Row className={homeStyles.editorialHeadingTwo}>
            <h4 className={homeStyles.articleHeading}>
              Organ collection agencies told to improve performance or face
              tighter rules
            </h4>
          </Row>
          <Row className={homeStyles.editorialText}>
            <p className={homeStyles.articleText}>
              With 107,000 people waiting for kidneys, hearts, livers and other
              organs, a congressional subcommittee renewed efforts to force
              organ procurement organizations to improve.
            </p>
          </Row>
          <Row>
            <Link to="https://www.washingtonpost.com/health/organ-collection-agencies-told-to-improve-performance-or-face-tighter-rules/2021/05/04/68847bce-ad06-11eb-acd3-24b44a57093a_story.html">
              <h4 className={homeStyles.editorialLink}>
                Read this article on Washington Post
                <ArrowRight className={homeStyles.rightArrow} />
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
    placeholderImage: file(relativePath: { eq: "images/home-img.png" }) {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
      }
    }
    allMetricsCsv {
      edges {
        node {
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
    allGeoJson {
      edges {
        node {
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
    }
  }
`;
