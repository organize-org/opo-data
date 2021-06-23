import React from "react";

import { graphql, useStaticQuery } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";

import { Row, Col } from "react-bootstrap";
import * as homeStyles from "./home.module.css";

export default function BridgeTest() {
  const { placeholderImage } = useStaticQuery(
    graphql`
      query {
        placeholderImage: file(relativePath: { eq: "images/home-img.png" }) {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    `
  );

  const pluginImage = getImage(placeholderImage);

  return (
    <div>
      <Row>
        <BgImage
          className={homeStyles.imgBackground}
          image={pluginImage}
          style={{
            backgroundSize: "contain",
            backgroundPosition: "",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#b00e0c",
          }}
        >
          <div>
            <Col md={{ span: 5, offset: 6 }}>
              <p className={homeStyles.quote}>
                <q>
                  An astounding lack of accountability and oversight in the
                  nation’s creaking, monopolistic organ transplant system is
                  allowing hundreds of thousands of potential organ donations to
                  fall through the cracks.
                </q>
              </p>
              <p className={homeStyles.quoteSource}>— NYT editorial board</p>
            </Col>
          </div>
        </BgImage>
      </Row>
    </div>
  );
}
