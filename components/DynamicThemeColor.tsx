"use client";

import { useEffect, useState } from "react";

const themeColors = [
  // Darker Greens
  "#006400", "#004b23", "#004d00", "#003d00", "#002e00", "#001f00", "#003300",
  "#005000", "#006600", "#007700", "#005500", "#004400",
  // Darker Purples
  "#4b0082", "#301934", "#330033", "#2a002a", "#240024", "#1d001d",
  "#330066", "#33004d", "#4b004b", "#5c005c", "#660066", "#4d004d",
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
    const color = themeColors[colorIndex];

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", color);
    }

    // Update CSS variable for scrollbar
    document.documentElement.style.setProperty("--scrollbar-color", color);
  }, [colorIndex]);

  return null;
}
