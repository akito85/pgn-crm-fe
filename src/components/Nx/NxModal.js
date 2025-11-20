import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const NxModal = (props) => {
  const {
    title,
    isOpen,
    handleCancel = () => {},
    handleOk = () => {},
    header,
    children,
    width,
    footer = []
  } = props;

  // Prevent default behavior of onOk to avoid conflicts
  const handleModalOk = (e) => {
    handleOk(e);
    // Don't let the default modal behavior interfere
  };

  return (
<Modal
  open={isOpen}
  onOk={handleModalOk}
  onCancel={handleCancel}
  footer={footer}
  centered={true}
  width={width}
  maskClosable={false}
  title={title}
  className="custom-modal"
  closeIcon={
    <div className="size-8 p-1.5 bg-white rounded-md shadow-[0px_2px_4px_0px_rgba(165,163,174,0.30)] inline-flex justify-center items-center">
      <div className="size-5 relative">
        <div className="size-5 absolute inset-0 flex items-center justify-center">
          <CloseOutlined />
        </div>
      </div>
    </div>
  }
>
  {children}
</Modal>
  )
}

export default NxModal



