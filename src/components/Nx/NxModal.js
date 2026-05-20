import { Modal } from "antd";

const NxModal = ({
  loading = false, // ← FIX: Default value
  isOpen,
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
      className={`[&_.ant-modal-header]:p-4 [&_.ant-modal-header]:border-0 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-solid [&_.ant-modal-header]:border-[#C8CDD4] [&_.ant-modal-title]:uppercase [&_.ant-modal-header]:bg-[#F5F5F5] [&_.ant-modal-title]:text-[#0075bf] [&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:border [&_.ant-modal-content]:border-solid [&_.ant-modal-content]:border-[#C8CDD4] [&_.ant-modal-content]:rounded-lg [&_.ant-modal-body]:p-0 [&_.ant-modal-footer]:p-4 [&_.ant-modal-footer]:border-t [&_.ant-modal-footer]:border-[#C8CDD4] ${className}`}
      centered={centered}
      width={width}
      maskClosable={!loading} // ← FIX: Prevent click outside saat loading
      title={title}
      maxHeight={maxHeight}
      closable={closeable}
      confirmLoading={loading} // ← FIX: Show loading di OK button (jika ada)
    >
      {children}
    </Modal>
  );
};

export default NxModal;