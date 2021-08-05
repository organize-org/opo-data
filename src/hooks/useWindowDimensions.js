import { useState, useEffect, useCallback } from "react";

export default function useWindowDimensions() {
  const getWindowDimensions = useCallback(() => {
    const { innerWidth: width } = window;
    return {
      width,
    };
  }, []);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getWindowDimensions]);

  return windowDimensions;
}
