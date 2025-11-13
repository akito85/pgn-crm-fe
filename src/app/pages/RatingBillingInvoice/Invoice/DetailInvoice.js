import React, { useState, useRef, useEffect, useMemo } from "react";
import { Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import BaseContainer from "../../../../components/CardContainer";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import axios from "axios";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";
import DocViewer from "react-doc-viewer";
import { sorterFunction } from "../../../../utils/sorterFunction";
import TableRBI from "../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

export const columns = (
  search,
  page = 0,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handlePreview = () => {}
) => [
  {
    title: "NO",
    key: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ACTION",
    key: "action",
    dataIndex: "action",
    sorter: (a, b) => sorterFunction("action", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "action",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "action",
        hasValue(search["action"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACTION BY",
    key: "actionBy",
    dataIndex: "actionBy",
    sorter: (a, b) => sorterFunction("actionBy", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "actionBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "actionBy",
        hasValue(search["actionBy"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "FORMAT OPTION",
    key: "formatOptionName",
    dataIndex: "formatOptionName",
    sorter: (a, b) => sorterFunction("formatOptionName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "formatOptionName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "formatOptionName",
        hasValue(search["formatOptionName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACTION DATE",
    key: "actionDate",
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
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "actionDate",
        hasValue(search["actionDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
    sorter: (a, b) => sorterFunction("status", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "status",
        search
      ),
  },
  {
    title: "REMARK",
    key: "remark",
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
      true
    ),
    render: (text) =>
      renderColumn(
        "remark",
        hasValue(search["remark"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "FILE ACTION",
    key: "actionButtons",
    fixed: "right",
    width: 100,
    align: "center",
    render: (id, record) => (
      <div className="flex w-full justify-center gap-6">
        <Tooltip title="Preview">
          <div
            className="pt-1 cursor-pointer"
            onClick={() => handlePreview(record)}
          >
            <DownloadOutlined style={{ fontSize: "25px" }} />
          </div>
        </Tooltip>
      </div>
    ),
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

  // ✅ State untuk fix column (dengan localStorage persistence)
  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("invoiceLogFixedColumns");
    return saved ? JSON.parse(saved) : { no: "left", actionButtons: "right" }; // Default fix
  });

  // ✅ Save to localStorage when fixedColumns change
  useEffect(() => {
    localStorage.setItem(
      "invoiceLogFixedColumns",
      JSON.stringify(fixedColumns)
    );
  }, [fixedColumns]);

  // ✅ Filter data based on search
  const filteredData = useMemo(() => {
    if (!detail || detail.length === 0) return [];

    let filtered = [...detail];

    // Apply search filters
    Object.keys(search).forEach((key) => {
      const searchValue = search[key];
      if (searchValue) {
        filtered = filtered.filter((item) => {
          const itemValue = item[key];
          if (itemValue === null || itemValue === undefined) return false;
          return String(itemValue)
            .toLowerCase()
            .includes(String(searchValue).toLowerCase());
        });
      }
    });

    return filtered;
  }, [detail, search]);

  // ✅ Sort data
  const sortedData = useMemo(() => {
    if (!fieldSort || !orderSort) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[fieldSort];
      const bValue = b[fieldSort];

      // Handle null/undefined
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Sort based on order
      if (orderSort === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [filteredData, fieldSort, orderSort]);

  // ✅ Paginate data (slice based on current page and pageSize)
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, pageSize]);

  // ✅ Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Function Search No API
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
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
        }
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
          viewerContainer
        );
      }
      console.log("Preview");
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  // ✅ Get base columns and add 'key' property to each column
  const baseColumns = useMemo(() => {
    const invoiceCols = columns(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      handlePreviewFile
    );

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = [...invoiceCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [search, page, pageSize, searchedColumn, searchText]);

  // ✅ Apply fixed columns using useMemo
  const processedColumns = useMemo(() => {
    return applyFixedColumns(baseColumns, fixedColumns);
  }, [baseColumns, fixedColumns]);

  // ✅ Extract column definitions for ColumnFixDropdown (with key and title only)
  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  return (
    <BaseContainer
      header={
        <div className="flex justify-between w-full h-8">
          <p>Invoice Log Information</p>
          <div className="flex flex-row align-middle gap-2 justify-end">
            <p className="text-[15px] font-semibold text-text-color-semibold">
              Invoice Number:
            </p>
            <p className="text-[15px] font-semibold text-primary">
              {invoiceNumber}
            </p>
          </div>
        </div>
      }
    >
      <div>
        {detail && (
          <TableRBI
            type="FE"
            dataSource={paginatedData} // ✅ Use paginated data
            columns={processedColumns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={sortedData.length} // ✅ Total from filtered & sorted data
            onSort={onSort}
            tableScrolled={{ y: 525, x: 1400 }}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
          />
        )}
      </div>
    </BaseContainer>
  );
};

export default DetailInvoice;
