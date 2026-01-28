const CardContainer = ({ header, subHeader, children, type, element, className }) => {
  return (
    <div className={`drop-shadow-lg bg-white rounded-lg w-full my-2 ${className}`}>
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
      {type === "tabs" && <div className="p-3">{element}</div>}
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
};

export default CardContainer;
