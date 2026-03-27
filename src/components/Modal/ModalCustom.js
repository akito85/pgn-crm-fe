import { Modal } from "antd";

const ModalCustom = (props) => {
  const {
    loading = false, // ← FIX: Default value
    isOpen,
    handleCancel = () => { },
    handleOk = () => { },
    header,
    children,
    width,
    type,
    footer = [],
    centered = true,
    closable = true, // ← FIX: Default true
    title,
    maxHeight,
    hidePadding = false,
  } = props;

  const typeModal = (type) => {
    switch (type) {
      case "confirmation":
        return (
          <div className="">
            {/* header section */}
            <div
              style={{ background: "#F5F5F5" }}
              className={"rounded-tl-[5px] rounded-tr-[5px] p-4"}
            >
              <div className={"flex gap-x-1.5 items-center"}>
                <span
                  style={{
                    color: "#0075bf",
                    fontWeight: "600",
                    fontSize: "14px",
                    textTransform: "uppercase"
                  }}
                >
                  {header}
                </span>
              </div>
            </div>

            {/* content section */}
            <div className={`flex flex-col w-full ${hidePadding ? "" : "p-4"} ${hidePadding?.top ? "pt-0" : ""} ${hidePadding?.bottom ? "pb-0" : ""} ${hidePadding?.right ? "pr-0" : ""} ${hidePadding?.left ? "pl-0" : ""}`}>{children}</div>
          </div>
        );
      case "detail":
        return (
          <div className="">
            {/* header section */}
            <div className={"rounded-tl-[5px] rounded-tr-[5px] p-4"}>
              <div className={"flex gap-x-1.5 items-center"}>
                <span className="text-primary uppercase font-semibold">{header}</span>
              </div>
            </div>

            {/* content section */}
            <div className={"flex flex-col w-full p-6"}>{children}</div>
          </div>
        );
      default:
        return (
          <div className="">
            {/* header section */}
            <div
              className="flex flex-col bg-[#F9F9F9] rounded-tl-[5px] rounded-tr-[5px] uppercase"
              style={{ borderBottom: "1px solid #BDBDBD", padding: "16px" }}
            >
              <span className="text-[16px] text-primary">{header}</span>
            </div>

            {/* content section */}
            <div className={`flex flex-col w-full ${hidePadding ? "" : "p-6"}`}>{children}</div>
          </div>
        );
    }
  };

  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      onCancel={loading ? undefined : handleCancel} // ← FIX: Prevent close saat loading
      footer={footer}
      className={type === 'confirmation' ? "modal-approve-reject" : "modal-custom"}
      centered={centered}
      width={width}
      maskClosable={!loading} // ← FIX: Prevent click outside saat loading
      closable={!loading && closable} // ← FIX: Hide X button saat loading
      title={title}
      maxHeight={maxHeight}
      confirmLoading={loading} // ← FIX: Show loading di OK button (jika ada)
    >
      {typeModal(type)}
    </Modal>
  );
};

export default ModalCustom;