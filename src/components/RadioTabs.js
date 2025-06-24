// Komponen RadioTabs yang Diperbarui
import React, { useEffect, useState } from "react";
import { Badge, Radio } from "antd";

const RadioTabs = ({
  onChange = () => { },
  data,
  onClick = () => { },
  currentPosition = "",
  disabled = false
}) => {
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(currentPosition || data[0].value);
  }, [data, currentPosition]);

  const contentBadge = () => {
    return data?.map((index, key) => {
      const radioButton = (
        <Radio.Button
          key={key}
          value={index.value}
          onClick={onClick}
          disabled={index.disabled || false}
        >
          {index.value}
        </Radio.Button>
      );
      if (index.errorBadge !== undefined) {
        return (
          <Badge key={key} count={index.errorBadge}>
            {radioButton}
          </Badge>
        );
      }
      return radioButton;
    });
  };

  return (
    <Radio.Group
      onChange={(e) => {
        onChange(e);
        if (!currentPosition) {
          setValue(e.target.value);
        }
      }}
      value={value}
      buttonStyle="solid"
      style={{ gap: 12, display: "flex" }}
      disabled={disabled}
    >
      {contentBadge()}
    </Radio.Group>
  );
};

export default RadioTabs;
