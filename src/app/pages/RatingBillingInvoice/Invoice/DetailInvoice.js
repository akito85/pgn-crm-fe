import React, { useState, useRef, useMemo } from "react";
import { Tooltip } from "antd";
import axios from "axios";
import SVGIcon from "../../../../assets/Icon/index";

import BaseContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";

import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";

import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";
import CardContainer from "../../../../components/CardContainer";

export const columns = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handlePreview
) => [
  {
    title: "NO",
    key: "no",
    align: "center",
    width: 60,
    render: (_, __, index) => (page - 1) * pageSize + index + 1,
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
    ellipsis: { showTitle: false },
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
    title: "FILE",
    key: "actionButtons",
    width: 40,
    fixed: "right",
    isClassification: true,
    render: (_, record) => (
      <Tooltip title="Download">
        <SVGIcon name="IconDownload" width={20} />
      </Tooltip>
    ),
  },
];

const DetailInvoice = ({ detail, invoiceNumber }) => {
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  // FIXED COLUMN SESUAI FORMAT STANDARD
  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: ["actionButtons"], // default
  });

  // SEARCH HANDLER
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => ({
      ...prev,
      [dataIndex]: selectedKeys[0],
    }));
  };

  // FILTERING DATA
  const filteredData = useMemo(() => {
    if (!detail) return [];
    let filtered = [...detail];

    Object.keys(search).forEach((key) => {
      if (search[key]) {
        filtered = filtered.filter((item) =>
          String(item[key] ?? "")
            .toLowerCase()
            .includes(search[key].toLowerCase())
        );
      }
    });

    return filtered;
  }, [detail, search]);

  // PAGINATION DATA
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // HANDLE FILE PREVIEW
  const handlePreview = async (record) => {
    try {
      const res = await axios.get(
        `${configApp.RATING_BILLING_SERVICE}/v1/dbs/api/rbi/invoice/${record.id}/preview-log`,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        }
      );

      const contentType = res.headers["content-type"];
      const blob = new Blob([res.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (err) {
      console.error("Preview error:", err);
    }
  };

  // BUILD FINAL COLUMNS
  const finalColumns = useMemo(() => {
    const baseCols = columns(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      handlePreview
    );

    // Pastikan semua ada key
    return baseCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [search, page, pageSize, searchedColumn, searchText]);

  // COLUMN DEFINITIONS (untuk ColumnSettings)
  const columnDefinitions = useMemo(() => {
    return finalColumns.map((c) => ({
      key: c.key,
      title: c.title,
      width: c.width,
    }));
  }, [finalColumns]);

  return (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
          <p className="w-full mt-[15px]">Invoice Log Information</p>
          <p className="text-primary mt-[15px]">{invoiceNumber}</p>
        </div>
      }
    >
      <div className="pt-3">
        <TableRBI
          dataSource={paginatedData}
          columns={finalColumns}
          totalData={filteredData.length}
          current={page}
          pageSize={pageSize}
          onChange={(p) => setPage(p)}
          onSizeChanger={(p, s) => {
            setPage(1);
            setPageSize(s);
          }}
          tableScrolled={{ y: 500, x: "max-content" }}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
        />
      </div>
    </CardContainer>
  );
};

export default DetailInvoice;
