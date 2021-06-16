import { Link } from "gatsby";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";

import * as homeStyles from "./home.module.css";

const Home = () => (
  <div>
    <Row>
      <Col>
        <h3 className={homeStyles.headerThree}>
          National Waitlist as of June 1, 2021
        </h3>
        <h1 className={homeStyles.headerOne}>107,419</h1>
        <Link to="/">
          <h4 className={homeStyles.headerFour}>
            Learn more about this projection
            <ArrowRight className={homeStyles.rightArrow} />
          </h4>
        </Link>
      </Col>
      <Col>
        <h3 className={homeStyles.headerThree}>
          Number of Americans projected to die before an OPO loses it’s contract
        </h3>
        <h1 className={homeStyles.headerOne}>60,000</h1>
        <Link to="/">
          <h4 className={homeStyles.headerFour}>
            Learn more about this projection
            <ArrowRight className={homeStyles.rightArrow} />
          </h4>
        </Link>
      </Col>
      <Col>
        <h3 className={homeStyles.headerThree}>
          Average reported CEO Compensation for failing OPOs (2019)
        </h3>
        <h1 className={homeStyles.headerOne}>$535,630</h1>
        <Link to="/">
          <h4 className={homeStyles.headerFour}>
            Learn more about this projection
            <ArrowRight className={homeStyles.rightArrow} />
          </h4>
        </Link>
      </Col>
    </Row>
  </div>
);

export default Home;
