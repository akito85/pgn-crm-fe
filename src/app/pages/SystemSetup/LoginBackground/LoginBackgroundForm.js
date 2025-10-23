import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { Button, Form, Upload, Image, Spin } from "antd";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import { UploadOutlined, LeftOutlined } from "@ant-design/icons";
import DateComponent from "../../../../components/DateComponent";
import InputComponent from "../../../../components/InputComponent";
import moment from "moment";
import {
  formMessageRequired,
  hasValue,
  renderDateConverter,
} from "../../../../utils";
import { getBase64 } from "../../../../utils/getBase64";
import { useSelector, useDispatch } from "react-redux";
import ModalBack from "../../../../components/Modal/ModalBack";
import {
  createBackground,
  getDetailBackground,
  updateBackground,
} from "../../../../redux/slices/system_setup/login_background";
import { checkAllowingFile } from "../../../../redux/slices/system_setup/entity";
import ModalConfirmationLoginBackground from "./Modal/ModalConfirmationLoginBackground";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../redux/services/userHttpService";
const { Dragger } = Upload;

const LoginBackgroundForm = ({ type }) => {
  const { loading, detail_Background } = useSelector(
    (state) => state.login_background
  );
  const { allow_file } = useSelector((state) => state.entity);
  const { bodyError, isLoading } = useSelector(state => state?.general);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;

  const [form] = Form.useForm();
  const [flag, setFlag] = useState(false);
  const [bodyData, setBodyData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [acceptExtension, setAcceptExtension] = useState("");
  const formValue = form.getFieldsValue();
  const [validateFile, setValidateFile] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const [modalBack, setModalBack] = useState(false);
  const [startDate, setStartDate] = useState();
  const [payload, setPayload] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_LOGIN_BACKGROUND,
      breadcrumbName: "Login Background",
    },
    {
      path: "",
      breadcrumbName: `${type === "create"
        ? "Create Login Background"
        : "Update Login Background"
        }`,
    },
  ];

  useEffect(() => {
    dispatch(checkAllowingFile());
    if (id && type === "update") {
      dispatch(getDetailBackground(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (id && type === "update") {
      form.setFieldsValue({
        backgroundName: detail_Background?.backgroundName,
        startDate: detail_Background?.startDate
          ? moment(detail_Background?.startDate)
          : undefined,
        endDate: detail_Background?.endDate
          ? moment(detail_Background?.endDate)
          : undefined,
        description: detail_Background?.description,
        image: detail_Background.urlLogo2
          ? detail_Background?.urlLogo2
          : undefined,
        urlImage: detail_Background?.urlLogo2,
      });
    }
    setAcceptExtension(
      allow_file?.data?.fileExt
        ?.toLowerCase()
        ?.split(",")
        ?.map((item) => `.${item}`)
        ?.join(", ")
    );
    setStartDate(moment(detail_Background?.startDate));
    setFileList([]);
  }, [form, detail_Background, type, allow_file]);

 
  const handleStartDate = (e) => {
    if (e === null || e === undefined) {
      setStartDate(e);
    } else {
      setStartDate(moment(e));
    }
  };

  const handleDisableEndDate = (current) => {
    if (hasValue(formValue?.startDate)) {
      return current && current < moment(formValue?.startDate).startOf("day");
    } else {
      return current && current < moment().startOf("day");
    }
  };

  const getFileExtension = (file) => {
    return file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2)?.toLowerCase();
  };

  const handleCloseModalError = () => {
    setModalConfirm(false);

  };

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === 'CREATE_BACKGROUND') {
      dispatch(createBackground(payload?.body))
    } else if (bodyError?.action === 'UPDATE_BACKGROUND') {
      dispatch(updateBackground(payload?.body))
    } else if (bodyError?.action === 'VALIDATE_CREATE_UPDATE') {
      dispatch(validateCreateUpdate(payload?.validateValue))
    } else {
      dispatch(getDetailBackground(id))
    }
    handleCloseModalError();
  };

  const handleClear = () => {
    form.resetFields();
    setFileList([]);
    if (type === "create") {
      form.resetFields();
    } else {
      setBase64Image("");
      dispatch(getDetailBackground(id));
      setFileList([]);
      setFileName("");
    }
  };

  const handleChange = ({ fileList }) => {
    if (validateFile) {
      setFileList(fileList);
    } else {
      setFileList([]);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setPreviewImage("");
    setFileName("");
    setBase64Image("");
  };

  const onFinish = async (formValue) => {
    try {
      let body;
      let validateValueObj;
      const image = base64Image.split(",")[1];
      setBodyData({
        backgroundName: formValue.backgroundName,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        description: formValue.description,
        imageBackground: image,
        fileName: fileName,
        urlImage: formValue?.urlImage,
      });

      if (type === 'update') {
        body = {
          backgroundName: formValue.backgroundName,
          startDate: hasValue(formValue.startDate) ? renderDateConverter(formValue?.startDate, 'date') : null,
          endDate: hasValue(formValue.endDate) ? renderDateConverter(formValue.endDate, 'date') : null,
          description: formValue.description,
          imageBackground: image,
          fileName: fileName,
          urlImage: formValue?.urlImage,
          loginBackgroundId: type === "update" ? id : undefined,
        }
        validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/background/validate-update', type }
      } else {
        body = {
          backgroundName: formValue.backgroundName,
          startDate: hasValue(formValue.startDate) ? renderDateConverter(formValue?.startDate, 'date') : null,
          endDate: hasValue(formValue.endDate) ? renderDateConverter(formValue.endDate, 'date') : null,
          description: formValue.description,
          imageBackground: image,
          fileName: fileName,
          urlImage: formValue?.urlImage,
        }
        validateValueObj = { body: body, services: userHttpService, endPoint: '/v1/dbs/api/background/validate-create', type }
      }

      setPayload({
        body: body,
        validateValue: validateValueObj
      });
      await dispatch(validateCreateUpdate(validateValueObj))?.unwrap()
      setModalConfirm(true);
    } catch (error) {
      setModalConfirm(false);

    }
  };

  const handleConfirm = async () => {
    try {
      setModalConfirm(false)
      if (type === "create") {
        await dispatch(createBackground(payload?.body))?.unwrap()
      } else {
        await dispatch(updateBackground(payload?.body))?.unwrap()
      }
    } catch (error) {
      setModalConfirm(false)

    }
  };
  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
  return (
    <LayoutMenu>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        // onFinishFailed={handleError}
        >
          <BaseContainer
            header={
              type === "create"
                ? "Create Login Background"
                : "Update Login Background"
            }
          >
            <div className={"w-full flex flex-col"}>
              <div className="w-auto grid grid-cols-2 gap-10">
                <Form.Item
                  name={"backgroundName"}
                  rules={formMessageRequired("Background Name")}
                  label={"Login Background Name"}
                  className={"w-full"}
                >
                  <InputComponent type="text" disabled={type === "update"} />
                </Form.Item>
                <Form.Item
                  label={"Upload File:"}
                  name={"image"}
                  rules={formMessageRequired(
                    "logo",
                    fileList?.length > 0 && detail_Background?.data?.logo !== null
                      ? false
                      : true
                  )}
                  className={"w-full"}
                // getValueFromEvent={getFile}
                >
                  <Upload
                    fileList={fileList}
                    accept={acceptExtension}
                    listType="picture"
                    beforeUpload={async (file) => {
                      const allowed_file = allow_file?.data?.fileExt
                        ?.toLowerCase()
                        ?.split(",");
                      const file_extension = getFileExtension(file?.name);
                      const max_allowed_file = allow_file?.data?.size;
                      const fileInMb = file.size / (1024 * 1024);
                      if (
                        allowed_file?.includes(file_extension) &&
                        fileInMb < max_allowed_file
                      ) {
                        setValidateFile(true);
                        setFileName(file?.name);
                        const base64 = await getBase64(file);
                        const regex = "";
                        setBase64Image(base64.replace(regex, ""));
                        setFileList([...fileList, { ...file, percent: 0 }]);
                      } else {
                        if (allowed_file?.includes(file_extension) === false) {
                          setValidateFile(false);
                          const errorBody = {
                            title: "Failed",
                            description: `Format file not valid`,
                          };
                          dispatch(showModalError(errorBody));
                        }
                        if (
                          allowed_file?.includes(file_extension) === true &&
                          fileInMb > max_allowed_file
                        ) {
                          setValidateFile(false);
                          const errorBody = {
                            title: "Failed",
                            description: `File size not valid, file too large!`,
                          };
                          dispatch(showModalError(errorBody));
                        }
                      }
                      return false;
                    }}
                    onChange={handleChange}
                    onRemove={handleRemove}
                    className="w-full"
                    maxCount={1}
                  >
                    <div className="w-full">
                      <Button
                        icon={<UploadOutlined style={{ fontSize: "24px" }} />}
                      >
                        Choose File
                      </Button>
                      {fileList.length === 0 &&
                        detail_Background?.imageBackground === null ? (
                        <span className={"text-gray-500 text-xs ml-2"}>
                          {" "}
                          No Image Choosen
                        </span>
                      ) : (
                        <span className={"text-gray-500 text-xs ml-2"}>
                          {type === "update" ? (
                            <Image
                              src={detail_Background?.urlLogo2}
                              width={80}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : null}
                        </span>
                      )}
                    </div>
                  </Upload>
                </Form.Item>
                <Form.Item hidden name={"urlImage"} />
              </div>
              <div className="w-auto grid grid-cols-2 gap-10">
                <Form.Item
                  label={"Start Date"}
                  name={"startDate"}
                  rules={formMessageRequired("Start Date")}
                >
                  <DateComponent
                    onChange={(e) => handleStartDate(e)}
                    disabled={type === "update"}
                  />
                </Form.Item>
                <Form.Item
                  label={"End Date"}
                  name={"endDate"}
                  rules={[
                    {
                      validator: (_, value) =>
                        (value && moment(startDate) <= moment(value)) || !value
                          ? Promise.resolve()
                          : Promise.reject(
                            new Error(
                              "The end date must be greater than or equal to the start date!"
                            )
                          ),
                    },
                  ]}
                >
                  <DateComponent
                    disabled={startDate === null}
                    dateDisable={handleDisableEndDate}
                  />
                </Form.Item>
              </div>
              <div className={"w-full flex-col"}></div>
              <Form.Item
                label={"Description"}
                name={"description"}
                className={"w-full"}
              >
                <InputComponent type="textarea" />
              </Form.Item>
            </div>
          </BaseContainer>
          <div className="mt-[30px] flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>

            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? "IconButtonReset" : "IconButtonClear"
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={() => {
                  handleClear();
                }}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                onClick={() => setFlag(true)}
              >
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
        {/* Modal Confirmation */}
        <ModalConfirmationLoginBackground
          isOpen={modalConfirm}
          data={bodyData}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          type={type}
        />
        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
        {/* Modal Retry */}
        {renderModal()}
      </Spin>
    </LayoutMenu>
  );
};

export default LoginBackgroundForm;
