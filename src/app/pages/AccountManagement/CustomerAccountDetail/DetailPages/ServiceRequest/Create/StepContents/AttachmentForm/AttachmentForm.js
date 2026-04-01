import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import { Input, Spin, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import { configApp } from "../../../../../../../../../constants/configApp";
import { getBase64 } from "../../../../../../../../../utils/getBase64";
import { tokenHeader } from "../../../../../../../../../utils/tokenHeader";
import { getColumnSearchProps } from "../../../../../../../../../utils/getColumnSearchProps";
import { previewFileAttachment } from "../../../../../../../../../utils/previewFileAttachment";
import ModalAttachment from "./ModalAttachment";
import axios from "axios";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import { getCategoryAttachment } from "../../../../../../../../../redux/slices/account_management/Account/accountSlice";
import { getGlobalPropertiesAttachment } from "../../../../../../../../../redux/slices/product_promo/product";

export const columnAttachmentData = (
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
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      sorter: true,
      align: "center",
      dataIndex: "fileCategoryName",
      ...getColumnSearchProps(
        "fileCategoryName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FILE NAME",
      sorter: true,
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
      title: "UPLOAD BY",
      sorter: true,
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
      title: "UPLOADED DATE",
      sorter: true,
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
      title: "FILE SIZE",
      sorter: true,
      dataIndex: "fileSize",
      align: "center",
      ...getColumnSearchProps(
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
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="w-full flex justify-center gap-4">
            <Tooltip title="Preview">
              <div className="pt-1">
                <EyeOutlined
                  style={{ fontSize: "24px", color: "#0075bf" }}
                  onClick={() => handleShow(r)}
                />
              </div>
            </Tooltip>
            <Tooltip title="Delete">
              <div className="pt-1">
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  onClick={() => handleDelete(r)}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ];
  if (type === "preview") {
    return res.filter(
      (column) =>
        column.dataIndex !== "uploadBy" &&
        column.dataIndex !== "uploadDate" &&
        column.title !== "ACTION"
    );
  }
  return type !== "detail"
    ? res.filter(
        (column) =>
          column.dataIndex !== "uploadBy" && column.dataIndex !== "uploadDate"
      )
    : res;
};

const AttachmentForm = ({
  data = [],
  updateData = () => {},
  type,
  typeSelector = "account",
}) => {
  // Redux hooks
  const dispatch = useDispatch();
  const { data_categoryAttachment } = useSelector((state) => state[typeSelector]);
  const { dataGlobalPropAttachment } = useSelector((state) => state.product);

  // Declaration
  const searchInput = useRef(null);

  const CHUNK_SIZE = 20;

  // State
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [modalUpload, setModalUpload] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  // Use Effect
  useEffect(() => {
    dispatch(getCategoryAttachment());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getGlobalPropertiesAttachment());
  }, [dispatch]);

  useEffect(() => {
    if (data_categoryAttachment && data_categoryAttachment.length > 0) {
      const tempCategory = data_categoryAttachment.map((category) => ({
        id: category.id,
        text: category.name,
      }));
      setCategoryOptions(tempCategory);
    }
  }, [data_categoryAttachment]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setVisibleCount(CHUNK_SIZE);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
    setVisibleCount(CHUNK_SIZE);
  };
  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const handleOpenModal = () => {
    setModalUpload(true);
  };

  const getFilteredData = () => {
    let result = [...data];
    if (searchedColumn) {
      result = result.filter((item) =>
        item[searchedColumn]?.toLowerCase().includes(searchText.toLowerCase())
      );
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
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  };

  const handleShow = async (r) => {
    if (r.dataType !== "exist") {
      previewFileAttachment(r.base64);
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
  };

  return (
    <Spin spinning={loadingDownload}>
      <NxCardContainer header="ATTACHMENT INFORMATION">
        <NxBaseContainer border>
        <div className="flex flex-col w-full gap-3">
        {type !== "detail" && type !== "preview" ? (
          <div className="flex flex-col w-full gap-2">
            <p className="text-[13px] mb-0 text-dg-grey-dark">
              Attach File:
              {(
                <span className={"pl-1"} style={{ color: "red" }}>
                  *
                </span>
              )}
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
        {(() => {
          const filteredData = getFilteredData();
          const hasMore = visibleCount < filteredData.length;
          const handleLoadMore = () =>
            new Promise((resolve) => {
              setVisibleCount((prev) => prev + CHUNK_SIZE);
              resolve();
            });
          return (
            <NxTable
              idTable="service-request-attachment-table"
              useSelect={false}
              usePagination={false}
              useInfiniteScroll
              dataSource={filteredData.slice(0, visibleCount)}
              totalData={filteredData.length}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              tableScrolled={{ y: 400, x: 1000 }}
              columns={columnAttachmentData(
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
          );
        })()}
        <ModalAttachment
          openUpload={modalUpload}
          updateData={updateData}
          categoryOptions={categoryOptions}
          handleCancel={() => setModalUpload(false)}
          withLink
          valueGuard={dataGlobalPropAttachment}
        />
        </div>
        </NxBaseContainer>
      </NxCardContainer>
    </Spin>
  );
};

export default AttachmentForm;
