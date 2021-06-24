import React from "react";
import { Container, Row } from "react-bootstrap";
import Header from "./header";
import Footer from "./footer";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ children }) {
  return (
    <>
      <Container fluid>
        <Row className="justify-content-center siteHeader">
          <Header />
        </Row>
        {children}
        <Footer />
      </Container>
    </>
  );
}
