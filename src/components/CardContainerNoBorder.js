const CardContainerNoBorder = ({ header, subHeader, children, type, element, className, noPadding }) => {
  return (
    <div className={`drop-shadow-lg bg-white rounded-lg w-full my-2 ${className}`}>
      {type === "profile" || type === "tab" ? (
        <>
          <div style={{ padding: "16px" }}>{element}</div>
        </>
      ) : type === "tabs" ? (
        <>
          <div
            className="flex flex-col bg-[#F9F9F9] rounded-t-lg uppercase"
            style={{ borderBottom: "1px solid #BDBDBD", padding: "16px" }}
          >
            <div className="text-[16px] text-primary">{header}</div>
            <div className="text-primary text-sm">{subHeader}</div>
          </div>
          <div style={{ padding: "12px 16px 0 16px" }}>{element}</div>
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
      <div style={{ padding: noPadding ? "0px" : "12px" }}>
        <div
          style={{
            border: "none",
            borderRadius: "8px",
            padding: "0px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardContainerNoBorder;
