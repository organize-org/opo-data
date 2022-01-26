import React from "react";
import { Row, Col } from "react-bootstrap";
import { StaticImage } from "gatsby-plugin-image";
import About from '../../images/icons/about.svg';
import ReactMarkdown from "react-markdown";

import * as styles from "./footer.module.css";

export default function Footer() {
  return (
    <Row className={styles.footerContainer}>
      <Col className={styles.footer}>
        <Row className={styles.footerContent}>
          <h2><About />About Us</h2>
        </Row>
        <Row className={styles.footerContent}>
          <ReactMarkdown>
            The data on this page were collected from the Organ Procurement and Transplantation Network (OPTN)
            and Centers for Medicaid and Medicare & Medicaid Services (CMS). For more information on ways to
            improve the U.S. organ donation system, visit [“The Costly Effects of an Outdated Organ Donation System](https://bloomworks.digital/organdonationreform/)."
          </ReactMarkdown>
          <p>
            Research supported by Arnold Ventures and Schmidt Futures in
            partnership with Organize and the Federation of American Scientists.
          </p>
        </Row>
        <Row className={`${styles.footerContent} ${styles.footerIcons}`}>
          <a href="https://www.arnoldventures.org">
            <StaticImage
              src="../../images/logos/ArnoldVentures.png"
              alt="arnold logo"
              height={40}
            />
          </a>
          <a href="https://www.schmidtfutures.com">
            <StaticImage
              src="../../images/logos/SchmidtFutures.png"
              alt="schmidt logo"
              height={80}
            />
          </a>
          <a href="https://fas.org">
            <StaticImage
              src="../../images/logos/fas-logo.png"
              alt="fas logo"
              height={40}
            />
          </a>
          <a href="https://bloomworks.digital">
            <StaticImage
              src="../../images/logos/bloomworks.png"
              alt="bloom logo"
              height={40}
              className={styles.bloom}
            />
          </a>
          <a href="https://www.organize.org">
            <StaticImage
              src="../../images/logos/organize.png"
              alt="organize logo"
              height={40}
            />
          </a>
        </Row>
        <Row className={styles.footerContent}><p>© 2022</p></Row>
      </Col>
    </Row>
  );
}
