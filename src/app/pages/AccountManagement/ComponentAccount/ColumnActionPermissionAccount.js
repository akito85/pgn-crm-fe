import { MoreOutlined } from "@ant-design/icons";
import { Popover, Space } from "antd";
import { useMemo } from "react";

// render content column
export const RenderContentActions = (
  text,
  record,
  index,
  itemRender = [],
  totalLength,
  permissions = [],
  sliceColumn = "View",
) => {
  if (totalLength > 3) {
    return (
      <div className="w-full flex justify-center items-center gap-4">
        <Popover
          trigger={"click"}
          placement="bottomRight"
          content={
            <Space direction="vertical">
              {itemRender
                ?.filter((item) => item?.action !== sliceColumn?.toLowerCase())
                ?.map((item) => {
                  if (permissions?.includes(item?.action)) {
                    return item?.render(record, totalLength);
                  }
                })}
            </Space>
          }
        >
          <div className="pt-1">
            <MoreOutlined
              style={{
                fontSize: "24px",
                color: "#0075bf",
                cursor: "pointer",
              }}
            />
          </div>
        </Popover>
        <div className="pt-1">
          {itemRender
            ?.filter((item) => item?.action === sliceColumn?.toLowerCase())
            ?.map((item) => {
              if (
                permissions?.includes(sliceColumn?.toLowerCase()) === true &&
                item?.action === sliceColumn?.toLowerCase()
              ) {
                return item?.render(record, totalLength);
              }
            })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full flex justify-center gap-4 mt-1 items-start">
        {itemRender?.map((item) => {
          if (permissions?.includes(item?.action)) {
            return item?.render(record, totalLength);
          }
        })}
      </div>
    );
  }
};

// function columns
export const useColumnActionPermissionAccount = (
  permissionList = [],
  itemsRender = [],
  accessAccount,
  sliceColumn = "View",
  permissionMapping = {} // Optional: map action names to permission names, e.g. { CreateAddon: "Update", CreateAmendment: "Update" }
) => {
  const access = accessAccount
  // convert to lower case
  const lowerCaseAccessList = useMemo(
    () => access?.actionList?.map((item) => item?.name?.toLowerCase()),
    [access]
  );
  const lowerCasePermissionList = useMemo(
    () => permissionList?.map((item) => item?.toLowerCase()),
    [permissionList]
  );

  // Convert permission mapping to lowercase
  const lowerCasePermissionMapping = useMemo(() => {
    const result = {};
    Object.keys(permissionMapping).forEach(key => {
      result[key.toLowerCase()] = permissionMapping[key].toLowerCase();
    });
    return result;
  }, [permissionMapping]);

  const lowerCaseItemsRender = useMemo(
    () =>
      itemsRender
        ?.map((item) => ({
          ...item,
          action: item?.action?.toLowerCase(),
        }))
        ?.filter((item) => item?.type === "table"),
    [itemsRender]
  );

  // filter access by permission list
  const arrayActions = useMemo(() => {
    // Get actions that user has permission for
    const grantedPermissions = lowerCaseAccessList?.filter((item) =>
      lowerCasePermissionList?.includes(item)
    ) || [];

    return lowerCaseItemsRender
      ?.filter((itemRender) => {
        const actionName = itemRender?.action;
        // Check if action has a permission mapping, if so use the mapped permission
        const requiredPermission = lowerCasePermissionMapping[actionName] || actionName;
        return grantedPermissions?.includes(requiredPermission);
      })
      ?.map((itemsMap) => {
        return itemsMap?.action;
      });
  }, [lowerCaseAccessList, lowerCaseItemsRender, lowerCasePermissionList, lowerCasePermissionMapping]);

  const columns = useMemo(() => {
    if (arrayActions?.length === 0) {
      return [];
    } else {
      return [
        {
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
            ),
        },
      ];
    }
  }, [arrayActions, lowerCaseItemsRender, sliceColumn]);

  return columns;
};
