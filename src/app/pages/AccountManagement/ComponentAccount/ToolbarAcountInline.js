import React, { useMemo } from 'react';
import useGrantAccessAccountInline from './useGrantedAccessAccountInline';


const ToolbarAccountInline = ({ items = [], selector, url }) => {
  const access = useGrantAccessAccountInline({
    selector: selector,
    url: url,
  });
  const lowerCaseActionList = useMemo(
    () => access?.actions?.map((item) => item?.toLowerCase()),
    [access]
  );
  const lowerCaseItems = useMemo(
    () =>
      items?.map((item) => ({ ...item, action: item?.action?.toLowerCase() })),
    [items]
  );

  return (
    <div className="flex w-full justify-end gap-x-2">
      {lowerCaseItems?.map((item, index) => {
        if (lowerCaseActionList?.includes(item?.action)) {
          return <React.Fragment key={index}>{item?.render}</React.Fragment>;
        }
        return null;
      })}
    </div>
  );
};

export default React?.memo(ToolbarAccountInline);
