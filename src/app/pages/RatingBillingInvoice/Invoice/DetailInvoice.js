import React, { useState, useRef } from "react";
import { Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import BaseContainer from "../../../../components/BaseContainer";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import axios from "axios";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";
import DocViewer from "react-doc-viewer";
import { sorterFunction } from "../../../../utils/sorterFunction";
import TablePaginationNew from "../../../../components/TablePaginationNew";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handlePreview = () => {},
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ACTION",
    dataIndex: "action",
    sorter: (a, b) => sorterFunction("action", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "action",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "action",
        hasValue(search["action"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACTION BY",
    dataIndex: "actionBy",
    sorter: (a, b) => sorterFunction("actionBy", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "actionBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "actionBy",
        hasValue(search["actionBy"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "FORMAT OPTION",
    dataIndex: "formatOptionName",
    sorter: (a, b) => sorterFunction("formatOptionName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "formatOptionName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "formatOptionName",
        hasValue(search["formatOptionName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ACTION DATE",
    align: "center",
    dataIndex: "actionDate",
    sorter: (a, b) => sorterFunction("actionDate", a, b, "date"),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "actionDate",
      searchInput,
      searchedColumn,
      searchText,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "actionDate",
        hasValue(search["actionDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    sorter: (a, b) => sorterFunction("status", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "status",
        search,
      ),
  },
  {
    title: "REMARK",
    dataIndex: "remark",
    sorter: (a, b) => sorterFunction("remark", a, b),
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        true,
        "input",
        search,
      ),
  },
  {
    title: "ACTION",
    fixed: "right",
    width: 150,
    align: "center",
    render: (id, record) => {
      return (
        <div className="flex w-full justify-center gap-6">
          <Tooltip title="Preview">
            <div className="pt-1">
              <EyeOutlined
                style={{
                  fontSize: "24px",
                  color: "#0075bf",
                  cursor: "pointer",
                }}
                onClick={() => handlePreview(record)}
              />
            </div>
          </Tooltip>
        </div>
      );
    },
  },
];

const DetailInvoice = ({ detail, invoiceNumber }) => {
  // Declaration
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect

  // Function Search No API
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  // handle preview
  const handlePreviewFile = async (record) => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE +
          `/v1/dbs/api/rbi/invoice/${record?.id}/preview-log`,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        },
      );
      const responseBlob = await response.data;
      const blobText =
        responseBlob instanceof Blob ? await responseBlob.text() : responseBlob;
      const contentType = response.headers["content-type"];
      const blob = new Blob([blobText], {
        type: contentType ? "application/pdf" : "application/rtf",
      });
      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");

      if (newTab) {
        newTab.document.title = "PDF Preview";
        const viewerContainer = document.createElement("div");
        newTab.document.body.appendChild(viewerContainer);
        // eslint-disable-next-line no-undef
        ReactDOM.render(
          <DocViewer documents={[{ uri: blobUrl, type: contentType }]} />,
          viewerContainer,
        );
      }
      console.log("Preview");
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  return (
    <BaseContainer header={"Invoice Log Information"}>
      <div className="flex flex-row align-middle gap-2">
        <p className="text-[15px] font-semibold text-text-color-semibold">
          Invoice Number:
        </p>
        <p className="text-[15px] font-semibold text-primary">
          {invoiceNumber}
        </p>
      </div>
      <div>
        <TablePaginationNew
          type="FE"
          dataSource={detail}
          columns={columns(
            search,
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handlePreviewFile,
          )}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          // onSizeChanger={handleChange}
          totalData={detail?.length}
          onSort={onSort}
          tableScrolled={{ y: 525, x: 1400 }}
        />
      </div>
    </BaseContainer>
  );
};

export default DetailInvoice;
