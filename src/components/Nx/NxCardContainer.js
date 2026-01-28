const NxCardContainer = ({ header, subHeader, children, type, element, className, hideChildren = false, withoutTopPadding = false }) => {
  return (
    <div className={`drop-shadow-lg bg-white rounded-lg w-full my-2 ${className}`}>
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-4">{element}</div>
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
      {type === "tabs" && <div className={`p-4 ${withoutTopPadding ? "pt-0" : ""}`}>{element}</div>}
      {!hideChildren && <div className={`p-4 ${withoutTopPadding ? "pt-0" : ""}`}>{children}</div>}
    </div>
  );
};

export default NxCardContainer;
