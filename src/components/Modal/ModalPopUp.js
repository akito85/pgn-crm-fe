import { Modal } from "antd";
import ButtonComponent from "../ButtonComponent";
import SVGIcon from "../../assets/Icon/index";

const ModalConfirm = ({
  isOpen,
  handleCancel = () => {},
  handleOk = () => {},
  children,
  width,
  bodyStyle,
  useOk = false,
  loading = false,
}) => {
  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className={"modal-custom"}
      centered={true}
      width={width}
      bodyStyle={{ bodyStyle }}
      maskClosable={false}
      footer={[
        <div key="footer" className={"w-full justify-end flex gap-1"}>
          <ButtonComponent type={"default"} onClick={handleCancel} disabled={loading}>
            {useOk === true ? "Back" : "Cancel"}
          </ButtonComponent>
          <ButtonComponent type={"submit"} onClick={handleOk} loading={loading}>
            {useOk === true ? "Yes" : "Confirm"}
          </ButtonComponent>
        </div>,
      ]}
    >
      <div className={"w-full p-5"}>{children}</div>
    </Modal>
  );
};
const ModalError = ({
  isOpen,
  handleCancel = () => {},
  handleOk = () => {},
  header,
  width,
  children,
  onlyBackButton = false,
  customText = "OK",
  loading = false,
}) => {
  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className={"modal-custom"}
      centered={true}
      width={width}
      maskClosable={false}
      footer={[
        <div key="footer" className={"w-full justify-end flex gap-[20px]"}>
          {onlyBackButton === true ? (
            <ButtonComponent type={"default"} onClick={handleOk} loading={loading}>
              Back
            </ButtonComponent>
          ) : (
            <ButtonComponent type={"reject"} onClick={handleOk} border={false} loading={loading}>
              {customText}
            </ButtonComponent>
          )}
        </div>,
      ]}
    >
      <div className={"w-full p-5"}>{children}</div>
    </Modal>
  );
};

const ModalSuccess = ({
  isOpen,
  handleCancel = () => {},
  handleOk = () => {},
  header,
  width = 350,
  children,
}) => {
  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <ButtonComponent key="ok" type={"submit"} onClick={handleOk} border={false}>
          OK
        </ButtonComponent>,
      ]}
      className={"modal-custom"}
      centered={true}
      width={width}
      maskClosable={false}
    >
      <div className={"flex flex-col w-full"}>
        {/* content section */}
        {children}
      </div>
    </Modal>
  );
};

const ModalAttention = ({
  isOpen,
  handleCancel = () => {},
  handleOk = () => {},
  header = "Attention",
  width,
  children,
  onlyBackButton = false,
  customText = "OK",
  textList,
}) => {
  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className={"modal-custom"}
      centered={true}
      width={450}
      maskClosable={false}
      footer={[
        <div key="footer" className={"w-full justify-end flex gap-[20px]"}>
          {onlyBackButton === true ? (
            <ButtonComponent type={"default"} onClick={handleOk}>
              Back
            </ButtonComponent>
          ) : (
            <ButtonComponent type={"reject"} onClick={handleOk} border={false}>
              {customText}
            </ButtonComponent>
          )}
        </div>,
      ]}
    >
      <div className={"w-full p-5"}>
        <div className="w-full flex gap-[20px] justify-center items-center mt-7 mb-3">
          <SVGIcon name="IconFailed" width={48} />
          <div className="flex flex-col">
            <span className={"font-bold text-lg"}>{header}</span>
            <span>Please input {textList}!</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export { ModalError, ModalSuccess, ModalConfirm, ModalAttention };
