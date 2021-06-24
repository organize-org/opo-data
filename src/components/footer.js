import React from "react";

import { StaticImage } from "gatsby-plugin-image";

export default function Footer() {
  return (
    <StaticImage
      className="footer"
      src="../images/footer-img.png"
      alt="footer"
      layout="fixed"
    />
  );
}
