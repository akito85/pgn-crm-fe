import React, { useRef, useState } from "react";
import NxTable from "../../../../../components/Nx/NxTable";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { previewFileAttachment } from "../../../../../utils/previewFileAttachment";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import moment from "moment";

const columnAttachmentData = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  previewFileAttachment = () => {}
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
      dataIndex: "fileCategoryName",
      sorter: true,
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
      dataIndex: "fileName",
      sorter: true,
      ...getColumnSearchProps(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOAD BY",
      dataIndex: "createdBy",
      sorter: true,
      ...getColumnSearchProps(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOAD DATE",
      dataIndex: "createdDate",
      sorter: true,
      ...getColumnSearchProps(
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      sorter: true,
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
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Preview">
              <span className="flex justify-center">
                <EyeOutlined
                  style={{ fontSize: "24px", color: "#0075bf" }}
                  onClick={() => {
                    if (r.links) {
                      previewFileAttachment(r.links);
                    }
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ];

  return res;
};
const TableAttachment = ({
  id = 0,
  getAPI = () => {},
  selector = "pricing",
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const { dataListAttachment } = useSelector((state) => state[selector]);
  useEffect(() => {
    if (id !== 0) {
      dispatch(getAPI({ id, page, pageSize, search, sort }));
    }
  }, [id, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataListAttachment && dataListAttachment.result) {
      const data = (dataListAttachment.result || []).map((attachData) => ({
        ...attachData,
        fileSize: bytesConverter(attachData.fileSize || 0),
        createdDate: attachData.createdDate
          ? moment(attachData.createdDate).format("DD MMM YYYY")
          : "",
      }));
      const totalData = dataListAttachment.page.totalElements;
      setDataTable(data);
      setTotalElement(totalData);
    }
  }, [dataListAttachment]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(selectedKeys[0] ? `${dataIndex}~${selectedKeys[0]}` : "");
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <NxTable
        idTable={"table-attachment-pricing-detail"}
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onChange={handleChangeSize}
        onSizeChanger={handleChangeSize}
        onSort={onSort}
        columns={columnAttachmentData(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          previewFileAttachment
        )}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  );
};

export default TableAttachment;
