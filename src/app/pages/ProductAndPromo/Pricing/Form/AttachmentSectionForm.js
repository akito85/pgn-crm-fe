import React, { useState, useEffect, useRef } from "react";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { Spin, Tooltip } from "antd";
import { EyeOutlined, UndoOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalAttachment from "./ModalAttachment";
import { useSelector } from "react-redux";
import { previewFileAttachment } from "../../../../../utils/previewFileAttachment";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import moment from "moment";
import productPromoHttpService from "../../../../../redux/services/productPromoHttpService";
import { getBase64 } from "../../../../../utils/getBase64";
import { tokenHeader } from "../../../../../utils/tokenHeader";
import axios from "axios";
import FileSaver from "file-saver";
import { configApp } from "../../../../../constants/configApp";
import { getGlobalPropertiesAttachment } from "../../../../../redux/slices/product_promo/product";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import NxTable from "../../../../../components/Nx/NxTable";

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
      return record.size.includes(search);
    default:
      return record[dataIndex]?.toLowerCase().includes(search);
  }
};


// extracting size 
const extractSize = (fileSize) => {
  if (fileSize.includes('KB')) {
    return parseFloat(fileSize.replace(' KB', '')) * 1024;
  } else if (fileSize.includes('MB')) {
    return parseFloat(fileSize.replace(' MB', '')) * 1024 * 1024;
  }
  return parseFloat(fileSize);

}

const sorter = (fieldSort, a, b) => {
  console.log(fieldSort, ' so');
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        const date = obj[fieldSort]
          ? moment(obj[fieldSort]).format("DD MMM YYYY")
          : "";
        return date.toString().toLowerCase();
      case "fileSize":
        return extractSize(obj[fieldSort]);
      default:
        return obj[fieldSort].toString().toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  if (fieldSort === 'fileSize') {
    return fa - fb;
  } else {
    return fa.localeCompare(fb);
  }
};

const columnAttachmentData = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  handleDelete = () => { },
  type,
  handleShow,
  canDeleteExisting = false,
  handleUndoDelete = () => { }
) => {
  const res = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      key: "fileCategoryName",
      width: 240,
      dataIndex: "fileCategoryName",
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
      key: "fileName",
      width: 240,
      dataIndex: "fileName",
      onFilter: (value, record) => onFilter("fileName", value, record),
      sorter: (a, b) => sorter("fileName", a, b),
      ...getColumnSearchPropsPaging(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOADED BY",
      key: "createdBy",
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
      key: "createdDate",
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
      key: "fileSize",
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
    },
    {
      title: "ACTION",
      key: "action",
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
              r.pendingDelete ? (
                <Tooltip title="Undo Delete">
                  <span className="flex justify-center cursor-pointer">
                    <UndoOutlined
                      style={{ fontSize: "20px", color: "#0075BF" }}
                      onClick={() => handleUndoDelete(r)}
                    />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Delete">
                  {(() => {
                    const canDel = r.dataType !== "exist" || canDeleteExisting;
                    return (
                      <span className={`flex justify-center${!canDel ? " cursor-not-allowed" : ""}`}>
                        <SVGIcon
                          name="IconDelete"
                          color={canDel ? "#D90000" : "#8D91A0"}
                          width={24}
                          className={!canDel ? "disabled" : undefined}
                          onClick={canDel ? () => handleDelete(r) : undefined}
                        />
                      </span>
                    );
                  })()}
                </Tooltip>
              )
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
const AttachmentSectionForm = ({
  data = [],
  updateData = () => { },
  type,
  typeSelector = "pricing",
  dispatch = () => { },
  getAPICategory = () => { },
  service = productPromoHttpService,
  configApplication = configApp.MASTER_MANAGEMENT,
  getAPIGuard = getGlobalPropertiesAttachment,
  mandatory = false,
  canDeleteExisting = false,
}) => {


  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalUpload, setModalUpload] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const { dataListCategory, getConfigFile } = useSelector((state) => state[typeSelector]);
  // console.log("🚀 ~ dataListCategory:", dataListCategory)
  const { dataGlobalPropAttachment } = useSelector((state) => state.product);
  const { data: dataUser = {} } = useSelector((state) => state.profile);

  useEffect(() => {
    if (dataListCategory && dataListCategory.length > 0) {
      const tempCategory = dataListCategory.map((category) => ({
        id: category.Id ?? category.glbTypeValId,
        text: category.text ?? category.name,
      }));
      setCategoryOptions(tempCategory);
    }
  }, [dataListCategory]);

  useEffect(() => {
    dispatch(getAPIGuard());
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
  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const handleUndoDelete = (record) => {
    updateData((prevState) =>
      prevState.map((item) =>
        item.id === record.id ? { ...item, pendingDelete: false } : item
      )
    );
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
        <NxTable
          idTable={"attachment-section-form"}
          userId={dataUser?.data?.username}
          showAdvanceSearch={false}
          showSearchBar={false}
          usePagination={false}
          type="FE"
          dataSource={data}
          totalData={data.length}
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
            handleShow,
            canDeleteExisting,
            handleUndoDelete
          )}
        />
        <ModalAttachment
          openUpload={modalUpload}
          updateData={updateData}
          categoryOptions={categoryOptions}
          handleCancel={() => setModalUpload(false)}
          valueGuard={
            configApplication === configApp.MASTER_MANAGEMENT
              ? dataGlobalPropAttachment
              : {}
          }
          withLink
        />
      </div>
    </Spin>
  );
};

export default AttachmentSectionForm;
