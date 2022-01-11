import React from "react";
import { Row, Col } from "react-bootstrap";
import { StaticImage } from "gatsby-plugin-image";

import * as styles from "./footer.module.css";

export default function Footer() {
  return (
    <Row className={styles.footer}>
      <Col className={styles.header} xs={10} md={8}>
        <Row className={styles.icon}>
          <StaticImage src="../../images/icons/people.png" />
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
      </Col>
      <Col>
        <Row className={styles.logosOne}>
          <StaticImage
            src="../../images/logos/organize.png"
            alt="organize logo"
            height={28}
            className={styles.organize}
          />
          <StaticImage
            src="../../images/logos/bloomworks.png"
            alt="bloomworks logo"
            height={28}
          />
        </Row>
        <Row className={styles.logosTwo}>
          <StaticImage
            src="../../images/logos/schmidt.png"
            alt="schmidt logo"
            height={40}
            className={styles.schmidt}
          />
          <StaticImage
            src="../../images/logos/av.png"
            alt="arnold venture logo"
            height={40}
            className={styles.schmidt}
          />
          <StaticImage
            src="../../images/logos/fas.png"
            alt="fas logo"
            height={40}
          />
        </Row>
      </Col>
    </Row>
  );
}
