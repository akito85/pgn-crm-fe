import React from "react";

const ColoredPanel = ({ title, children, style = {} }) => {
  return (
    <div
      style={{
        borderRadius: "8px",
        backgroundColor: "#F9FAFB",
        border: "1px solid #EAECF0",
        width: "100%",
        ...style,
      }}
    >
      {/* HEADER */}
      {title && (
        <div
          style={{
            padding: "12px 16px",
            fontWeight: 600,
            color: "#1570EF",
            textTransform: "uppercase",
            borderBottom: "1px solid #EAECF0",
          }}
        >
          {title}
        </div>
      )}

      {/* CONTENT */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ColoredPanel;
