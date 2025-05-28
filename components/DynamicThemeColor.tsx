"use client";

import { useEffect, useState } from "react";

const themeColors = [
  "#006400", // Dark Green
  "#004b23", // Even darker green
  "#4b0082", // Indigo / dark purple
  "#301934", // Very dark purple
];

export default function DynamicThemeColor() {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % themeColors.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeColors[colorIndex]);
    }
  }, [colorIndex]);

  return null; // This component doesn't render anything visible
}
