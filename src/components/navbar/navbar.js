import React from "react";
import { Row, Navbar, Container, Nav } from "react-bootstrap";

import { StaticImage } from "gatsby-plugin-image";

import * as styles from "./navbar.module.css";

export default function Navigation({ site }) {
  return (
    <Row className={styles.header}>
      <Nav.Link to="/" className={styles.logoWithText}>
        <StaticImage
          src="../../images/logo.png"
          alt="logo"
          placeholder="none"
          className={styles.logo}
        />
        <section className={styles.logoText}>
          <h1>{site}</h1>
          <h2>Performance Comparison</h2>
        </section>
      </Nav.Link>
      <Navbar expand="md" className={styles.nav}>
        <Container>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className={styles.navToggle}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="#" className={styles.navLink}>
                Performance Data
              </Nav.Link>
              <Nav.Link href="#" className={styles.navLink}>
                News
              </Nav.Link>
              <Nav.Link href="#" className={styles.navLink}>
                Inequities in Organ Procurement
              </Nav.Link>
              <Nav.Link href="#" className={styles.navLink}>
                Improving the System
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Row>
  );
}
