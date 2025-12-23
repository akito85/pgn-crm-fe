const CardContainer = ({ header, subHeader, children, type, element }) => {
  return (
    <div className="drop-shadow-lg bg-white rounded-lg w-full my-5">
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-3">{element}</div>
        </>
      ) : (
        <div
          className="flex flex-col bg-[#F9F9F9] p-3 rounded-t-lg uppercase"
          style={{ borderBottom: "1px solid #BDBDBD" }}
        >
          <div className="text-[16px] font-bold text-primary">{header}</div>
          <div className="text-primary text-sm font-bold">{subHeader}</div>
        </div>
      )}
      {type === "tabs" && <div className="p-3">{element}</div>}
      <div className="p-3">{children}</div>
    </div>
  );
};

export default CardContainer;
