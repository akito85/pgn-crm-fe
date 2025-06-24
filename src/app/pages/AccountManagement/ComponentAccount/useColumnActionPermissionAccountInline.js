import { MoreOutlined } from "@ant-design/icons";
import { Popover, Space } from "antd";
import { useMemo } from "react";
import useGrantAccessAccountInline from "./useGrantedAccessAccountInline";
import ButtonComponent from "../../../../components/ButtonComponent";

// render content column
export const RenderContentActions = (
  text,
  record,
  index,
  itemRender = [],
  totalLength,
  permissions = [],
  sliceColumn = "View",
  editingKey,
  save = () => {},
  cancel = () => {},
) => {
  const editable = record.key === editingKey;
  return editable ? (
    <div className="flex justify-center w-full gap-4 p-4">
      <ButtonComponent onClick={() => cancel(record)} type="default">
        Cancel
      </ButtonComponent>
      <ButtonComponent onClick={() => save(record.key)} type="submit">
        Save
      </ButtonComponent>
    </div>
  ) : totalLength > 3 ? (
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
  ) : (
    <div className="w-full flex justify-center gap-4 mt-1 items-start">
      {itemRender?.map((item) => {
        if (permissions?.includes(item?.action)) {
          return item?.render(record, totalLength);
        }
      })}
    </div>
  );
  

};

// function columns
export const useColumnActionPermissionAccountInline = (
  editingKey,
  path = "", //url
  selector = "general", //for what menu
  permissionList = [],
  itemsRender = [],
  save = () => {},
  cancel = () => {},
  sliceColumn = "View"
) => {
  const access = useGrantAccessAccountInline({
    selector: selector,
    url: path,
  });
  // convert to lower case
  const lowerCaseAccessList = access?.actions?.map((item) => item?.toLowerCase())

  const lowerCasePermissionList = useMemo(
    () => permissionList?.map((item) => item?.toLowerCase()),
    [permissionList]
  );
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
    const arrayActions = lowerCaseAccessList?.filter((item) =>
      lowerCasePermissionList?.includes(item)
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
          title: "ACTION",
          dataIndex: "action",
          fixed: "right",
          width: editingKey ? 240 : 150,
          render: (text, record, index) =>
            RenderContentActions(
              text,
              record,
              index,
              lowerCaseItemsRender,
              arrayActions?.length,
              arrayActions,
              sliceColumn,
              editingKey,
              save,
              cancel,
            ),
        },
      ];
    }
  }, [arrayActions, lowerCaseItemsRender, sliceColumn]);

  return columns;
};
