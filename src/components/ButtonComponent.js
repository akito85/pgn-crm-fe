import React from "react";
import { Button } from "antd";

const ButtonComponent = ({
  disabled,
  children,
  icon,
  isLoading = false,
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
  directChildren = false,
}) => {
  const isButtonLoading = isLoading || loading;
  
  return (
    <div>
      <Button
        form={form || undefined}
        onClick={onClick}
        loading={isButtonLoading}
        icon={icon ? icon : null}
        className={`flex w-full justify-center ${className}`}
        type={type}
        disabled={disabled || isButtonLoading}
        htmlType={htmlType}
        size={size || "small"}
        style={{
          borderColor: border === false ? "#0075bf00" : undefined,
          ...(fullButton ? { width: "100%" } : {}),
          backgroundColor: isPrimary && "var(--primary)",
          color: isPrimary && "#fff",
          height: "32px",
          fontSize: "12px",
          cursor: disabled || isButtonLoading ? "not-allowed" : "pointer", // ← FIX: Cursor saat loading
        }}
      >
        { directChildren ? children : (
          <div
            className={
              children ? `py-0.5 px-1 ${fontSizeClassname} text-center` : ``
            }
          >
            {children}
          </div>
        )}
      </Button>
    </div>
  );
};

export default ButtonComponent;