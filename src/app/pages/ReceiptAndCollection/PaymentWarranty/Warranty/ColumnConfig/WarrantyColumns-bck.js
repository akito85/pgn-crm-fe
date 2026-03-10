import React from "react";
import { Tooltip, Dropdown } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import SVGIcon from "../../../../../../assets/Icon/index";
import StatusComponent from "../../../../../../components/StatusComponent";
import { INVOICE_ROUTES } from "../../../../../../routes/invoice/invoice_routes";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { currencyFormatting } from "../../../../../../utils/formatCurrency";
import { Link } from "react-router-dom";

export const columnWarranty = ({
  page,
  pageSize,
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
}) => {
  return [
    {
      key: "no",
      title: "NO",
      width: 60,
      isClassification: true,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "document",
      title: "Document",
      dataIndex: "document",
      width: 180,
      sorter: true,
      filteredValue: [search?.document] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "document",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "document",
          hasValue(search["document"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "mutationDate",
      title: "MUTATION DATE",
      dataIndex: "mutationDate",
      width: 120,
      isClassification: true,
      sorter: true,
      filteredValue: [search?.mutationDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "mutationDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "mutationDate",
          hasValue(search["mutationDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "effectiveDate",
      title: "EFFECTIVE DATE",
      dataIndex: "effectiveDate",
      width: 120,
      isClassification: true,
      sorter: true,
      filteredValue: [search?.effectiveDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "effectiveDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "effectiveDate",
          hasValue(search["effectiveDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "expiringDate",
      title: "EXPIRING DATE",
      dataIndex: "expiringDate",
      width: 120,
      isClassification: true,
      sorter: true,
      filteredValue: [search?.expiringDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "expiringDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "expiringDate",
          hasValue(search["expiringDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "endDateClaim",
      title: "END DATE CLAIM",
      dataIndex: "endDateClaim",
      width: 120,
      isClassification: true,
      sorter: true,
      filteredValue: [search?.endDateClaim] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDateClaim",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "endDateClaim",
          hasValue(search["endDateClaim"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "cabangPenerbit",
      title: "CABANG PENERBIT",
      dataIndex: "cabangPenerbit",
      width: 180,
      sorter: true,
      filteredValue: [search?.cabangPenerbit] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "cabangPenerbit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "cabangPenerbit",
          hasValue(search["cabangPenerbit"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "currency",
      title: "CURRENCY",
      dataIndex: "currency",
      width: 180,
      sorter: true,
      filteredValue: [search?.currency] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "currency",
          hasValue(search["currency"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "currentBalance",
      title: "CURRENT BALANCE",
      dataIndex: "currentBalance",
      width: 180,
      isNumber: true,
      sorter: true,
      filteredValue: [search?.currentBalance] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currentBalance",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (value) => {
        const formattedValue = (
          <span>{currencyFormatting(value, "idr")}</span>
        );

        return renderColumn(
          "currentBalance",
          hasValue(search["currentBalance"]),
          searchText,
          formattedValue,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "rate",
      title: "RATE",
      dataIndex: "rate",
      width: 180,
      isNumber: true,
      sorter: true,
      filteredValue: [search?.rate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "rate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (value) => {
        const formattedValue = (
          <span>{currencyFormatting(value, "idr")}</span>
        );

        return renderColumn(
          "rate",
          hasValue(search["rate"]),
          searchText,
          formattedValue,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "rateDate",
      title: "RATE DATE",
      dataIndex: "rateDate",
      width: 120,
      isClassification: true,
      sorter: true,
      filteredValue: [search?.rateDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "rateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "rateDate",
          hasValue(search["rateDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "equivalent",
      title: "EQUIVALENT",
      dataIndex: "equivalent",
      width: 180,
      isNumber: true,
      sorter: true,
      filteredValue: [search?.equivalent] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "equivalent",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (value) => {
        const formattedValue = (
          <span>{currencyFormatting(value, "idr")}</span>
        );

        return renderColumn(
          "equivalent",
          hasValue(search["equivalent"]),
          searchText,
          formattedValue,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "customerName",
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 150,
      sorter: true,
      filteredValue: [search?.customerName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerName",
          hasValue(search["customerName"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "customerSegment",
      title: "CUSTOMER SEGMENT",
      dataIndex: "customerSegment",
      width: 150,
      sorter: true,
      filteredValue: [search?.customerSegment] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerSegment",
          hasValue(search["customerSegment"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "customerGroup",
      title: "CUSTOMER GROUP",
      dataIndex: "customerGroup",
      width: 150,
      sorter: true,
      filteredValue: [search?.customerGroup] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerGroup",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerGroup",
          hasValue(search["customerGroup"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "type",
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: true,
      filteredValue: [search?.type] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "type",
          hasValue(search["type"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "penerbit",
      title: "PENERBIT",
      dataIndex: "penerbit",
      width: 150,
      sorter: true,
      filteredValue: [search?.penerbit] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "penerbit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "penerbit",
          hasValue(search["penerbit"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "paymentWarrantyCode",
      title: "PAYMENT GUARANTEE CODE",
      dataIndex: "paymentWarrantyCode",
      width: 150,
      sorter: true,
      filteredValue: [search?.paymentWarrantyCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "paymentWarrantyCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "paymentWarrantyCode",
          hasValue(search["paymentWarrantyCode"]),
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
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 150,
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
      width: 150,
      sorter: true,
      filteredValue: [search?.accountName] || null,
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
          false,
          "input",
          search
        ),
    },
    {
      key: "customerNumber",
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 150,
      sorter: true,
      filteredValue: [search?.customerNumber] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerNumber",
          hasValue(search["customerNumber"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "approvalStatus",
      title: "APPROVAL STATUS",
      dataIndex: "approvalStatus",
      width: 300,
      isClassification: true,
      sorter: true,
      filteredValue: [search?.approvalStatus] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "approvalStatus",
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
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      width: 180,
      isClassification: true,
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
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 150,
      sorter: true,
      filteredValue: [search?.description] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    }
  ];
};

// Action Column untuk Approval History
export const columnWarrantyAction = ({

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
              className="cursor-pointer"
              onClick={() => null}
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
            onClick: () => null,
          },
        ];
        return (
          <Tooltip title="Aksi Lainnya">
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="cursor-pointer">
                <MoreOutlined style={{ fontSize: 20, color: "#595959" }} />
              </div>
            </Dropdown>
          </Tooltip>
        );
      },
    },
  ];
};
