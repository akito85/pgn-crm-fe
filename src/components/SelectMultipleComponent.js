import { Select, Tag } from "antd";
import React from "react";
import InputLabel from "./InputLabel";

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={"#0075bf"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const SelectMultipleComponent = (props) => {
  const { onChange = () => {}, options = [], label, mandatory, group } = props;
  return (
    <div className="flex flex-col w-auto">
      {!group ? <InputLabel text={label} mandatory={mandatory} /> : null}
      <Select
        mode="multiple"
        showArrow
        allowClear
        tagRender={tagRender}
        options={options}
        onChange={onChange}
      />
    </div>
  );
};

export default SelectMultipleComponent;
