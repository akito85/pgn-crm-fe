const CardContainer = ({ header, subHeader, children, type, element }) => {
  return (
    <div className="drop-shadow-lg bg-white rounded-lg w-full my-2">
      {type === "profile" || type === "tab" ? (
        <>
          <div style={{ padding: "16px" }}>{element}</div>
        </>
      ) : (
        <div
          className="flex flex-col bg-[#F9F9F9] rounded-t-lg uppercase"
          style={{ borderBottom: "1px solid #BDBDBD", padding: "16px" }}
        >
          <div className="text-[16px] text-primary">{header}</div>
          <div className="text-primary text-sm">{subHeader}</div>
        </div>
      )}
      {type === "tabs" && (
        <div style={{ padding: "12px 16px 0 16px" }}>{element}</div>
      )}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            border: "1px solid #C8CDD4",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
