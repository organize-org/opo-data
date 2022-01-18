import React from "react";
import { Row, Col } from "react-bootstrap";
import { StaticImage } from "gatsby-plugin-image";
import About from '../../images/icons/about.svg';

import * as styles from "./footer.module.css";

export default function Footer() {
  return (
    <Row className={styles.footer}>
      <Col className={styles.header} xs={10} md={8}>
        <Row className={styles.icon}>
          <About />
          <h2>About Us</h2>
        </Row>
        <p>
          OPOData.org exists because of tireless advocates for organ donation
          reform, including the nonprofits Organize and Federation of American
          Scientists. The data on this page was collected from the Organ
          Procurement and Transplantation Network (OPTN) and Centers for
          Medicaid and Medicare & Medicaid Services (CMS). For more information
          on ways to improve the U.S. organ donation system, visit
          <a href="organize.org"> Organize.org</a>.
        </p>
        <p className={styles.research}>
          Research supported by Arnold Ventures and Schmidt Futures in
          partnership with Organize and the Federation of American Scientists.
        </p>
      </Col>
      <Col className={styles.logos}>
        <Row className={styles.logosOne}>
          <StaticImage
            src="../../images/logos/ArnoldVentures.png"
            alt="arnold logo"
            height={40}
          />
          <StaticImage
            src="../../images/logos/SchmidtFutures.png"
            alt="schmidt logo"
            height={40}
          />
          <StaticImage
            src="../../images/logos/fas-logo.png"
            alt="fas logo"
            height={40}
          />
        </Row>
        <Row className={styles.logosTwo}>
          <StaticImage
            src="../../images/logos/bloomworks.png"
            alt="bloom logo"
            height={35}
            className={styles.bloom}
          />
          <StaticImage
            src="../../images/logos/organize.png"
            alt="organize logo"
            height={35}
          />
        </Row>
      </Col>
    </Row>
  );
}
