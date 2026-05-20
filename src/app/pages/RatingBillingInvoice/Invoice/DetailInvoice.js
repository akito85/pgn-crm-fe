import React, { useState, useRef, useMemo } from "react";
import { Modal, Tooltip, Spin } from "antd";
import axios from "axios";
import SVGIcon from "../../../../assets/Icon/index";

import TableRBI from "../../../../components/TableRBI";
import BaseContainer from "../../../../components/BaseContainer";
import StatusComponent from "../../../../components/StatusComponent";
import ButtonComponent from "../../../../components/ButtonComponent";

import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";

import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
import { tokenHeader } from "../../../../utils/tokenHeader";
import { configApp } from "../../../../constants/configApp";

export const columns = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handlePreview,
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
      true,
    ),
    render: (text, record) => {
      const cell = renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "status",
        search,
      );
      if (text?.toUpperCase() === "FAILED" && record?.message) {
        return (
          <Tooltip title={record.message} placement="top">
            {cell}
          </Tooltip>
        );
      }
      return cell;
    },
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
      true,
    ),
    render: (text) =>
      renderColumn(
        "remark",
        hasValue(search["remark"]),
        searchText,
        text,
        true,
        "input",
        search,
      ),
  },
  {
    title: "FILE",
    key: "actionButtons",
    width: 40,
    fixed: "right",
    isClassification: true,
    render: (_, record) => {
      const isSuccess = record.status === "SUCCESS" && !!record.invoiceFile;
      return (
        <Tooltip title={isSuccess ? "View" : "File not available"}>
          <ButtonComponent
            type="text"
            border={false}
            icon={
              <SVGIcon
                name="IconEye"
                width={20}
                color={isSuccess ? undefined : "#d9d9d9"}
              />
            }
            disabled={!isSuccess}
            onClick={isSuccess ? () => handlePreview(record) : undefined}
          />
        </Tooltip>
      );
    },
  },
];

const DetailInvoice = ({ isOpen, onClose, detail, loading = false }) => {
  const logs = useMemo(() => detail?.logs ?? [], [detail?.logs]);
  const searchInput = useRef(null);

  const [displayedCount, setDisplayedCount] = useState(20);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: ["actionButtons"],
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => ({
      ...prev,
      [dataIndex]: selectedKeys[0],
    }));
    setDisplayedCount(20); // reset on new search
  };

  const filteredData = useMemo(() => {
    if (!logs) return [];
    let filtered = [...logs];
    Object.keys(search).forEach((key) => {
      if (search[key]) {
        filtered = filtered.filter((item) =>
          String(item[key] ?? "")
            .toLowerCase()
            .includes(search[key].toLowerCase()),
        );
      }
    });
    return filtered;
  }, [logs, search]);

  const displayedData = useMemo(
    () => filteredData.slice(0, displayedCount),
    [filteredData, displayedCount],
  );

  const hasMore = displayedCount < filteredData.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 20);
  };

  const handlePreview = async (record) => {
    try {
      const res = await axios.get(
        configApp.RATING_BILLING_SERVICE + `/v1/dbs/api/rbi/invoice/${record.id}/preview-log`,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      window.open(URL.createObjectURL(blob), "_blank");
    } catch (err) {
      console.error("Preview error:", err);
    }
  };

  const finalColumns = useMemo(() => {
    return columns(
      search,
      1,
      filteredData.length || 1,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      handlePreview,
    ).map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filteredData.length, searchedColumn, searchText]);

  const columnDefinitions = useMemo(
    () =>
      finalColumns.map((c) => ({ key: c.key, title: c.title, width: c.width })),
    [finalColumns],
  );

  const infoItems = [
    { label: "Invoice Number", value: detail?.invoiceNumber },
    { label: "Customer Name", value: detail?.customerName },
    { label: "Invoice Date", value: detail?.invoiceDate },
    { label: "Due Date", value: detail?.dueDate },
    { label: "Generate Status", value: detail?.status, isStatus: true },
    {
      label: "Stamping Meterai Status",
      value: detail?.stampingMeteraiStatus,
      isStatus: true,
    },
    { label: "Efaktur Status", value: detail?.einvoiceStatus, isStatus: true },
    { label: "Sign Status", value: detail?.signStatus, isStatus: true },
    { label: "Delivery Status", value: detail?.deliveryStatus, isStatus: true },
    { label: "Billing Period", value: detail?.billingPeriod },
  ];

  return (
    <Modal
      title="Invoice Detail"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnClose
      styles={{
        body: { maxHeight: "75vh", overflowY: "auto", padding: "16px" },
      }}
    >
      <Spin spinning={loading}>
        <BaseContainer border>
          <div className="grid grid-cols-5 gap-x-4 gap-y-4 p-3">
            {infoItems.map(({ label, value, isStatus }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">{label}</span>
                {isStatus ? (
                  <StatusComponent colour={value} size="small">
                    {value || ""}
                  </StatusComponent>
                ) : (
                  <span className="text-sm font-semibold">{value ?? "-"}</span>
                )}
              </div>
            ))}
          </div>
        </BaseContainer>

        <div className="mt-4">
          <BaseContainer border header="INVOICE LOG">
            <div className="mt-3">
              <TableRBI
                dataSource={displayedData}
                columns={finalColumns}
                totalData={filteredData.length}
                tableScrolled={{ y: 350, x: "max-content" }}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadMoreThreshold={20}
              />
            </div>
          </BaseContainer>
        </div>
      </Spin>
    </Modal>
  );
};

export default DetailInvoice;
