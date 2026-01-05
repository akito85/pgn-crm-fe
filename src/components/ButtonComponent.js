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
  fontSizeClassname = "text-[12px]",
  className,
  fullButton = false,
  isPrimary = false,
  loading = false,
}) => {
  return (
    <div>
      <Button
        form={form || undefined}
        onClick={onClick}
        icon={icon ? icon : null}
        className={`flex w-full justify-center ${className}`}
        type={type}
        disabled={disabled}
        htmlType={htmlType}
        size={size || "small"}
        loading={loading}
        style={{
          borderColor: `${border === false ? "#0075bf00" : "var(--primary)"}`,
          ...(fullButton ? { width: "100%" } : {}),
          backgroundColor: isPrimary && "var(--primary)",
          color: isPrimary && "#fff",
          height: "32px",
          fontSize: "12px",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <div
          className={
            children ? `py-0.5 px-1 ${fontSizeClassname} text-center` : ``
          }
        >
          {children}
        </div>
      </Button>
    </div>
  );
};

export default ButtonComponent;
