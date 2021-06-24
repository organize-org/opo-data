import React from "react";

import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import { StaticImage } from "gatsby-plugin-image";

import * as homeStyles from "./home.module.css";

export default function Articles() {
  return (
    <div>
      <Row>
        <Col md={{ offset: 1 }} className={homeStyles.staticImageOne}>
          <StaticImage src="../../images/editorial1.png" alt="news-article" />
          <h4 className={homeStyles.editorialHeadingTwo}>
            They Survived Covid. Now They Need New Lungs.
          </h4>
          <p className={homeStyles.editorialText}>
            He survived Covid-19, but his lungs were ravaged. After months of
            deep sedation, he is delirious, his muscles atrophied. And this
            61-year-old still cannot breathe on his own.
          </p>
        </Col>
        <Col className={homeStyles.staticImage}>
          <StaticImage src="../../images/editorial2.png" alt="news-article" />
          <h4 className={homeStyles.editorialHeadingTwo}>
            New Organ Donation Rule Is A Win For Black Patients And Health
            Equity
          </h4>
          <p className={homeStyles.editorialText}>
            In an important win for patients, and health equity, the Department
            of Health and Human Services (HHS) recently finalized reforms
            targeted at the government contractors that run the organ donation
            system.
          </p>
        </Col>
        <Col className={homeStyles.staticImage}>
          <StaticImage src="../../images/editorial3.png" alt="news-article" />
          <h4 className={homeStyles.editorialHeadingTwo}>
            Organ collection agencies told to improve performance or face
            tighter rules
          </h4>
          <p className={homeStyles.editorialText}>
            With 107,000 people waiting for kidneys, hearts, livers and other
            organs, a congressional subcommittee renewed efforts to force organ
            procurement organizations to improve.
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={{ offset: 1 }}>
          <Link to="https://www.nytimes.com/2021/04/29/opinion/covid-19-lung-transplants.html">
            <h4 className={homeStyles.editorialLink}>
              Read this article on NYTimes.com
              <ArrowRight className={homeStyles.rightArrow} />
            </h4>
          </Link>
        </Col>
        <Col>
          <Link to="https://www.healthaffairs.org/do/10.1377/hblog20201211.229975/full/">
            <h4 className={homeStyles.editorialLink}>
              Read this article on Health Affairs Blog
              <ArrowRight className={homeStyles.rightArrow} />
            </h4>
          </Link>
        </Col>
        <Col>
          <Link to="https://www.washingtonpost.com/health/organ-collection-agencies-told-to-improve-performance-or-face-tighter-rules/2021/05/04/68847bce-ad06-11eb-acd3-24b44a57093a_story.html">
            <h4 className={homeStyles.editorialLink}>
              Read this article on Washington Post
              <ArrowRight className={homeStyles.rightArrow} />
            </h4>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
