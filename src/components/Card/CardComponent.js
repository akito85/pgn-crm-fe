import React from "react";

const CardComponent = (props) => {
  const { header, children, cols } = props;
  return (
    <div className="bg-detail p-4 mb-3 rounded-md">
      {header && (
        <div className="text-primary text-xs font-semibold uppercase pb-[30px]">
          {header}
        </div>
      )}
      <div className={`grid grid-cols-${cols} gap-y-2.5 gap-x-2 py-1`}>
        {children}
      </div>
    </div>
  );
};

export default CardComponent;
