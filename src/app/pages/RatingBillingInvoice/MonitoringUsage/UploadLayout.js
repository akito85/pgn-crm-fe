import React, { useEffect, useRef } from "react";
import DetailText from "../../../../components/DetailText";
import { useState } from "react";
import { Alert, Form, Progress, Select, Spin, Tooltip, Typography, message } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import Dragger from "antd/lib/upload/Dragger";
import { bytesConverter } from "../../../../utils/bytesConverter";
import SVGIcon from "../../../../assets/Icon/index";
import InputComponent from "../../../../components/InputComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  CloseOutlined,
  FileOutlined,
  UndoOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import TablePagination from "../../../../components/TablePagination";
import {
  getFormatUsageType,
  uploadMonitoringUsage,
} from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { useMonitoringList } from "./useMonirotingList";
import {
  ModalAttention,
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";

const UploadLayout = ({
  dataTable,
  setDataTable = () => {},
  tabHeader,
  id,
  dataHeader,
  type,
  refreshData = () => {},
}) => {
  const [format, setFormat] = useState();
  const [urlLink, setUrlLink] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileProgress, setFileProgress] = useState(0);
  const [recordId, setRecordId] = useState("");
  const [isFileUploadEnabled, setFileUploadEnabled] = useState(false);
  const [isLinkModalVisible, setLinkModalVisible] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [modalDelete, setModalDelete] = useState(false);

  const [showRecalculateModal, setShowRecalculateModal] = useState(false);
  const [pendingUploadAction, setPendingUploadAction] = useState(null);

  const MAX_FILE_SIZE = 5000000;
  const [form] = Form.useForm();
  const { loading } = useSelector((state) => state.monitoring_usage);
  const { columns, page, setPage, pageSize, setPageSize, onSort } =
    useMonitoringList(tabHeader, id);
  const dispatch = useDispatch();
  const { list_usage_type } = useSelector((state) => state.monitoring_usage);
  
  const filePreviewRef = useRef(null);

  useEffect(() => {
    try {
      dispatch(getFormatUsageType());
    } catch (error) {
      console.log("Error", error);
    }
  }, [dispatch]);

  const isNeedType = (formatValue) => {
    const target = formatValue ?? format;
    if (!target) return false;

    let labelStr = "";

    if (typeof target === "object") {
      const raw = target?.label ?? target?.children ?? target?.name ?? "";
      if (typeof raw === "string") {
        labelStr = raw;
      } else if (Array.isArray(raw)) {
        labelStr = raw.join("");
      } else {
        const matched = list_usage_type?.find(
          (d) => d.id === target?.value || d.id === target?.key
        );
        labelStr = matched?.name ?? "";
      }
    } else {
      labelStr = String(target);
    }

    return labelStr.toUpperCase() === "NEED";
  };

  const handleUpdate = (record, values) => {};

  const handleDeleteOk = () => {
    const newData = dataTable.filter((item) => item.recordId !== recordId);
    setDataTable(newData);
    setModalDelete(false);
  };

  // column action dengan recordId
  const action = [
    {
      title: "ACTION",
      dataIndex: "accountId",
      align: "center",
      fixed: "right",
      render: (id, record, index) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Update">
              <Link
                to={RBI_ROUTES.MONITORING_USAGE_LIST_UPDATE}
                state={{ id: id, record: record }}
              >
                <div className="pt-1">
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    onClick={() => handleUpdate(record)}
                  />
                </div>
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <div className="pt-1">
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  onClick={() => {
                    setModalDelete(true);
                    setRecordId(record?.recordId);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // handle pagination
  const updateDataPagination = (page, pageSize) => {
    return dataTable?.slice((page - 1) * pageSize, page * pageSize);
  };

  // handle format change
  const handleFormat = (value) => {
    setFormat(value);
    setFileUploadEnabled(!!value);

    if (isNeedType(value)) {
      setShowRecalculateModal(true);
      setPendingUploadAction(null);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const property = {
    name: "file",
    multiple: false,
    fileList: fileList,
    showUploadList: false,
    accept: ".xlsx, .xls",
    maxCount: 1,
    beforeUpload: (file) => {
      if (!format) {
        form.validateFields(['format_usage_type']).catch(() => {});
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        message.error('File size exceeds 5 MB limit');
        return false;
      }

      setFileName(file);
      
      setTimeout(() => {
        filePreviewRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 100);
      
      return false;
    },
    onChange: handleFileChange,
  };

  const handleUploadButtonClick = () => {
    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => {});
    }
  };

  const executeUpload = async () => {
    try {
      setFileProgress(0);
      const body = {
        document: fileName,
        calculationType: format.value,
        onProgress: (progress) => setFileProgress(progress),
      };
      setLoadingUpload(true);
      await dispatch(uploadMonitoringUsage(body)).unwrap();

      setUploadedFileName(fileName.name);
      setShowSuccessModal(true);

      if (refreshData && typeof refreshData === "function") {
        refreshData();
      }
      
      setFileList([]);
      setFileName("");
      
    } catch (error) {
      setFileList((prevFileList) =>
        prevFileList.map((file) => {
          if (file.name === fileName.name) {
            return { ...file, status: "error" };
          }
          return file;
        })
      );
      message.error('Upload failed. Please try again.');
    }
    setLoadingUpload(false);
  };

  const executeUploadLink = async () => {
    try {
      setFileProgress(0);
      const body = {
        document: urlLink,
        calculationType: format.value,
        onProgress: (progress) => setFileProgress(progress),
      };
      
      setLoadingUpload(true);
      await dispatch(uploadMonitoringUsage(body)).unwrap();

      const linkFileName = urlLink.split('/').pop() || 'File from link';
      setUploadedFileName(linkFileName);
      
      setShowSuccessModal(true);

      if (refreshData && typeof refreshData === "function") {
        refreshData();
      }

      setUrlLink("");
      
    } catch (error) {
      console.error("Upload error:", error);
      message.error('Upload failed. Please try again.');
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleUpload = async () => {
    if (isNeedType()) {
      setPendingUploadAction("file");
      setShowRecalculateModal(true);
      return;
    }
    await executeUpload();
  };

  const handleUploadLink = async (e) => {
    e.stopPropagation();

    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => {});
      return;
    }

    if (!urlLink || urlLink.trim() === "") {
      setLinkModalVisible(true);
      return;
    }

    if (isNeedType()) {
      setPendingUploadAction("link");
      setShowRecalculateModal(true);
      return;
    }
    await executeUploadLink();
  };

  const handleRecalculateConfirm = async () => {
    setShowRecalculateModal(false);
    if (pendingUploadAction === "file") {
      await executeUpload();
    } else if (pendingUploadAction === "link") {
      await executeUploadLink();
    }
    setPendingUploadAction(null);
  };

  const handleRecalculateCancel = () => {
    setShowRecalculateModal(false);
    setPendingUploadAction(null);
    setFormat(undefined);
    setFileUploadEnabled(false);
    form.resetFields(['format_usage_type']);
  };

  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const updateLink = (e) => {
    e.stopPropagation();
    setUrlLink(e.target.value);
  };

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

  const handleDraggerClick = (e) => {
    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => {});
    }
  };

  const renderLayout = (type) => {
    if (type === "detail-confirmation") {
      return (
        <div>
          <div className="text-primary text-xs font-bold uppercase my-5">
            Batch information
          </div>
          <div className={"w-full grid grid-cols-4"}>
            <DetailText label={"Batch ID"}>
              {dataHeader?.batchInformation?.batchId}
            </DetailText>
            <DetailText label={"Upload Type"}>
              {dataHeader?.batchInformation?.uploadType}
            </DetailText>
            <DetailText label={"Upload Date"}>
              {dataHeader?.batchInformation?.uploadDate}
            </DetailText>
            <DetailText label={"Upload By"}>
              {dataHeader?.batchInformation?.uploadBy}
            </DetailText>
          </div>
          <div className={"w-full grid grid-cols-4"}>
            <DetailText label={"Total Data"}>
              {dataHeader?.batchInformation?.totalUsage}
            </DetailText>
            <DetailText label={"Total Succeed"}>
              {dataHeader?.batchInformation?.totalSucceed}
            </DetailText>
            <DetailText label={"Total Progress"}>
              {dataHeader?.batchInformation?.totalProgress}
            </DetailText>
            <DetailText label={"Total Failed"}>
              {dataHeader?.batchInformation?.totalFailed}
            </DetailText>
          </div>
          <div className={"w-full grid grid-cols-4"}>
            <DetailText label={"Status"}>
              {dataHeader?.batchInformation?.status}
            </DetailText>
          </div>
          <div className="text-primary text-xs font-bold uppercase my-5">
            usage list
          </div>
          <div className="mt-0">
            <TablePagination
              columns={columns}
              dataSource={updateDataPagination(page, pageSize)}
              totalData={dataTable?.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              tableScrolled={{ x: 10000, y: 600 }}
              onSort={onSort}
              loading={loading}
            />
          </div>
        </div>
      );
    } else {
      return (
        <Form layout={"vertical"} form={form}>
          <div className={"w-full flex flex-col"}>
            <div className={"w-full flex no-margin-form"}>
              <Form.Item 
                className="w-1/4"
                name={"format_usage_type"}
                label={"Format Usage Type"}
                rules={[
                  {
                    required: true,
                    message: "Please select Format Usage Type first",
                  },
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <SelectComponent
                  allowClear={false}
                  mandatory
                  placeholder={"Choose Usage Type"}
                  onChange={handleFormat}
                  labelInValue
                >
                  {list_usage_type?.map((data, index) => (
                    <Select.Option key={data.id} value={data.id}>
                      {data.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>
            
            <Form.Item 
              name={"file"}
              rules={[
                {
                  validator: async (_, value) => {
                    return Promise.resolve();
                  },
                },
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <div className="w-full">
                <Spin spinning={loadingUpload}>
                  <div onClick={handleDraggerClick}>
                    <Dragger {...property} disabled={!isFileUploadEnabled}>
                      <p className="ant-upload-drag-icon">
                        <SVGIcon
                          name={"IconUploadAttachment"}
                          onClick={handleUploadButtonClick}
                        />
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
                      <div
                        className="flex my-5 justify-center items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-3 justify-center items-center">
                          <InputComponent
                            onChange={updateLink}
                            disabled={!isFileUploadEnabled}
                            onClick={(e) => e.stopPropagation()}
                            value={urlLink}
                            placeholder="Paste your link here"
                          />
                          <ButtonComponent
                            icon={<UploadOutlined />}
                            type={"submit"}
                            border={false}
                            onClick={handleUploadLink}
                            disabled={!isFileUploadEnabled}
                          />
                        </div>
                      </div>
                    </Dragger>
                  </div>
                </Spin>
              </div>
            </Form.Item>
            
            {/* File Preview dengan ref untuk scroll */}
            <div ref={filePreviewRef}>
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
                        {file.name || file.fileName}
                      </Typography>
                      <ButtonComponent
                        icon={<CloseOutlined style={{ color: "#58804D" }} />}
                        border={false}
                        onClick={() => handleRemove(index)}
                      />
                    </div>
                    <Typography>{bytesConverter(file.size)}</Typography>
                    {file.fileStatus === "error" ? (
                      <div className="flex w-full justify-between">
                        <span className={"text-red-700"}>Failed to Upload</span>
                        <ButtonComponent border={false}>
                          <span className={"text-green-800 mr-2"}>Re-upload</span>
                          <UndoOutlined style={{ color: "#58804D" }} />
                        </ButtonComponent>
                      </div>
                    ) : file.size <= MAX_FILE_SIZE ? (
                      loadingUpload ? (
                        <Progress
                          percent={fileProgress}
                          format={(percent) => `${percent}%`}
                        />
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <ButtonComponent
                            type="primary"
                            size={"middle"}
                            onClick={handleUpload}
                          >
                            Upload
                          </ButtonComponent>
                        </div>
                      )
                    ) : (
                      <span className={"text-red-700"}>
                        File is bigger than 5MB
                      </span>
                    )}
                  </div>
                  {file.status === "error" && (
                    <div className={"flex flex-col justify-end items-end"}>
                      <ButtonComponent border={false}>
                        <span
                          className={"text-green-800 mr-2"}
                          onClick={reUploadImage}
                        >
                          Re-upload
                        </span>
                        <UndoOutlined style={{ color: "#58804D" }} />
                      </ButtonComponent>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Form>
      );
    }
  };

  // remove file list
  const handleRemove = (index) => {
    setFileList((prevFileList) => {
      const updatedFileList = [...prevFileList];
      updatedFileList.splice(index, 1);
      return updatedFileList;
    });
    setFileName("");
  };

  return (
    <>
      {renderLayout(type)}
      
      <ModalAttention
        isOpen={isLinkModalVisible}
        handleCancel={() => setLinkModalVisible(false)}
        handleOk={() => setLinkModalVisible(false)}
        textList={"Please enter a valid link before uploading"}
        header="Link Required"
      />

      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDeleteOk}
        width={500}
        useOk={true}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            {`Are you sure want to delete it?`}
          </p>
        </div>
        <Alert
          message="Warning! if you delete this data, it will be permanently."
          type={"error"}
        />
      </ModalConfirm>

      <ModalConfirm
        isOpen={showRecalculateModal}
        handleCancel={handleRecalculateCancel}
        handleOk={handleRecalculateConfirm}
        width={500}
        useOk={true}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#FAAD14" }} />
          <p className={"text-[18px] font-bold"}>
            Data will be Recalculated
          </p>
        </div>
        <Alert
          message="You selected usage type NEED. Uploading this data will trigger a recalculation process. Are you sure you want to continue?"
          type={"warning"}
        />
      </ModalConfirm>
    </>
  );
};

export default UploadLayout;