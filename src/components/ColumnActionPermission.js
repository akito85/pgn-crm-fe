import { Popover, Space } from "antd";
import { useMemo } from "react";
import useGrantAccessHooks from "./useGrantAccessHooks";
import IconThreeDots from "../assets/Icon/Nx/IconThreeDots";

// render content column
export const RenderContentActions = (
  text,
  record,
  index,
  itemRender = [],
  totalLength,
  permissions = [],
  sliceColumn = "View",
  stopClickPropagation = false,
) => {

  if (totalLength > 3) {
    return (
      <div className="w-full flex justify-center items-center gap-4">
        <Popover
          trigger={"click"}
          placement="bottomRight"
          showArrow={false}
          overlayInnerStyle={{ border: "1px solid #C8CDD4" }}
          content={
            <div className="flex flex-col">
              {itemRender
                ?.filter((item) => item?.action !== sliceColumn?.toLowerCase())
                ?.map((item, index) => {
                  if (permissions?.includes(item?.action)) {
                    return item?.render(record, totalLength, index);
                  } else {
                    return null;
                  }
                })}
            </div>
          }
        >
          <div
            className="group"
            onClick={(e) => {
              if (stopClickPropagation) e.stopPropagation();
            }}
          >
            <IconThreeDots />
          </div>
        </Popover>
        <div>
          {itemRender
            ?.filter((item) => item?.action === sliceColumn?.toLowerCase())
            ?.map((item, index) => {
              if (
                permissions?.includes(sliceColumn?.toLowerCase()) === true &&
                item?.action === sliceColumn?.toLowerCase()
              ) {
                return item?.render(record, totalLength, index);
              } else {
                return null;
              }
            })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full flex justify-center gap-4 items-center">
        {itemRender?.map((item, index) => {
          if (permissions?.includes(item?.action)) {
            return item?.render(record, totalLength, index);
          } else {
            return null;
          }
        })}
      </div>
    );
  }
};

// function columns
export const useColumnActionPermission = (
  permissionList = [],
  itemsRender = [],
  sliceColumn = "View",
  type = "page",
  stopClickPropagation = false,
) => {
  const access = useGrantAccessHooks(type);
  // convert to lower case
  const lowerCaseAccessList = useMemo(
    () => access?.actions?.map((item) => item?.toLowerCase()),
    [access],
  );
  const lowerCasePermissionList = useMemo(
    () => permissionList?.map((item) => item?.toLowerCase()),
    [permissionList],
  );
  const lowerCaseItemsRender = useMemo(
    () =>
      itemsRender
        ?.map((item) => ({
          ...item,
          action: item?.action?.toLowerCase(),
        }))
        ?.filter((item) => item?.type === "table"),
    [itemsRender],
  );

  // filter access by permission list
  const arrayActions = useMemo(() => {
    const arrayActions = lowerCaseAccessList?.filter((item) =>
      lowerCasePermissionList?.includes(item),
    );

    return lowerCaseItemsRender
      ?.filter((itemRender) => {
        return arrayActions?.includes(itemRender?.action);
      })
      ?.map((itemsMap) => {
        return itemsMap?.action;
      });
  }, [lowerCaseAccessList, lowerCaseItemsRender, lowerCasePermissionList]);

  const columns = useMemo(() => {
    if (arrayActions?.length === 0) {
      return [];
    } else {
      return [
        {
          key: "action",
          title: "ACTION",
          dataIndex: "action",
          fixed: "right",
          width: 150,
          render: (text, record, index) =>
            RenderContentActions(
              text,
              record,
              index,
              lowerCaseItemsRender,
              arrayActions?.length,
              arrayActions,
              sliceColumn,
              stopClickPropagation,
            ),
        },
      ];
    }
  }, [arrayActions, lowerCaseItemsRender, sliceColumn]);

  return columns;
};
