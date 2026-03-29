import { TreeSelect } from "antd";
import React from "react";

const UtilsTreeSelect = ({
  label,
  treeData = [],
  onChange = () => {},
  value,
  disabled = false,
  placeholder,
  treeCheckable = false,
  treeCheckStrictly = false,
  filterTreeNode = () => {},
  ...restProps
}) => {
  const wrapper = "flex flex-col";
  const style = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    // padding: "4px 12px",
  };

  return (
    <div className={wrapper}>
      <TreeSelect
        showSearch
        treeData={treeData}
        onChange={onChange}
        treeCheckable={treeCheckable}
        treeCheckStrictly={treeCheckStrictly}
        disabled={disabled}
        style={style}
        value={value}
        filterTreeNode={filterTreeNode}
        {...restProps}
      />
    </div>
  );
};

export default UtilsTreeSelect;
