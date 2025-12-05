import React from "react";
import { Tooltip, Dropdown } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import SVGIcon from "../../../../../assets/Icon/index";
import StatusComponent from "../../../../../components/StatusComponent";
import { INVOICE_ROUTES } from "../../../../../routes/invoice/invoice_routes";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { currencyFormatting } from "../../../../../utils/formatCurrency";
import { Link } from "react-router-dom";

export const getEFakturColumns = ({
  page,
  pageSize,
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handleApprovalHistory,
  handleGenerateEFaktur,
  handleGenerateXML,
  handleUploadEFaktur,
  handleReplaceFaktur,
  handleCancelFaktur,
  handleLogAktivitas,
}) => {
  return [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "efakturNo",
      title: "KODE FAKTUR",
      dataIndex: "efakturNo",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.efakturNo] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "efakturNo",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "efakturNo",
          hasValue(search["efakturNo"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "invoiceNumber",
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.invoiceNumber] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "invoiceNumber",
          hasValue(search["invoiceNumber"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "billingCode",
      title: "BILLING CODE",
      dataIndex: "billingCode",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.billingCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billingCode",
          hasValue(search["billingCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "sor",
      title: "SOR",
      dataIndex: "sor",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.sor] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "sor",
          hasValue(search["sor"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "costCenter",
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.costCenter] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "costCenter",
          hasValue(search["costCenter"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "meterReadingCode",
      title: "METER READING",
      dataIndex: "meterReadingCode",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.meterReadingCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "meterReadingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "meterReadingCode",
          hasValue(search["meterReadingCode"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "accountName",
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 250,
      align: "left",
      sorter: true,
      filteredValue: [search?.accountName] || null,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountName",
          hasValue(search["accountName"]),
          searchText,
          text || "-",
          true,
          "input",
          search
        ),
    },
    {
      key: "typePpn",
      title: "TYPE PPN",
      dataIndex: "typePpn",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.typePpn] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "typePpn",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "typePpn",
          hasValue(search["typePpn"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "name",
      title: "CUSTOMER NAME",
      dataIndex: "name",
      width: 250,
      align: "left",
      sorter: true,
      filteredValue: [search?.name] || null,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "name",
          hasValue(search["name"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "accountSegment",
      title: "SEGMENT",
      dataIndex: "accountSegment",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.accountSegment] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountSegment",
          hasValue(search["accountSegment"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.accountNumber] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountNumber",
          hasValue(search["accountNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "npwpCust",
      title: "NPWP CUSTOMER",
      dataIndex: "npwpCust",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.npwpCust] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "npwpCust",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "npwpCust",
          hasValue(search["npwpCust"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "fullAddress",
      title: "TAX ADDRESS",
      dataIndex: "fullAddress",
      width: 300,
      align: "left",
      sorter: true,
      filteredValue: [search?.fullAddress] || null,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "fullAddress",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "fullAddress",
          hasValue(search["fullAddress"]),
          searchText,
          text || "-",
          true,
          "input",
          search
        ),
    },
    {
      key: "nikPasport",
      title: "NIK/PASSPORT",
      dataIndex: "nikPasport",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.nikPasport] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "nikPasport",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "nikPasport",
          hasValue(search["nikPasport"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "tkuCode",
      title: "TKU CODE",
      dataIndex: "tkuCode",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.tkuCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "tkuCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "tkuCode",
          hasValue(search["tkuCode"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "billPeriode",
      title: "BILLING PERIOD",
      dataIndex: "billPeriode",
      width: 120,
      align: "center",
      sorter: true,
      filteredValue: [search?.billPeriode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billPeriode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datePeriod"
      ),
      render: (text) =>
        renderDateColumn(
          "billPeriode",
          hasValue(search["billPeriode"]),
          searchText,
          text,
          "datePeriod",
          search
        ),
    },
    {
      key: "invoiceDate",
      title: "INVOICE DATE",
      dataIndex: "invoiceDate",
      width: 120,
      align: "center",
      sorter: true,
      filteredValue: [search?.invoiceDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) => {
        const formattedDate = text ? moment(text).format("DD-MM-YYYY") : "-";
        return renderDateColumn(
          "invoiceDate",
          hasValue(search["invoiceDate"]),
          searchText,
          formattedDate,
          "date",
          search
        );
      },
    },
    {
      key: "totalAmount",
      title: "TOTAL AMOUNT (IDR)",
      dataIndex: "totalAmount",
      width: 180,
      align: "right",
      sorter: true,
      filteredValue: [search?.totalAmount] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (value) => {
        const formattedValue = (
          <span>Rp {currencyFormatting(value, "idr")}</span>
        );

        return renderColumn(
          "totalAmount",
          hasValue(search["totalAmount"]),
          searchText,
          formattedValue,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "status",
      title: "STATUS E-FAKTUR",
      dataIndex: "status",
      width: 180,
      align: "center",
      sorter: true,
      filteredValue: [search?.status] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (status) => {
        const displayStatus = status || "DRAFT";
        const statusLabel = displayStatus.replace(/_/g, " ");

        return (
          <div className="flex justify-center">
            <StatusComponent colour={displayStatus.toLowerCase()}>
              {statusLabel}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "statusApproval",
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 220,
      align: "center",
      sorter: true,
      filteredValue: [search?.statusApproval] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (status) => {
        const displayStatus = status || "DRAFT";
        const statusLabel = displayStatus.replace(/_/g, " ");

        return (
          <div className="flex justify-center">
            <StatusComponent colour={displayStatus.toLowerCase()}>
              {statusLabel}
            </StatusComponent>
          </div>
        );
      },
    },
  ];
};

// Action Column untuk Approval History
export const getActionColumn = ({
  navigate,
  handleApprovalHistory,
  handleGenerateEFaktur,
  handleLogAktivitas,
}) => {
  return [
    // Approval History
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Approval History">
            <div
              className="pt-1 cursor-pointer"
              onClick={() => handleApprovalHistory(record)}
            >
              <SVGIcon name="IconLogHistory" color="#0075bf" width={20} />
            </div>
          </Tooltip>
        );
      },
    },

    // More Actions
    {
      action: "Update",
      type: "table",
      render: (record) => {
        const menuItems = [
          {
            key: "detail",
            label: (
              <Link
                to={INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL}
                state={{ id: record.efakturId }}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Detail
              </Link>
            ),
            icon: <SVGIcon name="IconDetail" width={16} />,
          },
          {
            key: "log",
            label: "Log Aktivitas",
            icon: (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12H15M9 8H15M9 16H12M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                  stroke="#52c41a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            onClick: () => handleLogAktivitas(record),
          },
        ];
        return (
          <Tooltip title="Aksi Lainnya">
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="pt-1 cursor-pointer">
                <MoreOutlined style={{ fontSize: 20, color: "#595959" }} />
              </div>
            </Dropdown>
          </Tooltip>
        );
      },
    },
  ];
};
