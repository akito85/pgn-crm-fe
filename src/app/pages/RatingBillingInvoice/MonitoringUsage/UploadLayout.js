import React, { useEffect, useRef } from "react";
import DetailText from "../../../../components/DetailText";
import { useState } from "react";
import { Alert, Form, Progress, Select, message, Tooltip } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import Dragger from "antd/lib/upload/Dragger";
import { bytesConverter } from "../../../../utils/bytesConverter";
import SVGIcon from "../../../../assets/Icon/index";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";

import ButtonComponent from "../../../../components/ButtonComponent";
import {
  CloseCircleFilled,
  FileOutlined,
  UndoOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import TablePagination from "../../../../components/TablePagination";
import {
  getFormatUsageType,
  uploadMonitoringUsage,
} from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { useDispatch, useSelector } from "react-redux";
import { useMonitoringList } from "./useMonirotingList";
import { useNavigate } from "react-router-dom";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  ModalAttention,
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";

const UploadLayout = ({
  dataTable,
  setDataTable = () => { },
  tabHeader,
  id,
  dataHeader,
  type,
  refreshData = () => { },
}) => {
  const [format, setFormat] = useState();
  const [fileList, setFileList] = useState([]);
  const [fileProgress, setFileProgress] = useState(0);
  const [recordId] = useState("");
  const [isFileUploadEnabled, setFileUploadEnabled] = useState(false);
  const [isLinkModalVisible, setLinkModalVisible] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [showRecalculateModal, setShowRecalculateModal] = useState(false);

  const MAX_FILE_SIZE = 5000000;
  const [form] = Form.useForm();
  const { loading } = useSelector((state) => state.monitoring_usage);
  const { columns, page, setPage, pageSize, setPageSize, onSort } =
    useMonitoringList(tabHeader, id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleDeleteOk = () => {
    const newData = dataTable.filter((item) => item.recordId !== recordId);
    setDataTable(newData);
    setModalDelete(false);
  };

  const updateDataPagination = (page, pageSize) => {
    return dataTable?.slice((page - 1) * pageSize, page * pageSize);
  };

  const handleFormat = (value) => {
    setFormat(value);
    setFileUploadEnabled(!!value);

    if (isNeedType(value)) {
      setShowRecalculateModal(true);
    }
  };

  const handleRecalculateConfirm = () => {
    setShowRecalculateModal(false);
  };

  const handleRecalculateCancel = () => {
    setShowRecalculateModal(false);
    setFormat(undefined);
    setFileUploadEnabled(false);
    form.resetFields(['format_usage_type']);
  };


  const property = {
    name: "documents",
    multiple: true,
    fileList: fileList,
    showUploadList: false,
    accept: ".xlsx, .xls",
    beforeUpload: (file, newFiles) => {
      if (!format) {
        form.validateFields(['format_usage_type']).catch(() => { });
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        message.error(`${file.name} exceeds 5 MB limit`);
      }

      // Only add files not already in list (by name+size)
      setFileList((prev) => {
        const exists = prev.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (exists) return prev;
        return [...prev, {
          name: file.name,
          size: file.size,
          type: file.type,
          originFileObj: file,
          _status: 'pending',
        }];
      });

      setTimeout(() => {
        filePreviewRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);

      return false;
    },
    onChange: ({ fileList: newList }) => { },
  };

  const handleUploadButtonClick = () => {
    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => { });
    }
  };

  const handleUpload = async () => {
    const validFiles = fileList.filter((f) => f.size <= MAX_FILE_SIZE);
    if (validFiles.length === 0) {
      message.error('No valid files to upload.');
      return;
    }

    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => { });
      return;
    }

    try {
      setFileProgress(0);
      // Mark all as uploading
      setFileList((prev) =>
        prev.map((f) =>
          f.size <= MAX_FILE_SIZE ? { ...f, _status: 'uploading' } : f
        )
      );
      setLoadingUpload(true);

      const rawFiles = validFiles.map((f) => f.originFileObj || f);
      const result = await dispatch(
        uploadMonitoringUsage({
          documents: rawFiles,
          calculationType: format.value,
          onProgress: (progress) => setFileProgress(progress),
        })
      ).unwrap();

      const uploadSummary = result?.uploadSummary || {};
      const failedFiles = uploadSummary?.failedFiles ?? 0;
      const failedFileNames = new Set(uploadSummary?.failedFileNames || []);
      const successfulFileNames = new Set(uploadSummary?.successfulFileNames || []);

      if (failedFiles === 0) {
        setFileList([]);
        setFileProgress(0);
      } else {
        setFileList((prev) =>
          prev
            .filter((f) => {
              if (f.size > MAX_FILE_SIZE) return true;
              if (failedFileNames.has(f.name)) return true;
              if (successfulFileNames.has(f.name)) return false;
              return false;
            })
            .map((f) => {
              if (f.size > MAX_FILE_SIZE) return f;
              return {
                ...f,
                _status: failedFileNames.has(f.name) ? 'error' : f._status,
              };
            })
        );
      }

      if (refreshData && typeof refreshData === "function") {
        refreshData();
      }

      if (failedFiles === 0) {
        navigate(RBI_ROUTES.MONITORING_USAGE_VIEW, {
          state: { defaultTab: "Batch List" },
        });
      }
    } catch (error) {
      setFileList((prev) =>
        prev.map((f) =>
          f.size <= MAX_FILE_SIZE ? { ...f, _status: 'error' } : f
        )
      );
      message.error('Upload failed. Please try again.');
    }
    setLoadingUpload(false);
  };

  const handleRetryFile = async (index) => {
    const file = fileList[index];
    if (!file || file.size > MAX_FILE_SIZE) return;
    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => { });
      return;
    }

    setFileList((prev) =>
      prev.map((f, i) => (i === index ? { ...f, _status: 'uploading' } : f))
    );
    setLoadingUpload(true);
    setFileProgress(0);

    try {
      const rawFile = file.originFileObj || file;
      const result = await dispatch(
        uploadMonitoringUsage({
          documents: [rawFile],
          calculationType: format.value,
          onProgress: (progress) => setFileProgress(progress),
        })
      ).unwrap();

      const uploadSummary = result?.uploadSummary || {};
      const failedFiles = uploadSummary?.failedFiles ?? 0;
      const failedFileNames = new Set(uploadSummary?.failedFileNames || []);
      const successfulFileNames = new Set(uploadSummary?.successfulFileNames || []);

      if (failedFiles === 0 || successfulFileNames.has(file.name)) {
        setFileList((prev) => prev.filter((_, i) => i !== index));
      } else {
        setFileList((prev) =>
          prev.map((f, i) => {
            if (i !== index) return f;
            return {
              ...f,
              _status: failedFileNames.has(file.name) ? 'error' : 'done',
            };
          })
        );
      }

      if (refreshData && typeof refreshData === "function") {
        refreshData();
      }

      if (failedFiles === 0) {
        navigate(RBI_ROUTES.MONITORING_USAGE_VIEW, {
          state: { defaultTab: "Batch List" },
        });
      }
    } catch (error) {
      setFileList((prev) =>
        prev.map((f, i) => (i === index ? { ...f, _status: 'error' } : f))
      );
      message.error(`Retry failed for ${file.name}. Please try again.`);
    }
    setLoadingUpload(false);
  };

  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleRemove = (index) => {
    setFileList((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDraggerClick = (e) => {
    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => { });
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
              rules={[{ validator: async () => Promise.resolve() }]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <div className="w-full">
                <div onClick={handleDraggerClick}>
                  <Dragger {...property} disabled={!isFileUploadEnabled}>
                    <p className="ant-upload-drag-icon">
                      <SVGIcon
                        name={"IconUploadAttachment"}
                        onClick={handleUploadButtonClick}
                      />
                    </p>
                    <p className="ant-upload-text text-bold">
                      Drag and drop your files here or{" "}
                      <span className="underline">click for upload</span>
                    </p>
                    <p className="ant-upload-hint">
                      The maximum file size is limited to 5 MB per file. You can upload multiple files.
                    </p>
                  </Dragger>
                </div>
              </div>
            </Form.Item>

            {/* Multi-file list — Collapsible */}
            {fileList.length > 0 && (
              <div ref={filePreviewRef}>
                <CollapsibleContainer
                  header={"Files Upload"}
                  border
                  defaultOpen
                >
                  <div className="flex flex-col gap-3 pt-3 pb-2">
                    {fileList.map((file, index) => {
                      const isError = file._status === "error";
                      const isUploading = file._status === "uploading";
                      const isDone = file._status === "done";
                      const isTooBig = file.size > MAX_FILE_SIZE;

                      return (
                        <div
                          key={index}
                          className={`border border-solid rounded-lg px-4 py-3 ${isError
                              ? "bg-[#FFF1F0] border-[#FFA39E]"
                              : "bg-white border-[#E5E7EB]"
                            }`}
                        >
                          {/* Row: icon + name + size + action */}
                          <div className="flex items-center gap-3">
                            {/* File Icon */}
                            <div className="flex-shrink-0">
                              <FileOutlined style={{ fontSize: 20, color: "#0075BF" }} />
                            </div>

                            {/* Name + size inline */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                {bytesConverter(file.size)}
                              </span>
                            </div>

                            {/* Right-side action per status */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isTooBig && (
                                <span className="text-xs text-red-500">Exceeds 5 MB</span>
                              )}
                              {isError && (
                                <ButtonComponent
                                  size="small"
                                  border={false}
                                  onClick={() => handleRetryFile(index)}
                                  style={{
                                    backgroundColor: "#1E293B",
                                    color: "#fff",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    height: "28px",
                                    padding: "0 14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "none",
                                  }}
                                >
                                  <UndoOutlined style={{ fontSize: "12px" }} />
                                  Try Again
                                </ButtonComponent>
                              )}
                              {isUploading && (
                                <Tooltip title="Cancel upload">
                                  <CloseCircleFilled
                                    onClick={() => handleRemove(index)}
                                    style={{
                                      fontSize: "20px",
                                      color: "#BE3036",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Tooltip>
                              )}
                              {(isDone || (!isUploading && !isError)) && (
                                <Tooltip title="Remove">
                                  <SVGIcon
                                    name="IconDelete"
                                    width={20}
                                    color="#BE3036"
                                    onClick={() => handleRemove(index)}
                                  />
                                </Tooltip>
                              )}
                            </div>
                          </div>

                          {/* Progress bar — full width, below filename row */}
                          {isUploading && (
                            <div className="mt-2">
                              <Progress
                                percent={fileProgress}
                                size="small"
                                strokeColor="#0075BF"
                                format={(p) => `${p}%`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContainer>
              </div>
            )}

            {/* Footer buttons */}
            {fileList.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <ButtonComponent
                  className="bg-[#fff]"
                  onClick={() => {
                    setFileList([]);
                    setFileProgress(0);
                  }}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type="submit"
                  onClick={handleUpload}
                  disabled={
                    loadingUpload ||
                    fileList.every((f) => f.size > MAX_FILE_SIZE)
                  }
                >
                  Upload
                </ButtonComponent>
              </div>
            )}
          </div>
        </Form>
      );
    }

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