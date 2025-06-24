import { DatePicker, TreeSelect } from "antd";
import React from "react";
import moment from "moment/moment";

const UtilsTreeSelect = (props) => {
  const {
    label,
    treeData = [],
    onChange = () => {},
    value,
    disabled = false,
    placeholder,
    treeCheckable = false,
    treeCheckStrictly = false,
    filterTreeNode = () => {},
  } = props;
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
      />
    </div>
  );
};

export default UtilsTreeSelect;
