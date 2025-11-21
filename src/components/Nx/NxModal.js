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
    <div
      style={{
        padding: 6,
        background: 'white',
        boxShadow: '0px 2px 4px rgba(165, 163, 174, 0.30)',
        overflow: 'hidden',
        borderRadius: 6,
        display: 'inline-flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ width: 20, height: 20, position: 'relative' }}>
        <div
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CloseOutlined style={{ fontSize: 14 }} />
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



