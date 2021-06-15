import { Link } from "gatsby";
import React from "react";
import { Row, Col } from "react-bootstrap";
import * as styles from "./home.module.css";

const Home = () => (
  <div className={styles}>
    <Row>
      <Col>
        <h3>
          National Waitlist as <br />
          of June 1, 2021
        </h3>
        <h1>107,419</h1>
        <Link to="/">
          <h4>Learn more about this projection</h4>
        </Link>
      </Col>
      <Col>
        <h3>
          Number of Americans projected to die before an OPO loses it’s contract
        </h3>
        <h1>60,000</h1>
        <Link to="/">
          <h4>Learn more about this projection</h4>
        </Link>
      </Col>
      <Col>
        <h3>Average reported CEO Compensation for failing OPOs (2019)</h3>
        <h1>$535,630</h1>
        <Link to="/">
          <h4>Learn more about this projection</h4>
        </Link>
      </Col>
    </Row>
  </div>
);

export default Home;
