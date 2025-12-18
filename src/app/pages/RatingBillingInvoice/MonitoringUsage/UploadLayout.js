import React, { useEffect } from "react";
import DetailText from "../../../../components/DetailText";
import { useState } from "react";
import { Alert, Form, Progress, Select, Spin, Tooltip, Typography } from "antd";
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
  deleteSingleUsage, 
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
import * as XLSX from "xlsx";

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
  const [dataSource, setDataSource] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deletedRecord, setDeletedRecord] = useState(null);
  const [recordId, setRecordId] = useState(""); 
  const [isFileUploadEnabled, setFileUploadEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [modalValidationError, setModalValidationError] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const MAX_FILE_SIZE = 5000000;

  // Define expected columns based on format type
  const EXPECTED_COLUMNS = {
    default: [
      "ACCOUNT_NUMBER",
      "COST_CENTER",
      "BILLING_PERIOD",
      "ASSET_SERIAL_NUM",
      "MEAS_DATE",
      "DATE",
      "HOUR",
      "STREAM_ID",
      "TEMPERATURE",
      "PRESSURE",
      "CORRECTION_FACTOR",
      "CALORIE",
      "BEGIN_STAND",
      "END_STAND",
      "VOL_MEASURED_27",
      "VOL_MEASURED_60",
      "ENG_MEASURED",
      "GHV",
      "DESCRIPTION",
      "TAXATION_ROWID",
      "VOL_MSCF",
      "UNCORRECTED_VALUE",
      "SOURCE",
    ],
  };
  const { loading } = useSelector((state) => state.monitoring_usage);
  const { columns, page, setPage, pageSize, setPageSize, onSort } =
    useMonitoringList(tabHeader, id);
  const [tableDataSource, setTableDataSource] = useState([]);
  const dispatch = useDispatch();

  const { list_usage_type } = useSelector(
    (state) => state.monitoring_usage
  );

  useEffect(() => {
    try {
      dispatch(getFormatUsageType());
    } catch (error) {
      console.log("Error", error);
    }
  }, [dispatch]);

  // onChange Size
  const onChangeSize = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleUpdate = (record, values) => {
    const updatedData = { record };
    setDataSource((prevDataSource) => {
      return prevDataSource.map((data) =>
        data.key === record.key ? { ...data, ...updatedData } : data
      );
    });
    setSelectedRecord(null);
  };

  const handleDeleteOk = async () => {
    try {
      if (!recordId) {
        console.error("No recordId found");
        return;
      }

      const resultAction = await dispatch(deleteSingleUsage(recordId));
      
      if (deleteSingleUsage.fulfilled.match(resultAction)) {
        // Update local state setelah API berhasil
        const newData = dataTable.filter((item) => item.recordId !== recordId);
        setDataTable(newData);
        setModalDelete(false);
        
        // Refresh data dari parent component jika ada
        if (refreshData && typeof refreshData === 'function') {
          refreshData();
        }
      }
    } catch (error) {
      console.error("Error deleting usage:", error);
      setModalDelete(false);
    }
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
                    setDeletedRecord(record);
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
  };

  // data format
  const dataFormat = [
    { id: 1, text: "docs" },
    { id: 2, text: "xlxs" },
    { id: 3, text: "csv" },
  ];

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Validate Excel columns
  const validateExcelColumns = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convert to JSON to get headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length === 0) {
            reject({
              isValid: false,
              message: "File Excel kosong atau tidak memiliki data"
            });
            return;
          }

          // Check if file has at least header + 1 data row
          if (jsonData.length < 2) {
            reject({
              isValid: false,
              message: "File Excel hanya memiliki header tanpa data"
            });
            return;
          }

          // Get headers from first row
          const fileHeaders = jsonData[0];

          // Get expected columns based on format type
          const expectedColumns = EXPECTED_COLUMNS[format?.value] || EXPECTED_COLUMNS.default;

          // Check if all expected columns exist
          const missingColumns = expectedColumns.filter(
            col => !fileHeaders.includes(col)
          );

          if (missingColumns.length > 0) {
            reject({
              isValid: false,
              message: `Kolom yang hilang: ${missingColumns.join(", ")}`,
              missingColumns,
            });
            return;
          }

          // Check if ALL rows have values in ALL columns (strict validation)
          const dataRowsToCheck = jsonData.slice(1); // All data rows
          const columnsWithEmptyCells = [];
          const emptyRowNumbers = [];

          expectedColumns.forEach((colName) => {
            const colIndex = fileHeaders.indexOf(colName);
            if (colIndex !== -1) {
              // Check if ALL rows have data in this column
              dataRowsToCheck.forEach((row, rowIndex) => {
                const cellValue = row[colIndex];
                const isEmpty = cellValue === undefined || cellValue === null || cellValue === "";

                if (isEmpty) {
                  if (!columnsWithEmptyCells.includes(colName)) {
                    columnsWithEmptyCells.push(colName);
                  }
                  const actualRowNumber = rowIndex + 2; // +2 because: +1 for slice, +1 for header
                  if (!emptyRowNumbers.includes(actualRowNumber)) {
                    emptyRowNumbers.push(actualRowNumber);
                  }
                }
              });
            }
          });

          // Strict validation: all columns must have data in all rows
          if (columnsWithEmptyCells.length > 0) {
            const errorMessage = columnsWithEmptyCells.length <= 5
              ? `Kolom berikut memiliki data kosong: ${columnsWithEmptyCells.join(", ")}`
              : `${columnsWithEmptyCells.length} kolom memiliki data kosong: ${columnsWithEmptyCells.slice(0, 5).join(", ")}...`;

            reject({
              isValid: false,
              message: errorMessage,
              columnsWithEmptyCells,
              emptyRowNumbers: emptyRowNumbers.slice(0, 10),
            });
            return;
          }

          // Get actual data count (non-empty rows)
          const dataRows = jsonData.slice(1).filter(row => {
            return row.some(cell => cell !== undefined && cell !== null && cell !== "");
          });

          resolve({
            isValid: true,
            message: "Validasi kolom berhasil",
            headers: fileHeaders,
            rowCount: dataRows.length,
            totalColumns: expectedColumns.length,
            columnsWithEmptyCells: null // All columns have data if we reach this point
          });
        } catch (error) {
          reject({
            isValid: false,
            message: `Error membaca file Excel: ${error.message}`
          });
        }
      };

      reader.onerror = () => {
        reject({
          isValid: false,
          message: "Error membaca file"
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // properties dragger
  const property = {
    name: "file",
    multiple: false,
    fileList: fileList,
    showUploadList: false,
    accept: ".xlsx, .xls",
    maxCount: 1,
    beforeUpload: async (file) => {
      // Reset validation error
      setValidationError(null);
      setIsValidated(false);
      setValidationResult(null);

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setValidationError("Ukuran file melebihi 5MB");
        setModalValidationError(true);
        return false;
      }

      // Validate columns
      try {
        const validation = await validateExcelColumns(file);
        console.log("Validation result:", validation);
        setFileName(file);
        setIsValidated(true);
        setValidationResult(validation);
      } catch (error) {
        console.error("Validation error:", error);
        setValidationError(error.message);
        setModalValidationError(true);
        setIsValidated(false);
        return false;
      }

      return false;
    },
    onChange: handleFileChange,
  };

  const handleUploadButtonClick = () => {
    if (!format) {
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleUpload = async () => {
    try {
      setFileProgress(0);
      const body = {
        document: fileName,
        calculationType: format.value,
        onProgress: (progress) => setFileProgress(progress),
      };
      setLoadingUpload(true);
      await dispatch(uploadMonitoringUsage(body)).unwrap();
      
      // ✅ Refresh data setelah upload berhasil
      if (refreshData && typeof refreshData === 'function') {
        refreshData();
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
    setLoadingUpload(false);
  };

  // handle upload by link
  const handleUploadLink = async () => {
    try {
      setFileProgress(0);
      const body = {
        document: urlLink,
        calculationType: format.value,
        onProgress: (progress) => setFileProgress(progress),
      };
      await dispatch(uploadMonitoringUsage(body)).unwrap();
      
      // ✅ Refresh data setelah upload berhasil
      if (refreshData && typeof refreshData === 'function') {
        refreshData();
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

  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // update link files
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

  // remove file list
  const handleRemove = (index) => {
    setFileList((prevFileList) => {
      const updatedFileList = [...prevFileList];
      updatedFileList.splice(index, 1);
      return updatedFileList;
    });
    setIsValidated(false);
    setValidationResult(null);
    setFileName("");
  };

  // Handle confirm upload after validation success
  const handleConfirmUpload = () => {
    handleUpload();
  };

  // Handle re-upload (reset file)
  const handleReUpload = () => {
    setFileList([]);
    setFileName("");
    setIsValidated(false);
    setValidationResult(null);
    setValidationError(null);
    setModalValidationError(false);
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
        <Form>
          <div className={"w-full flex flex-col gap-4"}>
            <span className={"text-xl"}>Upload Usage List</span>
            <div className={"w-full flex no-margin-form justify-end"}>
              <Form.Item className="w-1/4">
                <SelectComponent
                  allowClear={false}
                  mandatory
                  label={"Format Usage Type"}
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
            <Form.Item name={"file"}>
              <div className="w-full">
                <Spin spinning={loadingUpload}>
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
                    <div className="flex my-5 justify-center items-center">
                      <div className="flex gap-3 justify-center items-center">
                        <InputComponent onChange={updateLink} />
                        <ButtonComponent
                          icon={<UploadOutlined />}
                          type={"submit"}
                          border={false}
                          onClick={handleUploadLink}
                        />
                      </div>
                    </div>
                  </Dragger>
                </Spin>
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
                    ) : isValidated && validationResult ? (
                      <div className="flex flex-col gap-2 mt-2">
                        <span className={"text-green-700 font-semibold"}>
                          ✓ Validasi berhasil - Semua kolom terisi lengkap
                        </span>
                        <div className="text-sm text-gray-600">
                          <div>• {validationResult.rowCount} baris data</div>
                          <div>• {validationResult.totalColumns} kolom tervalidasi</div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <ButtonComponent
                            type="primary"
                            onClick={handleConfirmUpload}
                          >
                            <UploadOutlined /> Confirm Upload
                          </ButtonComponent>
                        </div>
                      </div>
                    ) : null
                  ) : (
                    <span className={"text-red-700"}>
                      File is bigger than 5MB
                    </span>
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
            ))}
          </div>
        </Form>
      );
    }
  };

  return (
    <>
      {renderLayout(type)}
      <ModalAttention
        isOpen={isModalVisible}
        handleCancel={handleModalClose}
        handleOk={handleModalClose}
        textList={"format usage type before uploading a file"}
        header="Failed"
      />
      <ModalConfirm
        isOpen={modalValidationError}
        handleCancel={() => {
          setModalValidationError(false);
          handleReUpload();
        }}
        handleOk={() => {
          setModalValidationError(false);
          handleReUpload();
        }}
        width={500}
        useOk={true}
        okText="Upload Ulang"
        cancelText="Batal"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              Validasi File Gagal
            </p>
          </div>
          <Alert
            message={validationError || "Validasi file gagal"}
            type={"error"}
          />
          <p className="text-center">
            Silakan upload ulang file dengan format yang sesuai
          </p>
        </div>
      </ModalConfirm>
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
    </>
  );
};

export default UploadLayout;