import { Form, Progress, Select, Spin, Typography } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import SelectComponent from "../../../../../components/SelectComponent";
import Dragger from "antd/lib/upload/Dragger";
import {
  CloseOutlined,
  FileOutlined,
  LeftOutlined,
  UndoOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import { getBase64 } from "../../../../../utils/getBase64";
import SVGIcon from "../../../../../assets/Icon/index";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BaseContainer from "../../../../../components/BaseContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  getBankDDLMaintain,
  getListType,
  uploadBank,
} from "../../../../../redux/slices/receipt_collection/electrionicBank";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import { useNavigate } from "react-router-dom";
import { showModalSuccess } from "../../../../../redux/slices/general_slice";
import { formMessageRequired } from "../../../../../utils";

const { Option } = Select;
const MAX_FILE_SIZE = 5000000;

const UploadMaintainElectronicBankStatement = (updateData = () => {}) => {
  const { bankDDL, data_type, data, loading } = useSelector(
    (state) => state.electronic
  );

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [bank, setBank] = useState();
  const [type, setType] = useState();
  const [submit, setSubmit] = useState(false);
  const [dataLink, setDataLink] = useState({});
  const [urlLink, setUrlLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState(""); // State to store the file name
  const formValue = form.getFieldsValue();
  const [category, setCategory] = useState();
  const [modalBack, setModalBack] = useState(false);
  const [withLink, setWithLink] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileProgress, setFileProgress] = useState(0);

  const handleClose = () => {
    setFileList([]);
    setBank("");
    setDataLink({});
    setUrlLink("");
    setErrorMessage("");
    setSubmit(false);
    form.resetFields();
  };

  useEffect(() => {
    dispatch(getBankDDLMaintain());
    dispatch(getListType());
  }, [dispatch]);

  const handleButton = (value) => {
    setBank(value);
    setType(value);
  };
  const handleRemove = (index) => {
    setFileList((prevFileList) => {
      const updatedFileList = [...prevFileList];
      updatedFileList.splice(index, 1);
      if (updatedFileList.length === 0) {
        setSubmit(false);
      }
      return updatedFileList;
    });
  };

  const property = {
    name: "file",
    multiple: true,
    fileList: fileList,
    showUploadList: false,
    accept: ".txt, .ftr",
    disabled: !bank && !type,
    beforeUpload: useCallback(
      async (file) => {
        const base64 = await getBase64(file);
        setFileList((prevState) => {
          const res = {
            file: file,
            size: file.size,
            fileName: file.name, // Set the file name here
            fileSize: bytesConverter(file.size),
            fileType: file.type,
            fileStatus: file.status,
            percent: 100,
            type: "new",
            base64: base64,
          };
          setFileName([file]); // Set the file name in state
          return [...prevState, res];
        });
        setSubmit(true);
        return false;
      },
      [bank, type]
    ),
  };

  // const formData = new FormData();
  // // fileList.forEach((item) => {
  // //   formData.append(`files`, item.file, item.fileName);
  // // });
  // for (let i = 0; i < fileList.length; i++) {
  //   const file = fileList[i].file;
  //   formData.append(`files`, file, file.fileName);
  // }
  // formData.append("bankName", formValue?.bankName?.value);
  // formData.append("ReceiptChannel", formValue?.receiptChannel?.value);
  const onFinish = async () => {
    const body = {
      bankId: formValue?.bankName?.value,
      receiptChannel: formValue?.receiptChannel?.value,
      // onProgress: (progress) => setFileProgress(progress),
    };
    try {
      let message = "";
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].file;
        const response = await dispatch(uploadBank({ ...body, files: file }));
        message = response?.payload?.message;
        console.log(response, "me");
      }
      const successMessage = {
        title: "Successful",
        description: `${message}`,
      };
      if (message) {
        dispatch(showModalSuccess(successMessage));
      }
    } catch (error) {
      setFileList((prevFileList) =>
        prevFileList.map((file) => {
          if (file.name === fileName) {
            return { ...file, status: "error" };
          }
          return file;
        })
      );
      // Add a return statement or handle the error here
      return; // or throw error; or any other appropriate action
    }
  };

  const checkFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("The file size is more than 5 MB");
    } else {
      setErrorMessage("");
    }
  };

  const handleUploadLink = async (e) => {
    e.stopPropagation();
    const url = urlLink;
    if (url) {
      try {
        const fileName = url.split("/").pop();
        const result = await fetch(url);
        const blob = await result.blob();
        const file = new File([blob], fileName, { lastModified: new Date() });
        const base64 = await getBase64(file);
        const res = {
          file: file,
          size: file.size,
          fileName: file.name,
          fileSize: bytesConverter(file.size),
          fileType: file.type,
          fileStatus: "",
          percent: 100,
          type: "new",
          base64: base64,
        };
        if (res.size <= MAX_FILE_SIZE) {
          setDataLink(res);
          setSubmit(true);
        } else {
          setSubmit(true);
          setErrorMessage("The file size more than 5 MB");
        }
      } catch (error) {
        setSubmit(true);
        setErrorMessage("Link cannot access to get the file");
      }
    }
  };

  const updateLink = (e) => {
    e.stopPropagation();
    setUrlLink(e.target.value);
  };
  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Receipt Reconciliation",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MAINTAIN_ELECTRONIC_BANK_STATEMENT,
      breadcrumbName: "Maintain Electronic Bank Statement",
    },
    {
      path: "",
      breadcrumbName: "Upload Maintain Electronic Bank Statement ",
    },
  ];
  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <BaseContainer>
          <Form layout={"vertical"} form={form} onFinish={onFinish}>
            <div className="flex flex-col w-full gap-3 p-8">
              <div
                className={
                  "rounded-tl-[5px] rounded-tr-[5px] flex w-full items-end justify-between"
                }
              >
                <div className={"flex flex-col gap-y-5"}>
                  <span className="text-xl">Upload Files</span>
                  <span className="text-gray-500">
                    Upload files to this section
                  </span>
                </div>
                <Form.Item
                  name={"bankName"}
                  className={"w-1/4 no-margin-form justify-end"}
                  rules={formMessageRequired("bankName")}
                >
                  <SelectComponent
                    allowClear={false}
                    mandatory
                    label={"Bank Name"}
                    onChange={handleButton}
                    labelInValue
                  >
                    {bankDDL?.data?.map((item, index) => (
                      <Select.Option key={index.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
                <Form.Item
                  name={"receiptChannel"}
                  className={"w-1/4 no-margin-form"}
                  rules={formMessageRequired("receiptChannel")}
                >
                  <SelectComponent
                    allowClear={false}
                    mandatory
                    label={"Type"}
                    onChange={handleButton}
                    labelInValue
                  >
                    {data_type?.data?.map((a, index) => (
                      <Select.Option key={index.id} value={a.id}>
                        {a.name}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
              </div>
              <Form.Item name={"file"}>
                <div className="w-full">
                  <Dragger {...property}>
                    <p className="ant-upload-drag-icon">
                      <SVGIcon name="IconUploadAttachment" />
                    </p>
                    {(submit && fileList.length > 0) || !submit ? (
                      <>
                        <p className="ant-upload-text underline text-bold">
                          Click here to attach a file
                        </p>
                        <p className="ant-upload-hint">
                          The maximum file size is limited to 5 MB
                        </p>
                      </>
                    ) : null}
                    {withLink && !submit && (
                      <>
                        <div className="flex items-center justify-center my-3 gap-x-3">
                          <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                          <span>or</span>
                          <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                        </div>
                        <div className="flex flex-col items-center gap-4">
                          <p className="ant-upload-text">Put URL link below</p>
                          <div className="flex justify-center items-center gap-3">
                            <InputComponent
                              width={"24%"}
                              onChange={updateLink}
                              onClick={(e) => e.stopPropagation()}
                              disabled={!bank && !type}
                            />
                            <ButtonComponent
                              onClick={handleUploadLink}
                              icon={<UploadOutlined />}
                              type={"submit"}
                              border={false}
                              disabled={!bank && !type}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {submit && (dataLink.file || !!errorMessage) ? (
                      <>
                        <p
                          className={`mb-1 text-base${
                            errorMessage ? " text-red-700" : ""
                          }`}
                          style={!errorMessage ? { color: "#BBCF4B" } : null}
                        >
                          {errorMessage || "Link has been attached!"}
                        </p>
                        <p className="ant-upload-text underline">{urlLink}</p>
                      </>
                    ) : null}
                  </Dragger>
                </div>
              </Form.Item>
              {fileList.map((file, index) => (
                <div
                  className="border-solid border-[0.12rem] border-black rounded-[0.5rem] my-4 py-2 px-3 flex gap-4 items-center"
                  key={index}
                >
                  <div>
                    <FileOutlined style={{ fontSize: "20px" }} />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex w-full justify-between">
                      <Typography className={"text-red-500"}>
                        {file.fileName}
                      </Typography>
                      <ButtonComponent
                        icon={<CloseOutlined style={{ color: "#58804D" }} />}
                        border={false}
                        onClick={() => handleRemove(index)}
                      />
                    </div>
                    <Typography>{file.fileSize}</Typography>
                    {file.fileStatus === "error" ? (
                      <div className="flex w-full justify-between">
                        <span className={"text-red-700"}>Failed to Upload</span>
                        <ButtonComponent border={false}>
                          <span className={"text-green-800 mr-2"}>
                            Re-upload
                          </span>
                          <UndoOutlined style={{ color: "#58804D" }} />
                        </ButtonComponent>
                      </div>
                    ) : file.size <= MAX_FILE_SIZE ? (
                      <Progress
                        // percent={fileProgress}
                        percent={file.percent || 0}
                        format={(percent) => `${percent}%`}
                      />
                    ) : (
                      <span className={"text-red-700"}>
                        File is bigger than 5MB
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex w-full justify-between align-middle my-3">
                <ButtonComponent
                  onClick={() => setModalBack(true)}
                  icon={
                    <LeftOutlined
                      style={{
                        // color: "#fff",
                        fontSize: 24,
                        justifyItems: "center",
                      }}
                    />
                  }
                >
                  Back
                </ButtonComponent>
                <div className="flex align-middle gap-3">
                  <ButtonComponent onClick={handleClose}>
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent
                    type={"submit"}
                    border={false}
                    htmlType={"submit"}
                    disabled={!submit || errorMessage}
                  >
                    Save
                  </ButtonComponent>
                </div>
              </div>
            </div>
          </Form>
        </BaseContainer>
      </Spin>

      {/* Modal Back*/}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>
    </LayoutMenu>
  );
};

export default UploadMaintainElectronicBankStatement;
