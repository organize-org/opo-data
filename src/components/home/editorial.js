import React from "react";

import { Link } from "gatsby";
import { Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactPlayer from "react-player";

import * as homeStyles from "./home.module.css";

export default function Editorial() {
  return (
    <div>
      <Row>
        <Col md={{ span: 4, offset: 2 }}>
          <h4 className={homeStyles.editorialHeading}>
            Rep. Katie Porter speaks about OPO Reform
          </h4>
          <p className={homeStyles.editorialText}>
            Organ Procurement Organizations (OPOs) are supposed to swiftly
            retrieve organs from donors. Yet, they're often havens for waste and
            abuse, in part because they can manipulate data to escape
            accountability, while vacationing on private jets—literally.
          </p>
          <p className={homeStyles.editorialText}>
            Congresswoman Katie Porter (CA-45) called out an industry lobbyist
            for this during a recent Oversight Committee hearing.
          </p>
          <Link to="https://www.youtube.com/watch?v=siDYyRClKKk">
            <h4 className={homeStyles.youtubeLink}>
              See the full video on YouTube
              <ArrowRight className={homeStyles.rightArrow} />
            </h4>
          </Link>
        </Col>

        <Col className={homeStyles.iframeMargin}>
          <ReactPlayer
            url="https://www.youtube.com/embed/siDYyRClKKk"
            width="760px"
            height="428px"
          />
        </Col>
      </Row>
    </div>
  );
}
