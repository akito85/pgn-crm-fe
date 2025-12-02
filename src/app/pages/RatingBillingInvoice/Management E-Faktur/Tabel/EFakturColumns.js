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
      key: "meterReading",
      title: "METER READING",
      dataIndex: "meterReading",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.meterReading] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "meterReading",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "meterReading",
          hasValue(search["meterReading"]),
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
      key: "customerName",
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 250,
      align: "left",
      sorter: true,
      filteredValue: [search?.customerName] || null,
      ellipsis: { showTitle: false },
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
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "segment",
      title: "SEGMENT",
      dataIndex: "segment",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.segment] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "segment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "segment",
          hasValue(search["segment"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "accountGroupType",
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.accountGroupType] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountGroupType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountGroupType",
          hasValue(search["accountGroupType"]),
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
      key: "customerIdentificationNumber",
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      width: 220,
      align: "left",
      sorter: true,
      filteredValue: [search?.customerIdentificationNumber] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerIdentificationNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerIdentificationNumber",
          hasValue(search["customerIdentificationNumber"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "taxAddress",
      title: "TAX ADDRESS",
      dataIndex: "taxAddress",
      width: 300,
      align: "left",
      sorter: true,
      filteredValue: [search?.taxAddress] || null,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxAddress",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "taxAddress",
          hasValue(search["taxAddress"]),
          searchText,
          text || "-",
          true,
          "input",
          search
        ),
    },
    {
      key: "jenisIdentitas",
      title: "JENIS IDENTITAS",
      dataIndex: "jenisIdentitas",
      width: 150,
      align: "left",
      sorter: true,
      filteredValue: [search?.jenisIdentitas] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "jenisIdentitas",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "jenisIdentitas",
          hasValue(search["jenisIdentitas"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "nomorIdentitas",
      title: "NOMOR IDENTITAS",
      dataIndex: "nomorIdentitas",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.nomorIdentitas] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "nomorIdentitas",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "nomorIdentitas",
          hasValue(search["nomorIdentitas"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "jenisWajibPajak",
      title: "JENIS WAJIB PAJAK",
      dataIndex: "jenisWajibPajak",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.jenisWajibPajak] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "jenisWajibPajak",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "jenisWajibPajak",
          hasValue(search["jenisWajibPajak"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "nitku",
      title: "NITKU",
      dataIndex: "nitku",
      width: 180,
      align: "left",
      sorter: true,
      filteredValue: [search?.nitku] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "nitku",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "nitku",
          hasValue(search["nitku"]),
          searchText,
          text || "-",
          false,
          "input",
          search
        ),
    },
    {
      key: "billingPeriod",
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      width: 120,
      align: "center",
      sorter: true,
      filteredValue: [search?.billingPeriod] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datePeriod"
      ),
      render: (text) =>
        renderDateColumn(
          "billingPeriod",
          hasValue(search["billingPeriod"]),
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
      key: "totalAmountEqvIdr",
      title: "TOTAL AMOUNT (IDR)",
      dataIndex: "totalAmountEqvIdr",
      width: 180,
      align: "right",
      sorter: true,
      filteredValue: [search?.totalAmountEqvIdr] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalAmountEqvIdr",
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
          "totalAmountEqvIdr",
          hasValue(search["totalAmountEqvIdr"]),
          searchText,
          formattedValue,
          false,
          "input",
          search
        );
      },
    },
    {
      key: "efakturStatus",
      title: "STATUS E-FAKTUR",
      dataIndex: "efakturStatus",
      width: 180,
      align: "center",
      sorter: true,
      filteredValue: [search?.efakturStatus] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "efakturStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (status) => {
        const displayStatus = status || "NOT_GENERATED";
        const statusLabel = displayStatus.replace(/_/g, " ");

        return (
          <div className="flex justify-center">
            <StatusComponent colour={displayStatus.toLowerCase()}>
              {renderColumn(
                "efakturStatus",
                hasValue(search["efakturStatus"]),
                searchText,
                statusLabel,
                false,
                "status",
                search
              )}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "replacement",
      title: "REPLACEMENT",
      dataIndex: "replacement",
      width: 120,
      align: "center",
      sorter: true,
      filteredValue: [search?.replacement] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "replacement",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (replacement) => {
        if (!replacement) {
          return <span className="text-gray-400">-</span>;
        }

        if (replacement === "Y") {
          return (
            <Tooltip title="Faktur ini sudah diganti dengan faktur baru">
              <div className="flex justify-center">
                <StatusComponent colour="replaced">
                  {renderColumn(
                    "replacement",
                    hasValue(search["replacement"]),
                    searchText,
                    "REPLACED",
                    false,
                    "input",
                    search
                  )}
                </StatusComponent>
              </div>
            </Tooltip>
          );
        }

        if (replacement === "N") {
          return (
            <Tooltip title="Faktur pengganti terbaru">
              <div className="flex justify-center">
                <StatusComponent colour="latest">
                  {renderColumn(
                    "replacement",
                    hasValue(search["replacement"]),
                    searchText,
                    "LATEST",
                    false,
                    "input",
                    search
                  )}
                </StatusComponent>
              </div>
            </Tooltip>
          );
        }

        return <span className="text-gray-400">-</span>;
      },
    },
  ];
};

// Action Column untuk Approval History
export const getActionColumn = ({
  handleApprovalHistory,
  handleGenerateEFaktur,
  handleReplaceFaktur,
  handleCancelFaktur,
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
            label: "Detail",
            icon: <SVGIcon name="IconDetail" width={16} />,
            onClick: () => {
              window.location.href = `${INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL}?efakturId=${record.efakturId}`;
            },
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

        if (record.replacement === "Y") {
          return (
            <Tooltip title="Faktur ini sudah diganti, tidak dapat dimodifikasi">
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
                disabled
              >
                <div className="pt-1 cursor-not-allowed opacity-50">
                  <MoreOutlined style={{ fontSize: 20, color: "#595959" }} />
                </div>
              </Dropdown>
            </Tooltip>
          );
        }

        // Generate E-Faktur - hanya untuk NOT_GENERATED
        if (!record.efakturStatus || record.efakturStatus === "NOT_GENERATED") {
          menuItems.push(
            { type: "divider" },
            {
              key: "generate",
              label: "Generate E-Faktur",
              icon: <PlusOutlined style={{ color: "#52c41a" }} />,
              onClick: () => handleGenerateEFaktur(record),
            }
          );
        }

        // REMOVED: Upload & Generate XML dari FAILED status
        // Sekarang hanya ada di dropdown "Approval Action"

        // Replace & Cancel Faktur - untuk status SUCCESS/APPROVED
        if (
          record.efakturStatus === "SUCCESS" ||
          record.efakturStatus === "SUCCESS_UPLOAD" ||
          record.efakturStatus === "APPROVED"
        ) {
          if (record.replacement !== "Y") {
            menuItems.push(
              { type: "divider" },
              {
                key: "replace-faktur",
                label: "Buat Faktur Pengganti",
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      stroke="#1890ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                onClick: () => handleReplaceFaktur(record),
              }
            );
          }

          if (
            record.efakturStatus !== "CANCELLED" &&
            record.replacement !== "Y"
          ) {
            menuItems.push({
              key: "cancel-faktur",
              label: "Batalkan E-Faktur",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="#ff4d4f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleCancelFaktur(record),
              danger: true,
            });
          }
        }

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