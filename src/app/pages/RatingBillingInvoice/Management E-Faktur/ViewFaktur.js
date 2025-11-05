import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Spin,
  Tooltip,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalGenerateEFaktur from "./ModalEfaktur/ModalGenerateEFaktur";
import ModalGenerateXML from "./ModalEfaktur/ModalGenerateXML";
import ModalUploadEFaktur from "./ModalEfaktur/ModalUploadEFaktur";
import ModalApprovalEFaktur from "./ModalEfaktur/ModalApprovalEFaktur ";
import LogAktivitasEFaktur from "./LogAktivitasEFaktur";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import {
  getListApprovedBilling,
  downloadEFakturList,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ViewFaktur = () => {
  const dispatch = useDispatch();
  const { list_approved_billing, loading, pagination, data_approval_history } =
    useSelector((state) => state.efaktur);

  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("invoiceDate~desc");

  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateRange, setFilterDateRange] = useState(null);

  const [modalGenerateEFaktur, setModalGenerateEFaktur] = useState(false);
  const [modalGenerateXML, setModalGenerateXML] = useState(false);
  const [modalUploadEFaktur, setModalUploadEFaktur] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [logAktivitasOpen, setLogAktivitasOpen] = useState(false);

  const [selectedBilling, setSelectedBilling] = useState(null);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  const dataSource = list_approved_billing || [];

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.EFAKTUR_VIEW,
      breadcrumbName: "Manajemen E-Faktur",
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sort]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: data_approval_history?.dataApprover?.EFAKTUR || [],
        dataHistory: data_approval_history?.dataHistory?.EFAKTUR || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  const fetchData = () => {
    const filters = {
      ...(filterSearch && { search: filterSearch }),
      ...(filterStatus && { eFakturStatus: filterStatus }),
      ...(filterDateRange &&
        filterDateRange[0] &&
        filterDateRange[1] && {
          startDate: moment(filterDateRange[0]).format("YYYY-MM-DD"),
          endDate: moment(filterDateRange[1]).format("YYYY-MM-DD"),
        }),
    };

    dispatch(
      getListApprovedBilling({
        page: page,
        pageSize: pageSize,
        sort: sort,
        filters: filters,
      })
    );
  };

  const handleFilter = () => {
    setPage(1);
    fetchData();
  };

  const handleResetFilter = () => {
    setFilterSearch("");
    setFilterStatus("");
    setFilterDateRange(null);
    setPage(1);

    dispatch(
      getListApprovedBilling({
        page: 1,
        pageSize: pageSize,
        sort: sort,
        filters: {},
      })
    );
  };

  const handleChange = (pageChange, pageSizeChange) => {
    const newPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(newPage);
    setPageSize(pageSizeChange);
  };

  const onSortApi = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    const filters = {
      ...(filterSearch && { search: filterSearch }),
      ...(filterStatus && { eFakturStatus: filterStatus }),
      ...(filterDateRange &&
        filterDateRange[0] &&
        filterDateRange[1] && {
          startDate: moment(filterDateRange[0]).format("YYYY-MM-DD"),
          endDate: moment(filterDateRange[1]).format("YYYY-MM-DD"),
        }),
    };

    dispatch(downloadEFakturList({ filters, page, pageSize, sort }));
  };

  const handleGenerateEFaktur = (record) => {
    setSelectedBilling(record.billingCode);
    setModalGenerateEFaktur(true);
  };

  const handleApprovalHistory = (record) => {
    dispatch(getApprovalHistory(record.billingCode));
    setModalApprovalHistory(true);
  };

  const handleGenerateXML = (record) => {
    setSelectedBilling(record);
    setModalGenerateXML(true);
  };

  const handleUploadEFaktur = (record) => {
    setSelectedBilling(record);
    setModalUploadEFaktur(true);
  };

  const handleApproval = (record) => {
    setSelectedBilling(record);
    setModalApproval(true);
  };

  const handleLogAktivitas = (record) => {
    setSelectedBilling(record);
    setLogAktivitasOpen(true);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const columns = [
    {
      title: "NO",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NO. E-FAKTUR",
      dataIndex: "efakturNo", // ⚠️ UBAH dari "eFakturNo" ke "efakturNo" (huruf kecil)
      key: "efakturNo",
      width: 180,
      render: (text) => text || "-",
    },
    {
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 180,
      render: (text) => text || "-",
    },
    {
      title: "BILLING CODE",
      dataIndex: "billingCode",
      key: "billingCode",
      width: 180,
    },
    {
      title: "CUSTOMER",
      dataIndex: "customerName",
      key: "customerName",
      width: 250,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 120,
    },
    {
      title: "INVOICE DATE",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      width: 120,
      render: (text) => {
        // Format date dari "2024-02-07 00:00:00" ke "07-02-2024"
        if (!text) return "-";
        return moment(text).format("DD-MM-YYYY");
      },
    },
    {
      title: "TOTAL AMOUNT (IDR)",
      dataIndex: "totalAmountEqvIdr", // ⚠️ UBAH dari "totalAmountEqvIdrReal" ke "totalAmountEqvIdr"
      key: "totalAmountEqvIdr",
      width: 180,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
    },
    {
      title: "STATUS E-FAKTUR",
      dataIndex: "efakturStatus", // ⚠️ UBAH dari "eFakturStatus" ke "efakturStatus" (huruf kecil)
      key: "efakturStatus",
      width: 180,
      align: "center",
      render: (status) => {
        const statusColors = {
          APPROVED: "bg-green-100 text-green-800 border-green-300", // ⚠️ TAMBAH status APPROVED
          PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
          AWAITING_APPROVAL: "bg-orange-100 text-orange-800 border-orange-300",
          FAILED: "bg-red-100 text-red-800 border-red-300",
          REJECTED: "bg-red-100 text-red-800 border-red-300",
          NOT_GENERATED: "bg-gray-100 text-gray-800 border-gray-300",
        };
        // ⚠️ Handle null status sebagai NOT_GENERATED
        const displayStatus = status || "NOT_GENERATED";
        return (
          <div className="flex justify-center">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                statusColors[displayStatus] ||
                "bg-gray-100 text-gray-800 border-gray-300"
              }`}
            >
              {displayStatus.replace(/_/g, " ")}
            </span>
          </div>
        );
      },
    },
    {
      title: "AKSI",
      key: "action",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const menuItems = [
          {
            key: "detail",
            label: "Detail",
            icon: <SVGIcon name="IconDetail" width={16} />,
            onClick: () => {
              window.location.href = `${INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL}?billingCode=${record.billingCode}`;
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

        // ⚠️ UBAH kondisi ke huruf kecil "efakturStatus"
        if (record.efakturStatus === "AWAITING_APPROVAL") {
          menuItems.push(
            { type: "divider" },
            {
              key: "approval",
              label: "Approve/Reject",
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
              onClick: () => handleApproval(record),
            }
          );
        }

        // ⚠️ UBAH kondisi untuk handle null status
        if (!record.efakturStatus) {
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

        // ⚠️ UBAH kondisi ke huruf kecil "efakturStatus"
        if (record.efakturStatus === "FAILED") {
          menuItems.push(
            { type: "divider" },
            {
              key: "generate-xml",
              label: "Generate XML (Manual)",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="#fa8c16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleGenerateXML(record),
            },
            {
              key: "upload-efaktur",
              label: "Upload E-Faktur dari DJP",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    stroke="#722ed1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleUploadEFaktur(record),
            }
          );
        }

        return (
          <div className="flex gap-2 justify-center items-center">
            <Tooltip title="Approval History">
              <div
                className="cursor-pointer hover:opacity-70 transition-opacity p-1.5 rounded hover:bg-blue-50 inline-flex items-center justify-center"
                onClick={() => handleApprovalHistory(record)}
              >
                <SVGIcon name="IconLogHistory" color="#0075bf" width={18} />
              </div>
            </Tooltip>

            <Dropdown
              menu={{
                items: menuItems,
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Tooltip title="Aksi Lainnya">
                <div className="cursor-pointer hover:opacity-70 transition-opacity p-1.5 rounded hover:bg-gray-50 inline-flex items-center justify-center">
                  <MoreOutlined style={{ fontSize: 18, color: "#595959" }} />
                </div>
              </Tooltip>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="w-full flex justify-end gap-3 mb-4">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"Manajemen E-Faktur"}>
          <Row gutter={[16, 26]} align="bottom">
            <Col xs={24} sm={12} md={7} lg={7}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Cari:
                </label>
                <Input
                  placeholder="Billing code atau customer"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  allowClear
                  onPressEnter={handleFilter}
                  size="middle"
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Status E-Faktur:
                </label>
                <Select
                  placeholder="Pilih Status"
                  value={filterStatus || undefined}
                  onChange={(value) => setFilterStatus(value)}
                  allowClear
                  style={{ width: "100%" }}
                  size="middle"
                >
                  <Option value="">Semua Status</Option>{" "}
                  {/* Tambahkan opsi Semua */}
                  <Option value="AWAITING_APPROVAL">AWAITING APPROVAL</Option>
                  <Option value="APPROVED">APPROVED</Option> {/* ⚠️ TAMBAH */}
                  <Option value="PROCESSING">PROCESSING</Option>
                  <Option value="FAILED">FAILED</Option>
                  <Option value="REJECTED">REJECTED</Option>
                </Select>
              </div>
            </Col>

            <Col xs={24} sm={12} md={7} lg={7}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Dari Tgl - Sampai Tgl:
                </label>
                <RangePicker
                  value={filterDateRange}
                  onChange={(dates) => setFilterDateRange(dates)}
                  format="DD-MM-YYYY"
                  placeholder={["Dari Tanggal", "Sampai Tanggal"]}
                  style={{ width: "100%" }}
                  separator={<span style={{ color: "#bfbfbf" }}>s/d</span>}
                  size="middle"
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={4} lg={4}>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  onClick={handleFilter}
                  style={{ flex: 1, height: "32px" }}
                  size="middle"
                >
                  Cari
                </Button>
                <Button
                  onClick={handleResetFilter}
                  style={{ flex: 1, height: "32px" }}
                  size="middle"
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>

          <div className="w-full mt-6">
            <TablePaginationNew
              dataSource={dataSource}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={pagination?.totalElements || 0}
              onSort={onSortApi}
              tableScrolled={{ y: 525, x: 1600 }}
              useFixColumn={true}
              defaultFixedColumns={{
                key: "left",
                eFakturStatus: "right",
                action: "right",
              }}
            />
          </div>
        </BaseContainer>

        <ModalGenerateEFaktur
          isOpen={modalGenerateEFaktur}
          handleClose={() => setModalGenerateEFaktur(false)}
          billingData={selectedBilling}
          onSuccess={() => {
            console.log("E-Faktur generated successfully");
            handleRefresh();
          }}
        />

        <ModalGenerateXML
          isOpen={modalGenerateXML}
          handleClose={() => setModalGenerateXML(false)}
          billingData={selectedBilling}
          onSuccess={() => {
            console.log("XML generated successfully");
            handleRefresh();
          }}
        />

        <ModalUploadEFaktur
          isOpen={modalUploadEFaktur}
          handleClose={() => setModalUploadEFaktur(false)}
          billingData={selectedBilling}
          onSuccess={() => {
            console.log("E-Faktur uploaded successfully");
            handleRefresh();
          }}
        />

        <ModalApprovalEFaktur
          isOpen={modalApproval}
          handleClose={() => setModalApproval(false)}
          billingData={selectedBilling}
          onSuccess={() => {
            console.log("E-Faktur approved/rejected successfully");
            handleRefresh();
          }}
        />

        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        <LogAktivitasEFaktur
          isOpen={logAktivitasOpen}
          handleClose={() => setLogAktivitasOpen(false)}
          billingCode={selectedBilling?.billingCode}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default ViewFaktur;
