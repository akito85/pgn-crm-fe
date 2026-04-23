import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import FileSaver from "file-saver";
import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { previewFileAttachment } from "../../../../../../../utils/previewFileAttachment";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import { getBase64 } from "../../../../../../../utils/getBase64";
import { tokenHeader } from "../../../../../../../utils/tokenHeader";
import { configApp } from "../../../../../../../constants/configApp";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";
import ModalAttachment from "../../../../../../../components/Modal/ModalAttachment";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../../components/TablePagination";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  switch (dataIndex) {
    case "startDate":
    case "endDate":
      const date = record[dataIndex]
        ? moment(record[dataIndex]).format("DD MMM YYYY")
        : "";
      return date.toString().toLowerCase().includes(search);
    case "fileSize":
      const tempFileSize = record[dataIndex] || 0;
      return tempFileSize.toString().toLowerCase().includes(search);
    default:
      return record[dataIndex]?.toLowerCase().includes(search);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        const date = obj[fieldSort]
          ? moment(obj[fieldSort]).format("DD MMM YYYY")
          : "";
        return date.toString().toLowerCase();
      case "fileSize":
        const tempFileSize = obj[fieldSort];
        return tempFileSize.toString().toLowerCase();
      default:
        return obj[fieldSort].toString().toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

const columnAttachmentData = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  type,
  handleShow
) => {
  const res = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      width: 240,
      dataIndex: "fileCategoryName",
      align: "center",
      onFilter: (value, record) => onFilter("fileCategoryName", value, record),
      sorter: (a, b) => sorter("fileCategoryName", a, b),
      ...getColumnSearchPropsPaging(
        "fileCategoryName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FILE NAME",
      width: 240,
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
        handleSearch
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
      title: "UPLOADED BY",
      width: 240,
      dataIndex: "createdBy",
      onFilter: (value, record) => onFilter("createdBy", value, record),
      sorter: (a, b) => sorter("createdBy", a, b),
      ...getColumnSearchPropsPaging(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOADED DATE",
      align: "center",
      width: 240,
      dataIndex: "createdDate",
      onFilter: (value, record) => onFilter("createdDate", value, record),
      sorter: (a, b) => sorter("createdDate", a, b),
      ...getColumnSearchPropsPaging(
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FILE SIZE",
      align: "center",
      width: 240,
      dataIndex: "fileSize",
      onFilter: (value, record) => onFilter("fileSize", value, record),
      sorter: (a, b) => sorter("fileSize", a, b),
      ...getColumnSearchPropsPaging(
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      width: 180,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Preview">
              <span className="flex justify-center">
                <EyeOutlined
                  style={{ fontSize: "24px", color: "#0075bf" }}
                  onClick={() => handleShow(r)}
                />
              </span>
            </Tooltip>
            {type !== "detail" ? (
              <Tooltip title="Delete">
                <span className="flex justify-center">
                  <SVGIcon
                    name="IconDelete"
                    color="#D90000"
                    width={24}
                    onClick={() => handleDelete(r)}
                  />
                </span>
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
        column.title !== "ACTION"
    );
  }
  return type !== "detail"
    ? res.filter(
        (column) =>
          column.dataIndex !== "createdBy" && column.dataIndex !== "createdDate"
      )
    : res;
};

const AttachmentSectionComponent = ({
  data = [],
  updateData = () => {},
  type,
  typeSelector,
  dispatch = () => {},
  getAPICategory = () => {},
  service,
  configApplication,
  getAPIGuard,
  typeRBI,
  mandatory = false,
}) => {
  // Selector
  const { dataListCategory, getConfigFile } = useSelector(
    (state) => state[typeSelector]
  );
  const {
    dataConfigMaster,
    dataConfigRBIData,
    dataConfigRBIInvoice,
    dataConfigRBIGeneralTemplate,
  } = useSelector((state) => state.attachment);

  // Declaration
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
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
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
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

  const filterDataByPage = (typeData = "data") => {
    let result = [...data];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        case "fileSize":
          return obj.size;
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
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
        const response = await axios.get(configApplication + r.urlFile1, {
          headers: tokenHeader(),
          responseType: "blob",
        });
        const base64 = await getBase64(response.data);
        setLoadingDownload(false);
        previewFileAttachment(base64);
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
      } else if (typeRBI === "standalone") {
        return getConfigFile;
      } else {
        return {};
      }
    } else {
      return {};
    }
  };

  return (
    <Spin spinning={loadingDownload}>
      <div className="flex flex-col w-full gap-3">
        {type !== "detail" && type !== "preview" ? (
          <div className="flex flex-col w-full gap-2">
            <p className="text-[13px] mb-0 text-dg-grey-dark">
              Attach File:
              {mandatory ? (
                <span className={"pl-1"} style={{ color: "red" }}>
                  *
                </span>
              ) : null}
            </p>
            <div className="flex flex-row gap-2 items-center">
              <ButtonComponent
                fontSizeClassname="text-[11px]"
                size="small"
                type="default"
                onClick={handleOpenModal}
              >
                Choose File
              </ButtonComponent>
              <p className="text-[11px] text-dg-grey-dark mb-0">
                No file choosen
              </p>
            </div>
          </div>
        ) : null}
        <TablePagination
          dataSource={filterDataByPage("data")}
          totalData={filterDataByPage("length")}
          current={page}
          pageSize={pageSize}
          tableScrolled={{ y: 300, x: 1500 }}
          onChange={handleChangeSize}
          columns={columnAttachmentData(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handleDelete,
            type,
            handleShow
          )}
          onSort={onSort}
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

export default AttachmentSectionComponent;
