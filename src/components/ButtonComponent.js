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
  loading = false, // Backward compatibility
}) => {
  // Gabungkan isLoading dan loading untuk backward compatibility
  const isButtonLoading = isLoading || loading;
  
  return (
    <div>
      <Button
        form={form || undefined}
        onClick={onClick}
        loading={isButtonLoading} // ← FIX: Gunakan satu variable saja
        icon={icon ? icon : null}
        className={`flex w-full justify-center ${className}`}
        type={type}
        disabled={disabled || isButtonLoading} // ← FIX: Auto disable saat loading
        htmlType={htmlType}
        size={size || "small"}
        style={{
          borderColor: `${border === false ? "#0075bf00" : "var(--primary)"}`,
          ...(fullButton ? { width: "100%" } : {}),
          backgroundColor: isPrimary && "var(--primary)",
          color: isPrimary && "#fff",
          height: "32px",
          fontSize: "12px",
          cursor: disabled || isButtonLoading ? "not-allowed" : "pointer", // ← FIX: Cursor saat loading
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