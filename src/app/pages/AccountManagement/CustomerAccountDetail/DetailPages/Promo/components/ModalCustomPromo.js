import { Modal } from "antd";

const ModalCustomPromo = ({
  children,
  isOpen = false,
  setIsOpen = () => {},
  onCancel = () => setIsOpen(false),
  footer = null,
  width = 1000,
  closable = true,
  title = "Modal Title",
  maxHeight = "80vh",
}) => {
  return (
    <Modal
      title={title.toLocaleUpperCase()}
      open={isOpen}
      onCancel={onCancel}
      footer={footer}
      width={width}
      closable={closable}
      bodyStyle={{ maxHeight: maxHeight, overflow: "auto" }}
      className="custom-modal-header"
    >
      {children}
    </Modal>
  );
};

export default ModalCustomPromo;
