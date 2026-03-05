import { Modal } from "antd";

const NxModal = ({
  loading = false, // ← FIX: Default value
  isOpen,
  header,
  children,
  width,
  title,
  maxHeight,
  className,
  footer = [],
  centered = true,
  closeable = false,
  handleCancel = () => { },
  handleOk = () => { },
}) => {
  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={footer}
      className={`[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:border [&_.ant-modal-content]:border-solid [&_.ant-modal-content]:border-[#C8CDD4] [&_.ant-modal-content]:rounded-lg [&_.ant-modal-body]:p-0 [&_.ant-modal-footer]:p-4 [&_.ant-modal-footer]:border-t [&_.ant-modal-footer]:border-[#C8CDD4] ${className}`}
      centered={centered}
      width={width}
      maskClosable={!loading} // ← FIX: Prevent click outside saat loading
      title={title}
      maxHeight={maxHeight}
      closable={closeable}
      confirmLoading={loading} // ← FIX: Show loading di OK button (jika ada)
    >
      <h2 className="m-0 p-4 bg-[#F5F5F5] text-base text-[#0075bf] border-0 border-b border-solid border-[#C8CDD4] uppercase">
        {header}
      </h2>
      {children}
    </Modal>
  );
};

export default NxModal;