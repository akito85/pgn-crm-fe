import React, { useState, useRef } from "react";
import { Form, Progress, Spin, Typography, message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FileOutlined, CloseOutlined, UndoOutlined, UploadOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import TableRBI from "../../../../../../components/TableRBI";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import { uploadWarrantyValidation } from "../../../../../../redux/slices/receipt_collection/warranty";
import DetailText from "../../../../../../components/DetailText";
import moment from "moment";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";

const { Dragger } = Upload;

const UploadWarrantyLayout = ({
  type,
  onDocumentUpload = () => {},
  dataHeader,
}) => {
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileProgress, setFileProgress] = useState(0);
  const [urlLink, setUrlLink] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const MAX_FILE_SIZE = 5000000;
  const dispatch = useDispatch();
  const { data_upload_validation } = useSelector((state) => state.warranty);
  const filePreviewRef = useRef(null);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const property = {
    name: "file",
    multiple: false,
    fileList: fileList,
    showUploadList: false,
    accept: ".xlsx, .xls",
    maxCount: 1,
    beforeUpload: (file) => {
      if (file.size > MAX_FILE_SIZE) {
        message.error('File size exceeds 5 MB limit');
        return false;
      }
      setFileName(file);
      setTimeout(() => {
        filePreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return false;
    },
    onChange: handleFileChange,
  };

  const handleUpload = async () => {
    try {
      setFileProgress(0);
      const body = { file: fileName };
      setLoadingUpload(true);
      
      const resultAction = await dispatch(uploadWarrantyValidation(body)).unwrap();
      onDocumentUpload(resultAction);
      
      setFileList([]);
      setFileName("");
    } catch (error) {
      message.error('Upload failed. Please try again.');
    } finally {
      setLoadingUpload(false);
    }
  };

  const renderLayout = () => {
    if (type === "detail-confirmation") {
        const batchInfo = data_upload_validation || {};
        const validationData = batchInfo.data || [];

        const columns = [
            { 
              title: "Account", 
              dataIndex: "accountNumber", 
              width: 180, 
              sorter: (a, b) => (a.accountNumber || "").localeCompare(b.accountNumber || ""),
              ...getColumnSearchProps("accountNumber", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "SA Number", 
              dataIndex: "saNumber", 
              width: 150,
              sorter: (a, b) => (a.saNumber || "").localeCompare(b.saNumber || ""),
              ...getColumnSearchProps("saNumber", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Type", 
              dataIndex: "warrantyType", 
              width: 100,
              sorter: (a, b) => (a.warrantyType || "").localeCompare(b.warrantyType || ""),
              ...getColumnSearchProps("warrantyType", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Doc No", 
              dataIndex: "documentNumber", 
              width: 150,
              sorter: (a, b) => (a.documentNumber || "").localeCompare(b.documentNumber || ""),
              ...getColumnSearchProps("documentNumber", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Doc Date", 
              dataIndex: "documentDate", 
              width: 120, 
              render: (val) => val ? moment(val).format("DD/MM/YYYY") : "-",
              sorter: (a, b) => moment(a.documentDate).unix() - moment(b.documentDate).unix()
            },
            { 
              title: "Bank", 
              dataIndex: "issuerBank", 
              width: 200,
              sorter: (a, b) => (a.issuerBank || "").localeCompare(b.issuerBank || ""),
              ...getColumnSearchProps("issuerBank", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Branch", 
              dataIndex: "issuerBranch", 
              width: 200,
              sorter: (a, b) => (a.issuerBranch || "").localeCompare(b.issuerBranch || ""),
              ...getColumnSearchProps("issuerBranch", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Currency", 
              dataIndex: "currency", 
              width: 100,
              sorter: (a, b) => (a.currency || "").localeCompare(b.currency || ""),
              ...getColumnSearchProps("currency", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Start Date", 
              dataIndex: "effectiveStartDate", 
              width: 120,
              render: (val) => val ? moment(val).format("DD/MM/YYYY") : "-",
              sorter: (a, b) => moment(a.effectiveStartDate).unix() - moment(b.effectiveStartDate).unix()
            },
            { 
              title: "End Date", 
              dataIndex: "effectiveEndDate", 
              width: 120,
              render: (val) => val ? moment(val).format("DD/MM/YYYY") : "-",
              sorter: (a, b) => moment(a.effectiveEndDate).unix() - moment(b.effectiveEndDate).unix()
            },
            { 
              title: "Term Type", 
              dataIndex: "claimPeriodTermType", 
              width: 120,
              sorter: (a, b) => (a.claimPeriodTermType || "").localeCompare(b.claimPeriodTermType || ""),
              ...getColumnSearchProps("claimPeriodTermType", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Term Value", 
              dataIndex: "claimPeriodTermValue", 
              width: 120,
              sorter: (a, b) => parseInt(a.claimPeriodTermValue || 0) - parseInt(b.claimPeriodTermValue || 0),
              ...getColumnSearchProps("claimPeriodTermValue", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Description", 
              dataIndex: "description", 
              width: 200,
              sorter: (a, b) => (a.description || "").localeCompare(b.description || ""),
              ...getColumnSearchProps("description", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Status", 
              dataIndex: "validationStatus", 
              width: 120, 
              fixed: "right",
              sorter: (a, b) => (a.validationStatus || "").localeCompare(b.validationStatus || ""),
              render: (status) => (
                <span className={status === "VALID" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {status}
                </span>
              ),
              ...getColumnSearchProps("validationStatus", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Message", 
              dataIndex: "validationMessage", 
              width: 250, 
              fixed: "right",
              sorter: (a, b) => (a.validationMessage || "").localeCompare(b.validationMessage || ""),
              ...getColumnSearchProps("validationMessage", searchInput, searchedColumn, searchText, handleSearch)
            },
        ];

        return (
            <div>
              <div className="grid grid-cols-3 gap-4 my-5">
                <DetailText label="Total Data">{batchInfo.totalData}</DetailText>
                <DetailText label="Total Valid">{batchInfo.totalValid}</DetailText>
                <DetailText label="Total Invalid">{batchInfo.totalInvalid}</DetailText>
              </div>
              
              <p className="text-primary text-xs font-bold uppercase my-5">Guarantee Preview</p>
              <TableRBI
                idTable="table-guarantee-preview"
                columns={columns}
                dataSource={validationData.map((d, i) => ({ ...d, key: i }))}
                totalData={validationData.length}
                current={page}
                pageSize={pageSize}
                onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
                tableScrolled={{ x: 2800, y: 400 }}
                showSearchBar={false}
                showAdvanceSearch={false}
              />
            </div>
        );
    }

    return (
      <div className="w-full">
        <Spin spinning={loadingUpload}>
          <Dragger {...property}>
            <p className="ant-upload-drag-icon">
              <SVGIcon name="IconUploadAttachment" />
            </p>
            <p className="ant-upload-text font-bold">
              Drag and drop your file here or <span className="underline">click for upload</span>
            </p>
            <p className="ant-upload-hint">The maximum file size is limited to 5 MB</p>
          </Dragger>
        </Spin>
        
        <div ref={filePreviewRef}>
          {fileName && (
            <div className="border-solid border border-gray-300 rounded-md my-4 py-2 px-3 flex gap-4 items-center">
              <FileOutlined style={{ fontSize: "20px" }} />
              <div className="flex flex-col w-full">
                <div className="flex w-full justify-between">
                  <Typography>{fileName.name}</Typography>
                  <ButtonComponent 
                    icon={<CloseOutlined />} 
                    border={false} 
                    onClick={() => { setFileList([]); setFileName(""); }} 
                  />
                </div>
                <Typography>{bytesConverter(fileName.size)}</Typography>
                <div className="flex gap-2 mt-2">
                   <ButtonComponent type="primary" onClick={handleUpload}>Upload & Validate</ButtonComponent>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return <div>{renderLayout()}</div>;
};

export default UploadWarrantyLayout;
