import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Spin, Tooltip, Button } from "antd";
import axios from "axios";
import FileSaver from "file-saver";
import Highlighter from "react-highlight-words";
import ModalAttachment from "./ModalAttachment";
import SVGIcon from "../../assets/Icon/index";
import NxTable from "../Nx/NxTable";
import NxDate from "../Nx/NxDatePicker";
import { previewFileAttachment } from "../../utils/previewFileAttachment";
import { getColumnSearchPropsPaging } from "../../utils/getColumnSearchProps";
import { getBase64 } from "../../utils/getBase64";
import { tokenHeader } from "../../utils/tokenHeader";
import { configApp } from "../../constants/configApp";
import { bytesConverter } from "../../utils/bytesConverter";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  switch (dataIndex) {
    case "startDate":
    case "endDate":
      const date = NxDate.formatDate(record[dataIndex], "DD MMM YYYY") || "";
      return date.toString().toLowerCase().includes(search);
    case "fileSize":
      return record.size?.toString().toLowerCase().includes(search);
    default:
      return record[dataIndex]?.toLowerCase().includes(search);
  }
};

const extractSize = (fileSize) => {
  if (fileSize === null || fileSize === undefined) return 0;
  // If already a number (raw bytes from API), return as-is
  if (typeof fileSize === "number") return fileSize;
  const str = String(fileSize);
  if (str.includes("KB")) {
    return parseFloat(str.replace(" KB", "")) * 1024;
  } else if (str.includes("MB")) {
    return parseFloat(str.replace(" MB", "")) * 1024 * 1024;
  }
  return parseFloat(str) || 0;
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        const date = NxDate.formatDate(obj[fieldSort], "DD MMM YYYY") || "";
        return date.toString().toLowerCase();
      case "fileSize":
        return extractSize(obj[fieldSort]);
      default:
        return obj[fieldSort].toString().toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  if (fieldSort === "fileSize") {
    return fa - fb;
  } else {
    return fa.localeCompare(fb);
  }
};

const columnAttachmentData = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  type,
  handleShow,
) => {
  const res = [
    {
      key: "no",
      title: "NO",
      width: 30,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      key: "fileCategoryName",
      title: "CATEGORY",
      width: 75,
      dataIndex: "fileCategoryName",
      align: "center",
      onFilter: (value, record) => onFilter("fileCategoryName", value, record),
      sorter: (a, b) => sorter("fileCategoryName", a, b),
      ...getColumnSearchPropsPaging(
        "fileCategoryName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      key: "fileName",
      title: "FILE NAME",
      width: 200,
      dataIndex: "fileName",
      ellipsis: {
        showTitle: false,
      },
      onFilter: (value, record) => onFilter("fileName", value, record),
      sorter: (a, b) => sorter("fileName", a, b),
      ...getColumnSearchPropsPaging(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        searchedColumn === "fileName" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      key: "createdBy",
      title: "UPLOADED BY",
      width: 100,
      dataIndex: "createdBy",
      onFilter: (value, record) => onFilter("createdBy", value, record),
      sorter: (a, b) => sorter("createdBy", a, b),
      ...getColumnSearchPropsPaging(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      key: "createdDate",
      title: "UPLOADED DATE",
      align: "center",
      width: 100,
      dataIndex: "createdDate",
      onFilter: (value, record) => onFilter("createdDate", value, record),
      sorter: (a, b) => sorter("createdDate", a, b),
      ...getColumnSearchPropsPaging(
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      key: "fileSize",
      title: "FILE SIZE",
      align: "center",
      width: 100,
      dataIndex: "fileSize",
      onFilter: (value, record) => onFilter("fileSize", value, record),
      sorter: (a, b) => sorter("fileSize", a, b),
      ...getColumnSearchPropsPaging(
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (fileSize, r, i) => (
        <span>
          {r?.dataType === "new" ? fileSize : bytesConverter(fileSize)}
        </span>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2 py-1">
            <Tooltip title="Preview">
              <Button
                type="table-action"
                disabled={!r.dataType === "exist"}
                onClick={() => handleShow(r)}
              >
                <SVGIcon name="IconEye" width={20} />
              </Button>
            </Tooltip>
            {type !== "detail" && type !== "confirmation" ? (
              <Tooltip title="Delete">
                <Button
                  type="table-action"
                  disabled={!r.dataType === "exist"}
                  onClick={() => handleDelete(r)}
                >
                  <SVGIcon name="IconDelete" width={20} />
                </Button>
              </Tooltip>
            ) : null}
          </div>
        );
      },
      key: "action",
    },
  ];
  if (type === "preview") {
    return res.filter(
      (column) =>
        column.dataIndex !== "createdBy" &&
        column.dataIndex !== "createdDate" &&
        column.title !== "ACTION",
    );
  }
  return type !== "detail"
    ? res.filter(
        (column) =>
          column.dataIndex !== "createdBy" &&
          column.dataIndex !== "createdDate",
      )
    : res;
};

const AttachmentComponent = ({
  data = [],
  updateData = () => {},
  type,
  typeSelector,
  dispatch = () => {},
  getAPICategory = () => {},
  service,
  configApplication = configApp.MASTER_MANAGEMENT,
  getAPIGuard,
  typeRBI,
  mandatory = false,
  idTable = "attachment-table",
}) => {
  // Selector
  const { dataListCategory } = useSelector((state) => state[typeSelector]);
  const {
    dataConfigMaster,
    dataConfigRBIData,
    dataConfigRBIInvoice,
    dataConfigRBIGeneralTemplate,
  } = useSelector((state) => state.attachment);

  // Declaration
  const searchInput = useRef(null);

  // State
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalUpload, setModalUpload] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);

  // Use Effect
  useEffect(() => {
    if (dataListCategory && dataListCategory.length > 0) {
      const tempCategory = dataListCategory.map((category) => ({
        id: category.Id,
        text: category.text,
      }));
      setCategoryOptions(tempCategory);
    }
  }, [dataListCategory]);

  useEffect(() => {
    if (getAPIGuard) {
      dispatch(getAPIGuard());
    }
  }, [dispatch, getAPIGuard]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    setSearchedColumn(tempSearchColumn);
  };

  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const handleOpenModal = () => {
    setModalUpload(true);
    dispatch(getAPICategory());
  };

  const handleShow = async (r) => {
    if (r.dataType !== "exist") {
      if (r.fileType.includes("application/vnd")) {
        FileSaver.saveAs(r.base64, r.fileName);
      } else {
        previewFileAttachment(r.base64);
      }
    } else {
      if ((r.fileType || r.type).includes("application/vnd")) {
        dispatch(service.downloadData(r.urlFile1));
      } else {
        setLoadingDownload(true);
        try {
          const response = await axios.get(configApplication + r.urlFile1, {
            headers: tokenHeader(),
            responseType: "blob",
          });
          const base64 = await getBase64(response.data);
          previewFileAttachment(base64);
        } catch (error) {
          console.error("Failed to download file", error);
        } finally {
          setLoadingDownload(false);
        }
      }
    }
  };

  const handleValueGuard = () => {
    if (configApplication === configApp.MASTER_MANAGEMENT) {
      return dataConfigMaster;
    } else if (configApplication === configApp.RATING_BILLING_SERVICE) {
      if (typeRBI === "data") {
        return dataConfigRBIData;
      } else if (typeRBI === "invoice") {
        return dataConfigRBIInvoice;
      } else if (typeRBI === "general_template") {
        return dataConfigRBIGeneralTemplate;
      } else {
        return {};
      }
    } else {
      return {};
    }
  };

  return (
    <Spin spinning={loadingDownload}>
      <div className="flex flex-col gap-y-4">
        {type !== "detail" && type !== "preview" && type !== "confirmation" ? (
          <div className="flex flex-col gap-y-2">
            <span className="text-sm">
              Attach File:
              {mandatory ? (
                <span className={"pl-1"} style={{ color: "red" }}>
                  *
                </span>
              ) : null}
            </span>
            <div className="flex gap-x-2 items-center">
              <Button type="menu" onClick={handleOpenModal}>
                Choose File
              </Button>
              {!data.length && (
                <span className="text-sm text-dg-grey-dark">
                  No file choosen
                </span>
              )}
            </div>
          </div>
        ) : null}
        <NxTable
          idTable={idTable}
          dataSource={data}
          totalData={data.length}
          tableScrolled={{ y: 300, x: 1500 }}
          columns={columnAttachmentData(
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handleDelete,
            type,
            handleShow,
          )}
          usePagination={false}
        />
        <ModalAttachment
          openUpload={modalUpload}
          updateData={updateData}
          categoryOptions={categoryOptions}
          handleCancel={() => setModalUpload(false)}
          withLink
          valueGuard={handleValueGuard()}
        />
      </div>
    </Spin>
  );
};

export default AttachmentComponent;
