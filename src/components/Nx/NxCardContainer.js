const NxCardContainer = ({ header, subHeader, children, type, element, className, hideChildren = false, withoutPadding = false }) => {
  return (
    <div className={`border border-solid border-[#C8CDD4] bg-white rounded-lg w-full ${className}`}>
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-4">{element}</div>
        </>
      ) : (
        <div
          className="flex flex-col bg-[#F9F9F9] rounded-t-lg uppercase p-4 border-0 border-b border-solid border-[#C8CDD4]"
        >
          <div className="text-[16px] text-primary">{header}</div>
          <div className="text-primary text-sm">{subHeader}</div>
        </div>
      )}
      {type === "tabs" && <div className={`${withoutPadding ? "" : "p-4"}`}>{element}</div>}
      {!hideChildren && <div className={`${withoutPadding ? "" : "p-4"}`}>{children}</div>}
    </div>
  );
};

export default NxCardContainer;
