import React, { useState, useEffect, useRef } from "react";
import ButtonComponent from "../../../../../../../../../../components/ButtonComponent";
import { Spin, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../../../../../assets/Icon/index";
import ModalAttachment from "./ModalAttachmentPaymentRelation";
import { useSelector } from "react-redux";
import { previewFileAttachment } from "../../../../../../../../../../utils/previewFileAttachment";
import { getColumnSearchPropsPaging } from "../../../../../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import productPromoHttpService from "../../../../../../../../../../redux/services/productPromoHttpService";
import { getBase64 } from "../../../../../../../../../../utils/getBase64";
import { tokenHeader } from "../../../../../../../../../../utils/tokenHeader";
import axios from "axios";
import FileSaver from "file-saver";
import { configApp } from "../../../../../../../../../../constants/configApp";
import { getGlobalPropertiesAttachment } from "../../../../../../../../../../redux/slices/product_promo/product";
import TablePaginationNew from "../../../../../../../../../../components/TablePaginationNew";
import BaseContainer from "../../../../../../../../../../components/BaseContainer";
import { Form } from "antd";

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
                <span
                  className={`flex justify-center${r.dataType === "exist" ? " cursor-not-allowed" : ""
                    }`}
                >
                  <SVGIcon
                    name="IconDelete"
                    color={r.dataType !== "exist" ? "#D90000" : "#8D91A0"}
                    width={24}
                    className={r.dataType === "exist" ? "disabled" : undefined}
                    onClick={
                      r.dataType !== "exist" ? () => handleDelete(r) : undefined
                    }
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
const AttachmentSectionForm = ({
  data = [],
  updateData = () => { },
  type,
  dispatch = () => { },
  getAPICategory = () => { },
  service = productPromoHttpService,
  configApplication = configApp.MASTER_MANAGEMENT,
  getAPIGuard = getGlobalPropertiesAttachment,
  mandatory = false,
  className,
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalUpload, setModalUpload] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const { data_prAttachmentCategory, getConfigFile } = useSelector((state) => state.financialInformation);
  const { dataGlobalPropAttachment } = useSelector((state) => state.product);

  useEffect(() => {
    if (data_prAttachmentCategory && data_prAttachmentCategory.length > 0) {
      const tempCategory = data_prAttachmentCategory.map((category) => ({
        id: category.id,
        text: category.text,
      }));
      setCategoryOptions(tempCategory);
    }
  }, [data_prAttachmentCategory]);

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
    <div className={`${className} drop-shadow-lg bg-white rounded-lg w-full p-9`}>
      <Spin spinning={loadingDownload}>
        <div className="flex flex-col w-full gap-5">
          <span className="text-primary text-sm font-bold uppercase">
            ATTACHMENT
          </span>
          {type !== "detail" && type !== "preview" ? (
            <div className="flex flex-col w-full gap-2 items-end">
              <div className="flex flex-col gap-y-1 justify-start">
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
            </div>
          ) : null}
          <TablePaginationNew
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
              handleShow
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
    </div>  
  );
};

export default AttachmentSectionForm;
