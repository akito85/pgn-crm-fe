import {
  ArrowLeftOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileOutlined,
  UndoOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Form, Progress, Spin, Typography, Upload } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { bytesConverter } from "../../../../utils/bytesConverter";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadTemplate,
  finalUploadUser,
  setClearData,
  uploadUser,
} from "../../../../redux/slices/user_management/user";
import { useEffect } from "react";
import ListUserFromUpload from "./ListUserFromUpload";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../assets/Icon/index";
import moment from "moment";
import { dateFormatting } from "../../../../utils";
const { Dragger } = Upload;

const UploadUser = () => {
  const { data_list_upload, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // state
  const [modalBack, setModalBack] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [showListUpload, setShowListUpload] = useState(false);
  const [firstStep, setFirstStep] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const [fileProgress, setFileProgress] = useState(0);

  useEffect(() => {
    if (data_list_upload?.code === 200) {
      setShowListUpload(true);
      setFirstStep(false);
      setDataTable(
        data_list_upload?.data?.map((item, index) => {
          return {
            key: (index + 1).toString(),
            userName: item?.userName,
            authType: item?.authType,
            authTypeId: item?.authTypeValue,
            employeeName: item?.employeeName,
            employee: (n => Number.isFinite(n) ? n : null)(parseInt(item?.employee)),
            userType: item?.userType,
            userTypeId: item?.userTypeValue,
            userLevel: item?.userLevel,
            userLevelId: item?.userLevelValue,
            email: item?.email,
            phone: item?.phoneNumber,
            groupAccess: item?.groupAccess,
            groupAccessId: parseInt(item?.groupAccessId),
            status: item?.status,
            startDate: item?.startDate ? moment(item.startDate).format("DD MMM YYYY") : null,
            endDate: item?.endDate ? moment(item.endDate).format("DD MMM YYYY") : null,
            startDateGa: item?.startDateGa ? moment(item.startDateGa).format("DD MMM YYYY") : null,
            endDateGa: item?.endDateGa ? moment(item.endDateGa).format("DD MMM YYYY") : null,
            message: item?.message,
          };
        })
      );
    } else {
      setFirstStep(true);
    }
  }, [showListUpload, data_list_upload, firstStep]);

  // reset data when leaving page
  useEffect(() => {
    return () => {
      dispatch(setClearData());
    };
  }, [dispatch]);

  // handle change file
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // props dragger
  const props = {
    name: "file",
    multiple: false,
    fileList: fileList,
    showUploadList: false,
    accept: ".xlsx, .xls",
    maxCount: 1,
    beforeUpload: async (file) => {
      setFileName(file);
      handleUpload(file);
      return false;
    },
    onChange: ({ fileList }) => handleFileChange({ fileList }),
    disabled: showListUpload,
  };

  // routes bread crumb
  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_USER,
      breadcrumbName: "User",
    },
    {
      path: "",
      breadcrumbName: "Upload User",
    },
  ];

  // handle remove file
  const handleRemove = (index) => {
    setFileList((prevFileList) => {
      const updatedFileList = [...prevFileList];
      updatedFileList.splice(index, 1);
      return updatedFileList;
    });
  };

  // handle upload
  const handleUpload = async (fileToUpload) => {
    const uploadFile = fileToUpload || fileName;
    if (!uploadFile) return;
    try {
      setFileProgress(0);
      const body = {
        image: uploadFile,
        onProgress: (progress) => setFileProgress(progress),
      };
      await dispatch(uploadUser(body)).unwrap();
    } catch (error) {
      setFileList((prevFileList) =>
        prevFileList.map((file) => {
          if (file.name === uploadFile.name) {
            return { ...file, status: "error" };
          }
          return file;
        })
      );
    }
  };

  // handle reupload file
  const reUploadImage = async () => {
    setFileList((prevFileList) =>
      prevFileList.map((file) => ({
        ...file,
        percent: 0,
        status: "uploading",
      }))
    );
    handleUpload();
  };

  // handle finish form
  const onFinish = async () => {
    try {
      if (firstStep === false) {
        const body = dataTable?.map((item) => {
          return {
            userName: item?.userName?.toString(),
            authType: item?.authType?.toString(),
            authTypeValue: item?.authTypeId?.toString(),
            employee: item?.employee === null ? "" : item?.employee?.toString(),
            userType: item?.userType?.toString(),
            userTypeValue: item?.userTypeId?.toString(),
            userLevel: item?.userLevel?.toString(),
            userLevelValue: item?.userLevelId?.toString(),
            email: item?.email?.toString(),
            phoneNumber: item?.phone?.toString(),
            groupAccess:
              typeof item?.groupAccess === "number"
                ? item?.groupAccess?.toString()
                : item?.groupAccess,
            groupAccessId:
              typeof item?.groupAccess === "string"
                ? item?.groupAccessId?.toString()
                : item?.groupAccess?.toString(),
            endDate: item?.endDate ? moment(item.endDate, "DD MMM YYYY").format(dateFormatting.dateCapital) : null,
            startDate: item?.startDate ? moment(item.startDate, "DD MMM YYYY").format(dateFormatting.dateCapital) : null,
            endDateGa: item?.endDateGa ? moment(item.endDateGa, "DD MMM YYYY").format(dateFormatting.dateCapital) : null,
            startDateGa: item?.startDateGa ? moment(item.startDateGa, "DD MMM YYYY").format(dateFormatting.dateCapital) : null,
          };
        });
        await dispatch(finalUploadUser(body)).unwrap();
      }
    } catch (error) {
      setFileList((prevFileList) =>
        prevFileList.map((file) => {
          if (file.name === fileName.name) {
            return { ...file, status: "error" };
          }
          return file;
        })
      );
    }
  };

  // download template
  const getTemplate = async () => {
    await dispatch(downloadTemplate()).unwrap();
  };

  // hanlde upload by link
  const handleUploadLink = (e) => {
    e.stopPropagation();
  };

  // handle reset upload and set default table
  const handleReset = () => {
    dispatch(setClearData());
    setDataTable([]);
    setShowListUpload(false);
    setFileList([]);
  };

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className={"w-full flex justify-end"}>
          <ButtonComponent
            icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
            type={"submit"}
            onClick={getTemplate}
          >
            Download Template
          </ButtonComponent>
        </div>
        <Form onFinish={onFinish}>
          <BaseContainer header={"UPLOAD USER"}>
            <div className={"w-full flex flex-col gap-4"}>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <SVGIcon name={"IconUploadAttachment"} />
                </p>
                <p className="ant-upload-text text-bold">
                  Drag and drop your file here or{" "}
                  <span className="underline"> click for upload</span>
                </p>
                <p className="ant-upload-hint">
                  The maximum file size is limited to 5 MB
                </p>
                <div className="flex items-center justify-center my-3 gap-x-3">
                  <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                  <span>or</span>
                  <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                </div>
                <p className="ant-upload-text">
                  Put Google Drive link or local file
                </p>
                <div className="flex my-5 justify-center items-center">
                  <div className="flex gap-3 justify-center items-center">
                    <InputComponent
                      onChange={handleUploadLink}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <ButtonComponent
                      icon={<UploadOutlined />}
                      type={"submit"}
                      border={false}
                      onClick={handleUploadLink}
                    />
                  </div>
                </div>
              </Dragger>
            </div>
          </BaseContainer>
          {showListUpload === true ? (
            <Form.Item>
              <ListUserFromUpload
                data={dataTable}
                onChangeData={setDataTable}
              />
            </Form.Item>
          ) : (
            fileList?.map((file, index) => (
              <div
                className="border-solid border-[0.12rem] border-black rounded-[0.5rem] my-4 py-2 px-3 flex gap-4 items-center bg-white"
                key={index}
              >
                <div>
                  <FileOutlined style={{ fontSize: "20px" }} />
                </div>
                <div className="flex flex-col w-full">
                  <Typography className={"text-red-500"}>
                    {file.name}
                  </Typography>
                  <Typography>{bytesConverter(file.size)}</Typography>
                  {file.status === "error" ? (
                    <span className={"text-red-700"}>Failed to Upload</span>
                  ) : (
                    <Progress
                      percent={fileProgress}
                      format={(percent) => `${percent}%`}
                    />
                  )}
                </div>
                <div className={"flex flex-col justify-end items-end"}>
                  <ButtonComponent
                    icon={<CloseOutlined style={{ color: "#58804D" }} />}
                    border={false}
                    onClick={() => handleRemove(index)}
                  />
                  {file.status === "error" && (
                    <ButtonComponent border={false}>
                      <span
                        className={"text-green-800 mr-2"}
                        onClick={reUploadImage}
                      >
                        Re-upload
                      </span>
                      <UndoOutlined style={{ color: "#58804D" }} />
                    </ButtonComponent>
                  )}
                </div>
              </div>
            ))
          )}
          <Form.Item>
            <div className={"w-full flex justify-between my-5"}>
              <ButtonComponent
                icon={<ArrowLeftOutlined />}
                type={"submit"}
                onClick={() => setModalBack(true)}
              >
                Back
              </ButtonComponent>
              <div className={"w-full justify-end flex gap-2"}>
                {firstStep === false && (
                  <ButtonComponent
                    type={"submit"}
                    onClick={handleReset}
                    icon={<SVGIcon name={`IconButtonClear`} width={24} />}
                    disabled={firstStep}
                  >
                    Clear
                  </ButtonComponent>
                )}
                <ButtonComponent
                  type={"submit"}
                  htmlType={"submit"}
                  disabled={firstStep}
                >
                  Save
                </ButtonComponent>
              </div>
            </div>
          </Form.Item>
        </Form>
        {/* modal back */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => {
            navigate(-1);
            dispatch(setClearData());
          }}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>
      </Spin>
    </>
  );
};

export default UploadUser;
