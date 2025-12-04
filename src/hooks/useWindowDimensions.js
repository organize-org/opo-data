import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width } =
    typeof window !== "undefined" ? window : { innerWidth: 1920 };
  return { width };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
