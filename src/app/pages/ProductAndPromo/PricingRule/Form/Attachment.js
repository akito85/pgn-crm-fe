import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import { getSelectCategory } from "../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import ModalAttachment from "../Modal/ModalAttachment";
import { Input, Space, Spin, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../assets/Icon/index";
import { FilterOutlined, EyeOutlined } from "@ant-design/icons";
import { previewFileAttachment } from "../../../../../utils/previewFileAttachment";
import moment from "moment";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import FileSaver from "file-saver";
import productPromoHttpService from "../../../../../redux/services/productPromoHttpService";
import { getBase64 } from "../../../../../utils/getBase64";
import axios from "axios";
import { configApp } from "../../../../../constants/configApp";
import { tokenHeader } from "../../../../../utils/tokenHeader";

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  onFilter = (value, record) =>
    record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: onFilter,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || "-"
      ),
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

const columnAttachment = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  handleShow = () => {},
  type
) => {
  const res = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      sorter: true,
      width: 240,
      title: "CATEGORY",
      dataIndex: "category",
      align: "center",
      ...getColumnSearchProps(
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      sorter: true,
      width: 240,
      title: "FILE NAME",
      dataIndex: "fileName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (filename) => (
        <Tooltip placement="topLeft" title={filename}>
          {filename}
        </Tooltip>
      ),
    },
    {
      sorter: true,
      width: 240,
      title: "UPLOAD BY",
      dataIndex: "uploadBy",
      ...getColumnSearchProps(
        "uploadBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      sorter: true,
      width: 240,
      title: "UPLOAD DATE",
      dataIndex: "uploadDate",
      ...getColumnSearchProps(
        "uploadDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      sorter: true,
      width: 240,
      title: "FILE SIZE",
      align: "center",
      dataIndex: "fileSize",
      ...getColumnSearchProps(
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
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Preview">
              <EyeOutlined
                onClick={() => handleShow(r)}
                style={{ fontSize: "24px", color: "#0075bf" }}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <SVGIcon
                name="IconDelete"
                color={r.dataType !== "exist" ? "#D90000" : "#8D91A0"}
                width={24}
                className={
                  r.dataType === "exist"
                    ? "disabled cursor-not-allowed"
                    : undefined
                }
                onClick={
                  r.dataType !== "exist" ? () => handleDelete(r) : undefined
                }
              />
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ];
  return type !== "detail"
    ? res.filter(
        (column) =>
          column.dataIndex !== "uploadBy" && column.dataIndex !== "uploadDate"
      )
    : res;
};

const Attachment = (props) => {
  const { data = [], updateData = () => {}, type } = props;

  // Selector
  const { data_category } = useSelector((state) => state.pricingRule);

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // State
  const [modalUpload, setModalUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [loadingDownload, setLoadingDownload] = useState(false);

  // Use Effect
  useEffect(() => {
    dispatch(getSelectCategory());
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChangeAttachment = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const filterDataByPage = () => {
    let result = [...data];
    if (searchedColumn) {
      result = result.filter((item) => {
        console.log(item[searchedColumn], "searchedColumn");
        console.log(searchText, "searchText");
        return item[searchedColumn]?.includes(searchText);
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
    return result.slice((page - 1) * pageSize, page * pageSize);
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

  const handleShow = async (r) => {
    if (r.dataType !== "exist") {
      if (r.fileType.includes("application/vnd")) {
        FileSaver.saveAs(r.base64, r.fileName);
      } else {
        previewFileAttachment(r.base64);
      }
    } else {
      if ((r.fileType || r.type).includes("application/vnd")) {
        dispatch(productPromoHttpService.downloadData(r.urlFile1));
      } else {
        setLoadingDownload(true);
        const response = await axios.get(
          configApp.MASTER_MANAGEMENT + r.urlFile1,
          {
            headers: tokenHeader(),
            responseType: "blob",
          }
        );
        const base64 = await getBase64(response.data);
        setLoadingDownload(false);
        previewFileAttachment(base64);
      }
    }
  };

  return (
    <BaseContainer header={"Attachment Information"}>
      <Spin spinning={loadingDownload}>
        <div className="flex flex-col w-full gap-2">
          {type !== "detail" ? (
            <div>
              <p className="text-[13px] mb-0 text-dg-grey-dark">Attach File:</p>
              <div className="flex flex-row gap-2 items-center">
                <ButtonComponent
                  fontSizeClassname="text-[11px]"
                  size="small"
                  type="default"
                  onClick={() => setModalUpload(true)}
                >
                  Choose File
                </ButtonComponent>
                <p className="text-[11px] text-dg-grey-dark mb-0">
                  No file choosen
                </p>
              </div>
            </div>
          ) : null}

          <div className="pt-[30px]">
            <TablePagination
              dataSource={filterDataByPage()}
              totalData={data?.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChangeAttachment}
              onSizeChanger={handleChangeAttachment}
              tableScrolled={{ y: 300, x: 1500 }}
              columns={columnAttachment(
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                handleDelete,
                handleShow,
                type
              )}
              onSort={onSort}
            />
          </div>
        </div>
      </Spin>

      <ModalAttachment
        openUpload={modalUpload}
        updateData={updateData}
        categoryOptions={data_category}
        handleCancel={() => setModalUpload(false)}
        withLink
      />
    </BaseContainer>
  );
};

export default Attachment;
