import { Popover, Skeleton } from "antd";
import { useMemo, useState } from "react";
import useGrantAccessHooks from "./useGrantAccessHooks";
import IconThreeDots from "../assets/Icon/Nx/IconThreeDots";

// render content column
export const RenderContentActions = ({
  record,
  itemRender = [],
  totalLength,
  permissions = [],
  sliceColumn = "View",
  stopClickPropagation = false,
}) => {
  const [open, setOpen] = useState(false);

  if (totalLength > 3) {
    return (
      <div className="w-full flex justify-center items-center gap-2.5">
        <Popover
          open={open}
          onOpenChange={setOpen}
          trigger={"click"}
          placement="bottomRight"
          showArrow={false}
          overlayInnerStyle={{ border: "1px solid #C8CDD4" }}
          className="text-black transition-colors duration-300 hover:text-[#0075bf]"
          content={
            <div className="flex flex-col">
              {itemRender
                ?.filter((item) => item?.action !== sliceColumn?.toLowerCase())
                ?.sort((a, b) => (a?.action || "").localeCompare(b?.action || ""))
                ?.map((item, index) => {
                  if (permissions?.includes(item?.action)) {
                    return (
                      <div key={item.action} className="inline-flex items-center text-black" onClick={() => setOpen(false)}>
                        {item?.render(record, totalLength, index)}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
            </div>
          }
        >
          <div
            className="inline-flex items-center cursor-pointer"
            onClick={(e) => {
              if (stopClickPropagation) e.stopPropagation();
            }}
          >
            <IconThreeDots />
          </div>
        </Popover>
        <div className="inline-flex items-center">
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
      <div className="w-full flex justify-center gap-2.5 items-center">
        {itemRender?.map((item, index) => {
          if (permissions?.includes(item?.action)) {
            return (
              <span key={item.action} className="inline-flex items-center">
                {item?.render(record, totalLength, index)}
              </span>
            );
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
  const isLoading = access?.loading;
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
    if (isLoading) {
      return [
        {
          key: "action",
          title: "ACTION",
          dataIndex: "action",
          fixed: "right",
          width: 111,
          render: () => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", transform: "scaleY(0.55)", transformOrigin: "center" }}>
                <Skeleton.Button active size="small" shape="round" block />
              </div>
            </div>
          ),
        },
      ];
    }
    if (!arrayActions || arrayActions.length === 0) {
      return [];
    }
    return [
      {
        key: "action",
        title: "ACTION",
        dataIndex: "action",
        fixed: "right",
        width: 90,
        render: (text, record, index) => (
          <RenderContentActions
            text={text}
            record={record}
            index={index}
            itemRender={lowerCaseItemsRender}
            totalLength={arrayActions.length}
            permissions={arrayActions}
            sliceColumn={sliceColumn}
            stopClickPropagation={stopClickPropagation}
          />
        ),
      },
    ];
  }, [isLoading, arrayActions, lowerCaseItemsRender, sliceColumn, stopClickPropagation]);

  return columns;
};
