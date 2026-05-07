import React, { useState, useRef } from "react";
import { Form, Progress, Spin, Typography, message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FileOutlined, CloseOutlined, UploadOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import TableRBI from "../../../../../../components/TableRBI";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import { uploadRestructureValidation, getDownloadTemplateRestructure } from "../../../../../../redux/slices/receipt_collection/restructure";
import DetailText from "../../../../../../components/DetailText";
import moment from "moment";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";

const { Dragger } = Upload;

const UploadRestructureLayout = ({
  type,
  onDocumentUpload = () => {},
}) => {
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const MAX_FILE_SIZE = 5000000;
  const dispatch = useDispatch();
  const { data_upload_validation } = useSelector((state) => state.restructure);
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
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        message.error('Invalid file type. Please upload Excel file only.');
        return false;
      }

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
      const body = { file: fileName };
      setLoadingUpload(true);
      
      const resultAction = await dispatch(uploadRestructureValidation(body)).unwrap();
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
              title: "Customer Number", 
              dataIndex: "customerNumber", 
              width: 180, 
              sorter: (a, b) => (a.customerNumber || "").localeCompare(b.customerNumber || ""),
              ...getColumnSearchProps("customerNumber", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Account Number", 
              dataIndex: "accountNumber", 
              width: 180,
              sorter: (a, b) => (a.accountNumber || "").localeCompare(b.accountNumber || ""),
              ...getColumnSearchProps("accountNumber", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Type", 
              dataIndex: "type", 
              width: 150,
              sorter: (a, b) => (a.type || "").localeCompare(b.type || ""),
              ...getColumnSearchProps("type", searchInput, searchedColumn, searchText, handleSearch)
            },
            { 
              title: "Tenor", 
              dataIndex: "tenor", 
              width: 100,
              sorter: (a, b) => (a.tenor || 0) - (b.tenor || 0),
            },
            { 
              title: "Start Period", 
              dataIndex: "startPeriod", 
              width: 150,
              render: (val) => val ? moment(val).format("MMM-YYYY") : "-",
            },
            { 
              title: "Status", 
              dataIndex: "validationStatus", 
              width: 120, 
              fixed: "right",
              render: (status) => (
                <span className={status === "VALID" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {status}
                </span>
              ),
            },
            { 
              title: "Message", 
              dataIndex: "validationMessage", 
              width: 250, 
              fixed: "right",
            },
        ];

        return (
            <div>
              <div className="grid grid-cols-3 gap-4 my-5">
                <DetailText label="Total Data">{batchInfo.totalData || 0}</DetailText>
                <DetailText label="Total Valid">{batchInfo.totalValid || 0}</DetailText>
                <DetailText label="Total Invalid">{batchInfo.totalInvalid || 0}</DetailText>
              </div>
              
              <p className="text-primary text-xs font-bold uppercase my-5">Restructure Preview</p>
              <TableRBI
                idTable="table-restructure-preview"
                columns={columns}
                dataSource={validationData.map((d, i) => ({ ...d, key: i }))}
                totalData={validationData.length}
                current={page}
                pageSize={pageSize}
                onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
                tableScrolled={{ x: 1500, y: 400 }}
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

export default UploadRestructureLayout;
