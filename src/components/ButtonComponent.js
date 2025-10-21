import React from "react";
import { Button } from "antd";

const ButtonComponent = ({
  disabled,
  children,
  icon,
  onClick = () => {},
  type,
  border,
  htmlType,
  size,
  form,
  fontSizeClassname = "text-[18px]",
  className,
  fullButton = false,
  customBg,
}) => {
  return (
    <div>
      <Button
        // size="large"
        form={form || undefined}
        onClick={onClick}
        icon={icon ? icon : null}
        className={`flex w-full justify-center ${className}`}
        type={type}
        disabled={disabled}
        htmlType={htmlType}
        size={size || "middle"}
        style={{
          borderColor: `${border === false ? "#0075bf00" : "var(--primary)"}`,
          ...(fullButton ? {width: "100%"} :  {}),
          ...(customBg ? {backgroundColor: customBg} : {}),
        }}
      >
        <div className={children ? `p-1 ${fontSizeClassname} text-center` : ``}>
          {children}
        </div>
      </Button>
    </div>
  );
};

export default ButtonComponent;
