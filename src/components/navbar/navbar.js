import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";

import { StaticImage } from "gatsby-plugin-image";

import * as styles from "./navbar.module.css";

export default function Navigation({ site }) {
  const hamburger = (
    <StaticImage
      src="../../images/icons/hamburger.png"
      alt="hamburger"
      className={styles.hamburger}
    />
  );
  const close = (
    <StaticImage
      src="../../images/icons/close.png"
      alt="close"
      className={styles.close}
    />
  );

  const [icon, setIcon] = useState(hamburger);

  const toggle = e => {
    e.preventDefault();

    if (icon.props.alt === "hamburger") {
      setIcon(close);
    } else {
      setIcon(hamburger);
    }
  };

  return (
    <Navbar expand="lg" variant="dark" className={styles.nav}>
      <Navbar.Brand>
        <Nav.Link href="/" className={styles.logoWithText}>
          <StaticImage
            src="../../images/logo.png"
            alt="logo"
            placeholder="none"
          />
          <section className={styles.logoText}>
            <h1>{site}</h1>
            <h2>Performance Comparison</h2>
          </section>
        </Nav.Link>
      </Navbar.Brand>
      <section
        className={
          icon.props.alt === "hamburger"
            ? styles.mobileTitle
            : styles.mobileTitleClose
        }
      >
        <h1>Menu</h1>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={styles.navToggle}
          onClick={toggle}
        >
          {icon}
        </Navbar.Toggle>
      </section>
      }
      <Navbar.Collapse id="basic-navbar-nav" className={styles.navCollapse}>
        <Nav>
          <Nav.Link href="#" className={styles.navLink}>
            Inequities in Organ Procurement
          </Nav.Link>
          <Nav.Link href="#" className={styles.navLink}>
            Improving the System
          </Nav.Link>
          <Nav.Link href="#" className={styles.navLink}>
            About OPODATA.ORG
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
