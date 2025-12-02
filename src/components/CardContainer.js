const CardContainer = ({ header, subHeader, children, type, element }) => {
  return (
    <div className="drop-shadow-lg bg-white rounded-lg w-full my-5">
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-4">{element}</div>
        </>
      ) : (
        <div className="flex flex-col bg-[#F9F9F9] p-4 rounded-t-lg uppercase">
          <div className="text-[22px] font-bold text-primary">{header}</div>
          <div className="text-primary text-lg font-bold">{subHeader}</div>
        </div>
      )}
      {type === "tabs" && <div className="p-4">{element}</div>}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default CardContainer;
