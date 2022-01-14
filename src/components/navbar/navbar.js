import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";

import { StaticImage } from "gatsby-plugin-image";

import * as styles from "./navbar.module.css";

export default function Navigation() {
  const hamburger = (
    <StaticImage
      src="../../images/icons/mobile-menu.png"
      alt="hamburger"
      className={styles.hamburger}
    />
  );
  const close = (
    <StaticImage
      src="../../images/icons/mobile-x.png"
      alt="close"
      className={styles.close}
    />
  );

  const [icon, setIcon] = useState(hamburger);

  const toggle = () => {
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
            <h1>OPODATA.ORG</h1>
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
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={styles.navToggle}
          onClick={toggle}
        >
          <h1>Menu</h1>
          {icon}
        </Navbar.Toggle>
      </section>
      <Navbar.Collapse id="basic-navbar-nav" className={styles.navCollapse}>
        <Nav>
          <Nav.Link href="/equity" className={styles.navLink}>
            Inequities in Organ Procurement
          </Nav.Link>
          <Nav.Link href="/faqs" className={styles.navLink}>
            About Our Organ Donation System
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
