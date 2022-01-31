import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";

import { StaticImage } from "gatsby-plugin-image";

import MobileMenu from '../../images/icons/mobile-menu.svg';
import MobileX from '../../images/icons/mobile-x.svg';

import * as styles from "./navbar.module.css";

export default function Navigation() {

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <Navbar expand="lg" variant="dark" className={styles.nav}>
      <Navbar.Brand>
        <Nav.Link href="/" className={styles.logoWithText}>
          <StaticImage
            src="../../images/logo.png"
            height={40}
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
          menuIsOpen
            ? styles.mobileTitleClose
            : styles.mobileTitle
        }
      >
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={styles.navToggle}
          onClick={() => setMenuIsOpen((isOpen) => !isOpen)}
        >
          <h1>Menu</h1>
          {menuIsOpen ? <MobileX alt="close" /> : <MobileMenu alt="expand" />}
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
