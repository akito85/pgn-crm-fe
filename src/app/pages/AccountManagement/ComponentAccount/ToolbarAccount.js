import React, { useMemo } from 'react';


const ToolbarAccount = ({  items = [], advancedAccess=[] }) => {
    const access = advancedAccess
    const lowerCaseActionList = useMemo(() => access?.actionList?.map(item => item?.name?.toLowerCase()), [access]);
    const lowerCaseItems = useMemo(() => items?.map(item => ({ ...item, action: item?.action?.toLowerCase() })), [items]);

    return (
        <div className="flex w-full justify-end gap-x-2">
            {
                lowerCaseItems?.map((item, index) => {                    
                    if (lowerCaseActionList?.includes(item?.action)) {
                        return <React.Fragment key={index}>{item?.render}</React.Fragment>;
                    }
                    return null;
                })
            }
        </div>
    );
}

export default React?.memo(ToolbarAccount);
