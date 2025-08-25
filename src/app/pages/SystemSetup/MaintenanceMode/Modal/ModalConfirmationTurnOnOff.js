import { Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  LoadCanvasTemplate,
  loadCaptchaEnginge,
  validateCaptcha,
} from "react-simple-captcha";
import {
  createMaintenanceMode,
  updateMaintenanceMode,
} from "../../../../../redux/slices/system_setup/maintenanceMode";
import { formMessageRequired } from "../../../../../utils";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import SVGIcon from "../../../../../assets/Icon/index";

const ModalConfirmationTurnOnOff = ({
  isOpen = false,
  switchValue,
  bodyData,
  setBodyData = () => {},
  handleCancel = () => {},
  handleReset = () => {},
  setSwitchValue = () => {},
}) => {
  // Declaration
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Use State
  const [description, setDescription] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [failedCaptcha, setfailedCaptcha] = useState(false);

  //Use Effect
  useEffect(() => {
    if (isOpen) {
      loadCaptchaEnginge(8);
    }
  }, [isOpen]);

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
    setfailedCaptcha(false);
  };

  const handleCancelModal = () => {
    form.resetFields();
    setDescription("");
    handleCancel();
  };

  const onFinish = (formValue) => {
    let body;
    if (bodyData?.value) {
      body = {
        remarkOn: formValue?.remark,
      };
    } else {
      body = {
        remarkOff: formValue?.remark,
        id: bodyData?.maintenanceModeId,
      };
    }
    if (validateCaptcha(formValue.captcha)) {
      if (bodyData?.value) {
        dispatch(createMaintenanceMode(body))
          .unwrap()
          .then(() => {
            setSwitchValue(!bodyData?.value);
            handleCancelModal();
            handleReset();
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error?.response &&
                  error?.response?.data &&
                  error?.response?.data?.message) ||
                error?.message ||
                error?.toString();
              setBodyError({ message, value: {} });
              setModalError(true);
            }
          });
        console.log(body);
      } else {
        dispatch(updateMaintenanceMode(body))
          .unwrap()
          .then(() => {
            setSwitchValue(!bodyData?.value);
            handleCancelModal();
            handleReset();
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error?.response &&
                  error?.response?.data &&
                  error?.response?.data?.message) ||
                error?.message ||
                error?.toString();
              setBodyError({ message, value: {} });
              setModalError(true);
            }
          });
        console.log(body);
      }
    } else {
      form.resetFields(["captcha"]);
      setfailedCaptcha(true);
      setModalError(true);
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={608}
      handleCancel={handleCancelModal}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancelModal}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            form={"formId"}
            htmlType={"submit"}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <p className="text-primary text-xs font-bold uppercase pt-[5px]">
        {"TURN ON INFORMATION"}
      </p>
      <Form
        id="formId"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError={true}
      >
        <div className="w-full grid grid-cols-1 gap-[30px]">
          <div>
            <Form.Item
              label={"Remark"}
              rules={formMessageRequired("Remark")}
              name={"remark"}
            >
              <InputComponent
                type="textarea"
                rows={1}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Security Text" className={"mt-9"}>
              <div className={"flex justify-between mt-4 w-full  item-center"}>
                <div className={"w-full"}>
                  <Form.Item
                    name="captcha"
                    rules={[
                      {
                        required: true,
                        message: "Please input captcha!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter the shown text"
                      className="bg-transparent text-base"
                      style={{ borderRadius: "9px" }}
                      size="large"
                    />
                  </Form.Item>
                </div>
                <div className="flex justify-end  ">
                  <LoadCanvasTemplate reloadText="Reload" cla />
                </div>
              </div>
            </Form.Item>
            <div className="w-full flex flex-cols justify-center items-center gap-8 px-8">
              <SVGIcon
                name={"IconAlertTriangle"}
                color={"#F2AC57"}
                width={53}
              />
              <div className="w-full flex flex-cols">
                <p className="text-xs text-[#F2AC57]">
                  <span className="font-semibold">Warning! </span>
                  Turning on maintenance mode will prevent users from accessing
                  the application. This mode will last as long as it has not
                  been turned off. You can turn it off manually on this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <ModalError
        isOpen={modalError}
        handleOk={handleCloseModalError}
        handleCancel={handleCloseModalError}
        onlyBackButton={true}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          {failedCaptcha === true ? (
            <p className={"pl-[70px]"}>Captcha Does Not Match</p>
          ) : (
            <div>
              <p className="pl-[70px]">{`Your data was not
               "created". ${bodyError.message}.`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          )}
        </div>
      </ModalError>
    </ModalCustom>
  );
};

export default ModalConfirmationTurnOnOff;
