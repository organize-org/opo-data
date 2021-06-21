import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import * as homeStyles from "../components/home/home.module.css";

export default function HomeImage() {
  return (
    <div className={homeStyles.imgBackground}>
      <StaticImage src="../images/home-img.png" alt="sick man" />
    </div>
  );
}
