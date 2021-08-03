import React, { useState, useRef } from "react";
import { Col, Tooltip, OverlayTrigger } from "react-bootstrap";
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

  function HoverIcon({ hoverColor, url }) {
    const defaultColor = "#c4c4c4";
    const [color, setColor] = useState(defaultColor);
    const [show, setShow] = useState(false);
    const timeOut = useRef(null);
    const eventHandlers = {
      onMouseOver: () => setColor(hoverColor),
      onMouseLeave: () => setColor(defaultColor),
      className: styles.icon,
    };
    const showOverlay = () => {
      if (show) {
        setShow(false);
        clearTimeout(timeOut.current);
      } else {
        setShow(true);
        timeOut.current = setTimeout(() => {
          setShow(false);
        }, 1000);
      }
    };

    return url ? (
      <SocialIcon bgColor={color} url={url} {...eventHandlers} />
    ) : (
      <OverlayTrigger
        placement="bottom"
        show={show}
        overlay={
          <Tooltip id="button-tooltip">Link copied to clipboard</Tooltip>
        }
      >
        <CopyIcon
          onClick={() => {
            copy(siteUrl);
            showOverlay();
          }}
          className={`${styles.copyIcon} ${styles.icon}`}
        />
      </OverlayTrigger>
    );
  }

  return (
    <Col className={styles.social}>
      <p>Share this page</p>
      <Col className={styles.icons}>
        <HoverIcon />
        <HoverIcon
          hoverColor="#118af5"
          url={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
        />
        <HoverIcon
          hoverColor="#4267B2"
          url={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        />
      </Col>
    </Col>
  );
}
