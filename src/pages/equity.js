import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Tweet } from "react-twitter-widgets";
import { graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/layout/layout";
import Social from "../components/social/social";
import QuoteWithImage from "../components/quoteWithImage/quoteWithImage";

import * as styles from "./equity.module.css";
import content from "./equity.content.yml";

const SmallQuote = ({ attribution, quote }) => (
  <Row className={styles.smallQuote}>
    <figure className="red">
      <blockquote>"{quote}"</blockquote>
    </figure>
    <figcaption>
      &mdash; <cite>{attribution}</cite>
    </figcaption>
  </Row>
);

export default function Equity({ data: { bottomImage, topImage } }) {
  return (
    <Layout>
      <Row className={styles.topBar}>
        <Col md="8">
          <h2>Inequities in Organ Procurement Across the Nation</h2>
        </Col>
        <Social />
      </Row>
      <QuoteWithImage
        image={getImage(topImage)}
        quote={{
          attribution: "House Oversight Committee",
          quote:
            "The burden of OPO failures is disproportionately borne by patients of color, making OPO reform an urgent health care equity issue.",
        }}
        side="left"
      />
      <Row className={styles.main}>
        <h3>
          Patients of color are far more likely to need an organ transplant than
          white Americans as a result of inferior service from OPOs
        </h3>
        <Col md="7">
          <Row>
            <p>
              Patients of color are less likely to receive organ transplants
              than white patients because of inferior OPO service. We must drive
              reforms to hold OPOs accountable.
            </p>
            <p>
              See our report cataloguing peer-reviewed research on the
              inequitable service OPOs provide to different ethnic communities.
              As bipartisan, bicameral Congressional leaders have written, OPO
              reforms have “urgent implications for health equity”.
            </p>
          </Row>
          <Row className={styles.tables}>
            <Col>
              <h4>
                Likelihood of kidney failure compared to White Americans in the
                U.S. by race
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
                Likelihood to have heptacellular carinoma* (HCC) compared to
                White Americans in the U.S.
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
            <h4>How this plays out during the organ procurement process</h4>
            <Row>
              <Col md="1">
                <div className={`${styles.step} ${styles.yellow}`}>
                  <span>1</span>
                </div>
              </Col>
              <Col>
                <h4>
                  Patients of color are less likely to be referred as potential
                  organ donors to the OPO than white patients
                </h4>
                <p>
                  This results from differential OPO practices and resource
                  allocation for communities of color, including that OPOs spend
                  fewer resources on hospital development in communities that
                  serve patients of color, and sometimes even as as the result
                  of specific “guidance by OPOs to not call on specific
                  circumstances to avoid reporting on cases when the OPO
                  believes donation is unlikely [overwhelmingly more commonly
                  for patients of color].”
                </p>
              </Col>
            </Row>
            <Row>
              <Col md="1">
                <div className={`${styles.step} ${styles.lightRed}`}>
                  <span>2</span>
                </div>
              </Col>
              <Col>
                <h4>
                  OPOs are less likely to respond to donation referrals for
                  patients of color versus white patients
                </h4>
                <p>
                  “One comparison study that looked at differences in organ
                  donor experiences found Black families were “less likely to
                  have spoken to an organ procurement organization
                  representative,” with previous research concluding “[t]he odds
                  that a family of a White patient was approached for donation
                  were nearly twice those for a family of an African American.”
                </p>
                <p>
                  Dr. Kenneth Moritsugu, Former U.S. Surgeon General: “Often,
                  misallocation of OPO resources means OPOs do not respond to
                  all donation cases, or do not properly train and support their
                  frontline staff. The impact of this, unsurprisingly, falls
                  disproportionately on families of color.”
                </p>
              </Col>
            </Row>
            <Row>
              <Col md="1">
                <div className={`${styles.step} ${styles.darkRed}`}>
                  <span>3</span>
                </div>
              </Col>
              <Col>
                <h4>
                  OPOs provide less complete and compassionate care to families
                  of color versus white families
                </h4>
                <p>
                  When OPOs do follow up with the families of patients of color,
                  the quality of the interaction is often inadequate. A study
                  comparing experiences between Black donor families and white
                  donor families found Black people experienced “less complete
                  discussions about the possibility of organ donation.”
                </p>
                <p>
                  Another study found the most common reasons Black families
                  declined to donate were that the OPO did not “give [them]
                  enough time to discuss important issues… or respond to strong
                  emotion with sensitivity and empathy.”
                </p>
                <p>
                  This is a missed opportunity, since families who spend more
                  contact with OPOs are shown to be 3 times as likely to donate.
                </p>
              </Col>
            </Row>
          </Row>
        </Col>
        <Col md="4">
          <Row>
            <h4>Voices for organ donation reform</h4>
          </Row>
          <SmallQuote
            attribution="Alonzo Mourning"
            quote="The organ donation crisis disproportionately hurts patients of color. Patients can’t wait; so the government shouldn’t either."
          />
          <SmallQuote
            attribution="Global Liver Institute"
            quote="The reality is that the U.S. organ donation system is broken.... Both donor families and patients of color who need an organ experience different treatments and a system deeply rooted in inequity."
          />
          <Tweet tweetId="1388204146969427971" />
        </Col>
      </Row>
      <QuoteWithImage
        image={getImage(bottomImage)}
        quote={{
          attribution: "Global Liver Institute",
          quote:
            "The reality is that the U.S. organ donation system is broken.... Both donor families and patients of color who need an organ experience different treatments and a system deeply rooted in inequity.",
        }}
        side="left"
      />
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
