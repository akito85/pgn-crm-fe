const NxCardContainer = ({
  header,
  subHeader,
  children,
  type,
  element,
  className,
  hideChildren = false,
  withoutPadding = false,
  actionElement = null,
  actions = [],
}) => {
  // Filter actions that are not table-type (only toolbar actions)
  const toolbarActions = actions.filter((a) => a.type !== "table");

  return (
    <div className={`border border-solid border-[#C8CDD4] bg-white rounded-lg w-full ${className}`}>
      {type === "profile" || type === "tab" ? (
        <>
          <div className="p-4">{element}</div>
        </>
      ) : (
        <div className="flex flex-col justify-center min-h-[50px] bg-[#F9F9F9] rounded-t-lg uppercase px-4 py-2 border-0 border-b border-solid border-[#C8CDD4]">
          <div className="flex justify-between items-center">
            {/* Left: header + subHeader */}
            <div className="flex flex-col">
              <div className="text-[16px] text-primary leading-normal">{header}</div>
              <div className="text-primary text-sm">{subHeader}</div>
            </div>

            {/* Right: actions prop + legacy actionElement */}
            <div className="flex items-center gap-2">
              {toolbarActions.map((item, index) => (
                <div key={index}>{item.render}</div>
              ))}
              {actionElement && <div>{actionElement}</div>}
            </div>
          </div>
        </div>
      )}
      {type === "tabs" && <div className={`${withoutPadding ? "" : "p-4"}`}>{element}</div>}
      {!hideChildren && <div className={`${withoutPadding ? "" : "p-4"}`}>{children}</div>}
    </div>
  );
};

export default NxCardContainer;
