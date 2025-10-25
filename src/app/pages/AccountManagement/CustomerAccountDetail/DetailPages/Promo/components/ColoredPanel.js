import React from "react";

/**
 * ColoredPanel
 * A simple reusable wrapper that renders a full-width rounded panel
 * with a soft background color (#E6F1F9) and default padding.
 * Props:
 * - children: node
 * - className: string (optional) additional classes
 * - style: object (optional) additional inline styles
 */
const ColoredPanel = ({ children, className = "", style = {} }) => {
  const defaultStyle = {
    backgroundColor: "#E6F1F9",
    borderRadius: 8,
    width: "100%",
    padding: 16,
    boxSizing: "border-box",
  };

  return (
    <div
      className={`colored-panel ${className}`}
      style={{ ...defaultStyle, ...style }}
    >
      {children}
    </div>
  );
};

export default ColoredPanel;
