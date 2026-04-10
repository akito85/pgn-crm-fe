import ModalCustom from "../../../../../../../components/Modal/ModalCustom";

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
  const renderHeader = () => {
    if (typeof title === 'string') {
      return title.toLocaleUpperCase();
    }
   return title;
  };

  return (
    <ModalCustom
      header={renderHeader()} // Gunakan fungsi renderHeader
      isOpen={isOpen}
      handleCancel={onCancel}
      footer={footer}
      width={width}
      closable={closable}
      bodyStyle={{ maxHeight: maxHeight, overflow: "auto" }}
      className="custom-modal-header"
    >
      {children}
    </ModalCustom>
  );
};

export default ModalCustomPromo;