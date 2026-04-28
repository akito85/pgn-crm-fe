import React, { useEffect, useRef } from "react";
import DetailText from "../../../../components/DetailText";
import { useState } from "react";
import { Alert, Form, Progress, Select, message } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import Dragger from "antd/lib/upload/Dragger";
import { bytesConverter } from "../../../../utils/bytesConverter";
import SVGIcon from "../../../../assets/Icon/index";

import ButtonComponent from "../../../../components/ButtonComponent";
import {
  CloseOutlined,
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
        form.validateFields(['format_usage_type']).catch(() => {});
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
    onChange: ({ fileList: newList }) => {},
  };

  const handleUploadButtonClick = () => {
    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => {});
    }
  };

  const handleUpload = async () => {
    const validFiles = fileList.filter((f) => f.size <= MAX_FILE_SIZE);
    if (validFiles.length === 0) {
      message.error('No valid files to upload.');
      return;
    }

    if (!format) {
      form.validateFields(['format_usage_type']).catch(() => {});
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
      await dispatch(
        uploadMonitoringUsage({
          documents: rawFiles,
          calculationType: format.value,
          onProgress: (progress) => setFileProgress(progress),
        })
      ).unwrap();

      setFileList((prev) =>
        prev.map((f) =>
          f.size <= MAX_FILE_SIZE ? { ...f, _status: 'done' } : f
        )
      );
      if (refreshData && typeof refreshData === "function") {
        refreshData();
      }

      setFileList([]);
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
      form.validateFields(['format_usage_type']).catch(() => {});
      return;
    }

    setFileList((prev) =>
      prev.map((f, i) => (i === index ? { ...f, _status: 'uploading' } : f))
    );
    setLoadingUpload(true);
    setFileProgress(0);

    try {
      const rawFile = file.originFileObj || file;
      await dispatch(
        uploadMonitoringUsage({
          documents: [rawFile],
          calculationType: format.value,
          onProgress: (progress) => setFileProgress(progress),
        })
      ).unwrap();

      setFileList((prev) =>
        prev.map((f, i) => (i === index ? { ...f, _status: 'done' } : f))
      );
      if (refreshData && typeof refreshData === "function") {
        refreshData();
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

            {/* Multi-file list — styled like reference */}
            {fileList.length > 0 && (
              <div ref={filePreviewRef} className="border border-solid border-[#D9E8F5] rounded-lg overflow-hidden">
                <div className="bg-[#EBF4FB] px-4 py-2 border-b border-solid border-[#D9E8F5]">
                  <span className="text-[#0075BF] text-xs font-bold uppercase tracking-wide">
                    Files Upload
                  </span>
                </div>
                <div className="divide-y divide-solid divide-[#F0F0F0]">
                  {fileList.map((file, index) => {
                    const isError = file._status === "error";
                    const isUploading = file._status === "uploading";
                    const isTooBig = file.size > MAX_FILE_SIZE;

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 px-4 py-3 ${isError ? "bg-red-50" : "bg-white"}`}
                      >
                        {/* File Icon */}
                        <div className="mt-1">
                          <FileOutlined style={{ fontSize: "18px", color: "#0075BF" }} />
                        </div>

                        {/* File Info */}
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isError && (
                                <ButtonComponent
                                  size="small"
                                  border={false}
                                  onClick={() => handleRetryFile(index)}
                                  style={{
                                    backgroundColor: "#0075BF",
                                    color: "#fff",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    height: "24px",
                                    padding: "0 8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <UndoOutlined style={{ fontSize: "11px" }} />
                                  Try Again
                                </ButtonComponent>
                              )}
                              {!isUploading && (
                                <CloseOutlined
                                  onClick={() => handleRemove(index)}
                                  style={{
                                    fontSize: "12px",
                                    color: isError ? "#BE3036" : "#8c8c8c",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {bytesConverter(file.size)}
                          </span>
                          {isTooBig && (
                            <span className="text-xs text-red-500 mt-1">
                              File exceeds 5 MB limit
                            </span>
                          )}
                          {isUploading && (
                            <Progress
                              percent={fileProgress}
                              size="small"
                              className="mt-1"
                              format={(p) => `${p}%`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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