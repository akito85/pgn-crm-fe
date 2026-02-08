import React from "react";
import { Dropdown, Space, Tooltip } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ButtonComponent from "../ButtonComponent";
import SVGIcon from "../../assets/Icon/index";

const NxDropdownMenu = ({ 
  items = [], 
  record = null, 
  type = "table",
  threshold = 3,
  iconStyle = "vertical",
  showText = false
}) => {
  // Filter items based on type
  const filteredItems = items.filter(item => 
    type ? item.type === type : !item.type
  );

  const dataLength = filteredItems.length;

  // If no items, return null
  if (dataLength === 0) return null;

  // If items are less than or equal to threshold, render them inline
  if (dataLength <= threshold) {
    return (
      <Space size="small">
        {filteredItems.map((item, index) => (
          <div key={`${item.action}-${index}`}>
            {typeof item.render === 'function' 
              ? item.render(record, dataLength)
              : item.render
            }
          </div>
        ))}
      </Space>
    );
  }

  // Convert items to Ant Design menu items format
  // Each render function returns the full Link/ButtonComponent structure
  const menuItems = filteredItems.map((item, index) => ({
    key: `${item.action}-${index}`,
    label: typeof item.render === 'function' 
      ? item.render(record, dataLength)
      : item.render,
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomRight"
      overlayStyle={{ minWidth: '200px' }}
    >
      <ButtonComponent
        icon={
          <MoreOutlined 
            rotate={iconStyle === "vertical" ? 90 : 0}
            style={{ fontSize: "20px" }} 
          />
        }
        border={false}
        type="text"
      >
        {showText && "Actions"}
      </ButtonComponent>
    </Dropdown>
  );
};

export default NxDropdownMenu;
