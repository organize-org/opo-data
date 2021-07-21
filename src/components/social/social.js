import React from "react";
import { Col } from "react-bootstrap";
import { SocialIcon } from "react-social-icons";
import { useStaticQuery, graphql } from "gatsby";
import { useLocation } from "@reach/router";
import copy from "copy-to-clipboard";

import CopyIcon from "../../images/icons/copy.svg";

import * as styles from "./social.module.css";

export default function Social() {
  const location = useLocation();
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            url
          }
        }
      }
    `
  );

  const siteUrl = `${site.siteMetadata.url}${location.pathname}`;
  const encodedUrl = encodeURIComponent(siteUrl);

  return (
    <Col className={styles.social}>
      <p>Share this page</p>
      <Col className={styles.icons}>
        <CopyIcon
          className={styles.icon}
          onClick={() => {
            copy(siteUrl);
          }}
        />
        <SocialIcon
          bgColor="#c4c4c4"
          className={styles.icon}
          url={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
        />
        <SocialIcon
          bgColor="#c4c4c4"
          className={styles.icon}
          url={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        />
      </Col>
    </Col>
  );
}
