// import React, { useState } from "react";
// import { SocialIcon } from "react-social-icons";

// export default function HoverIcon({ hoverColor, url }) {
//   const defaultColor = "#c4c4c4";
//   const [color, setColor] = useState(defaultColor);

//   const eventHandlers = {
//     onMouseOver: () => setColor(hoverColor),
//     onMouseLeave: () => setColor(defaultColor),
//     className: styles.icon,
//   };

//   return url ? (
//     <SocialIcon bgColor={color} url={url} {...eventHandlers} />
//   ) : (
//     <CopyIcon
//       onClick={() => {
//         copy(siteUrl);
//       }}
//       {...eventHandlers}
//     />
//   );
// }
