import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileOutlined,
  UndoOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Form, Typography, Progress, Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import EmployeeList from "./EmployeeList";
import { bytesConverter } from "../../../../utils/bytesConverter";
import {
  downloadEmpTemlpate,
  saveUploadEmployee,
  setClearDataUpload,
  uploadEmployee,
} from "../../../../redux/slices/user_management/employee";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../assets/Icon/index";
import moment from "moment";
import { dateFormatting } from "../../../../utils";
const { Dragger } = Upload;

const EmployeeUpload = () => {
  const { data_list_upload, loading } = useSelector((state) => state.employee);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const [fileName, setFileName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [modalBack, setModalBack] = useState(false);
  const [showListUpload, setShowListUpload] = useState(false);
  const [firstStep, setFirstStep] = useState(true);
  const [dataExcel, setDataExcel] = useState([]);
  const [dataEmployeeList, setDataEmployeeList] = useState([]);
  const [dataAssignmentEmployeeList, setDataAssignmentEmployeeList] = useState(
    []
  );
  const [fileProgress, setFileProgress] = useState(0);
  const [form] = Form.useForm();
  // use Effect
  useEffect(() => {
    if (data_list_upload?.code === 200 && location?.pathname === USER_ROUTES.UPLOAD_EMPLOYEE) {
      setShowListUpload(true);
      setFirstStep(false);
      setDataExcel(data_list_upload?.data);
      const dataConverter = Object.assign(
        {},
        ...data_list_upload?.data?.map((item) => {
          return item;
        })
      );
      setDataEmployeeList(
        dataConverter?.uploadEmployeeDTO?.map((item) => {
          return {
            empNumber: item?.empNumber,
            firstName: item?.firstName,
            lastName: item?.lastName,
            email: item?.email,
            phone: item?.phone,
            empType: item?.empTypeId,
            empTypeId: item?.empTypeId,
            startDate: moment(item?.startDate).clone(),
            endDate: moment(item?.endDate).clone(),
            description: item?.description,
            status: item?.status,
          };
        })
      );
      setDataAssignmentEmployeeList(
        dataConverter?.uploadAssignmentDTO?.map((item) => {
          return {
            empNumber: item?.empNumber,
            endDate: moment(item?.endDate).clone(),
            isMain: item?.isMain,
            jobId: item?.jobId,
            positionId: item?.positionId,
            startDate: moment(item?.startDate).clone(),
            status: item?.status,
          };
        })
      );
    } else {
      setFirstStep(true);
      dispatch(setClearDataUpload());
    }
  }, [showListUpload, data_list_upload, firstStep, location]);

  // reset data when leaving page
  useEffect(() => {
    return () => {
      dispatch(setClearDataUpload());
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
    onChange: handleFileChange,
    disabled: showListUpload
  };

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
      setFileProgress(0)
      const body = { image: uploadFile, onProgress: (progress) => setFileProgress(progress) };
      await dispatch(uploadEmployee(body)).unwrap();

    } catch (error) {
      setFileList((prevFileList) =>
        prevFileList.map((file) => {
          if (file.name === fileName.name) {
            return { ...file, status: 'error' };
          }
          return file;
        })
      );
    }
  };

  // handle reupload 
  const reUploadFile = () => {
    setFileList((prevFileList) =>
      prevFileList.map((file) => ({
        ...file,
        percent: 0,
        status: 'uploading'
      }))
    );
    handleUpload();
  }

  // handle onFinish form
  const onFinish = async () => {
    if (firstStep === false) {
      const employeeListItem = dataEmployeeList?.map((item) => {
        return {
          ...item,
          empType: item?.empType?.toString(),
          empTypeId: typeof item?.empType === 'string' ? item?.empTypeId?.toString() : item?.empType?.toString(),
          startDate: moment(item?.startDate).format(dateFormatting?.dateCapital),
          endDate: moment(item?.endDate).format(dateFormatting?.dateCapital),
        }
      });
      const assignmentEmployeeListItem = dataAssignmentEmployeeList?.map((item) => {
        return {
          ...item,
          jobId: item?.jobId?.toString(),
          positionId: item?.positionId.toString(),
          startDate: moment(item?.startDate).format(dateFormatting?.dateCapital),
          endDate: moment(item?.endDate).format(dateFormatting?.dateCapital),
        }
      });
      const body = {
        uploadEmployeeDTO: [...employeeListItem],
        uploadAssignmentDTO: [...assignmentEmployeeListItem],
      };
      await dispatch(saveUploadEmployee(body)).unwrap();
    }
  };

  // handle upload using link
  const handleUploadLink = (e) => {
    e.stopPropagation();
  };

  // breadcrumbs routes
  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_EMPLOYEE,
      breadcrumbName: "Employee",
    },
    {
      path: "",
      breadcrumbName: "Upload Employee",
    },
  ];


  // handle reset upload and set default table
  const handleReset = () => {
    dispatch(setClearDataUpload())
    setDataAssignmentEmployeeList([]);
    setDataEmployeeList([]);
    setShowListUpload(false)
    setFileList([])
  };

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className={"w-full flex justify-end"}>
          <ButtonComponent
            icon={<DownloadOutlined style={{ fontSize: '24px' }} />}
            onClick={() => {
              dispatch(downloadEmpTemlpate());
            }}
            type={"submit"}
          >
            Download Template
          </ButtonComponent>
        </div>

        <Form form={form} onFinish={onFinish}>
          <BaseContainer header={"EMPLOYEE LIST"}>
            <div className={"w-full flex flex-col gap-4 "}>
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
              <EmployeeList
                employeeList={dataEmployeeList}
                assigmentEmployeeList={dataAssignmentEmployeeList}
                onChangeEmployeeList={setDataEmployeeList}
                onChangeAssignmentEmployeeList={setDataAssignmentEmployeeList}
              />
            </Form.Item>
          ) : (
            fileList?.map((file, index) => (
              <div
                className="border-solid border-[0.12rem] border-black rounded-[0.5rem] my-4 py-2 px-3 flex gap-4 items-center bg-white "
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
                <div className={"flex flex-col justify-end  items-end"}>
                  <ButtonComponent
                    icon={<CloseOutlined style={{ color: "#58804D" }} />}
                    border={false}
                    onClick={() => handleRemove(index)}
                  />
                  {file.status === "error" && (
                    <ButtonComponent border={false}>
                      <span className={"text-green-800 mr-2"} onClick={reUploadFile}>Re-upload</span>
                      <UndoOutlined style={{ color: "#58804D" }} />
                    </ButtonComponent>
                  )}
                </div>
              </div>
            ))
          )}
          <Form.Item>
            <div className={"w-full flex justify-between gap-5 my-5"}>
              <ButtonComponent
                icon={<ArrowLeftOutlined />}
                type={"submit"}
                onClick={() => setModalBack(true)}
              >
                Back
              </ButtonComponent>
              <div className="w-full justify-end flex gap-2">
                {firstStep === false &&
                  <ButtonComponent type={"submit"} onClick={handleReset} icon={
                    <SVGIcon
                      name={`IconButtonClear`}
                      width={24}
                    />
                  } disabled={firstStep}>
                    Clear
                  </ButtonComponent>
                }
                <ButtonComponent type={"submit"} htmlType={"submit"} disabled={firstStep}>
                  Save
                </ButtonComponent>
              </div>
            </div>
          </Form.Item>
        </Form>

        {/* modal back */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => {
            setModalBack(false);
          }}
          handleOk={() => {
            navigate(-1)
            dispatch(setClearDataUpload())
          }
          }
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

export default EmployeeUpload;
