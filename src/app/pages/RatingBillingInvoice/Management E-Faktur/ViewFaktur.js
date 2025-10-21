import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Spin,
  Radio,
  Tooltip,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Popconfirm,
  Dropdown,
  Menu
} from "antd";
import { SearchOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalCreateEFaktur from "./ModalCreateEFaktur";
import ModalApprovalEFaktur from "./ModalApprovalEFaktur";
import LogAktivitasEFaktur from "./LogAktivitasEFaktur";
import ModalBuatFakturPengganti from "./ModalBuatFakturPengganti";
import ModalPreviewEFaktur from "./ModalPreviewEFaktur";
import ModalGenerateXML from "./ModalGenerateXML";
import ModalUploadEFaktur from "./ModalUploadEFaktur";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { Link } from "react-router-dom";
import {
  getListEFaktur,
  deleteEFaktur,
  updateEFakturStatus,
} from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ViewFaktur = () => {
  const dispatch = useDispatch();
  const { 
    list_efaktur, 
    loading, 
    pagination 
  } = useSelector((state) => state.efaktur);

  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");

  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateRange, setFilterDateRange] = useState(null);

  const [valueTab, setValueTab] = useState("Billing Gas");
  const [pageDetail, setPageDetail] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [logAktivitasOpen, setLogAktivitasOpen] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [selectedNoFaktur, setSelectedNoFaktur] = useState("");
  const [modalFakturPengganti, setModalFakturPengganti] = useState(false);
  const [noFakturForPengganti, setNoFakturForPengganti] = useState("");

  const [modalPreview, setModalPreview] = useState(false);
  const [noFakturForPreview, setNoFakturForPreview] = useState("");
  const [modalGenerateXML, setModalGenerateXML] = useState(false);
  const [modalUploadEFaktur, setModalUploadEFaktur] = useState(false);
  const [noFakturForGenerate, setNoFakturForGenerate] = useState("");

  const dataSource = list_efaktur;

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
  }, []);

  const fetchData = () => {
    const filters = {
      search: filterSearch,
      status: filterStatus,
      dateRange: filterDateRange,
    };

    dispatch(
      getListEFaktur({
        search: filterSearch,
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
      getListEFaktur({
        search: "",
        page: 1,
        pageSize: pageSize,
        sort: "",
        filters: {},
      })
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    const newPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(newPage);
    setPageSize(pageSizeChange);
    
    const filters = {
      search: filterSearch,
      status: filterStatus,
      dateRange: filterDateRange,
    };

    dispatch(
      getListEFaktur({
        search: filterSearch,
        page: newPage,
        pageSize: pageSizeChange,
        sort: sort,
        filters: filters,
      })
    );
  };

  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
    
    const filters = {
      search: filterSearch,
      status: filterStatus,
      dateRange: filterDateRange,
    };

    dispatch(
      getListEFaktur({
        search: filterSearch,
        page: page,
        pageSize: pageSize,
        sort: dataSort,
        filters: filters,
      })
    );
  };

  const handleDownload = () => {
    console.log("Download list");
  };

  const handleApprovalHistory = (record) => {
    setModalApprovalHistory(true);
  };

  const handleLogAktivitas = (record) => {
    setSelectedNoFaktur(record.noFaktur);
    setLogAktivitasOpen(true);
  };

  const handlePreview = (record) => {
    setNoFakturForPreview(record.noFaktur);
    setModalPreview(true);
  };

  const handleGenerateXML = (record) => {
    setNoFakturForGenerate(record.noFaktur);
    setModalGenerateXML(true);
  };

  const handleUploadEFaktur = (record) => {
    setNoFakturForGenerate(record.noFaktur);
    setModalUploadEFaktur(true);
  };

  const handleRequestApproval = (record) => {
    console.log("Request Approval untuk E-Faktur:", record.noFaktur);
    
    if (window.confirm(`Kirim E-Faktur ${record.noFaktur} untuk approval?`)) {
      dispatch(
        updateEFakturStatus({
          noFaktur: record.noFaktur,
          status: "AWAITING APPROVAL",
        })
      )
        .unwrap()
        .then(() => {
          handleRefresh();
        })
        .catch((error) => {
          console.error("Error requesting approval:", error);
        });
    }
  };

  const handleDelete = (record) => {
    dispatch(deleteEFaktur(record.noFaktur))
      .unwrap()
      .then(() => {
        handleRefresh();
      })
      .catch((error) => {
        console.error("Error deleting e-faktur:", error);
      });
  };

  const onChangeTab = ({ target: { value } }) => {
    setValueTab(value);
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
      title: "NO. FAKTUR",
      dataIndex: "noFaktur",
      key: "noFaktur",
      width: 200,
    },
    {
      title: "NAMA PELANGGAN",
      dataIndex: "namaPelanggan",
      key: "namaPelanggan",
      width: 250,
    },
    {
      title: "TANGGAL FAKTUR",
      dataIndex: "tanggalFaktur",
      key: "tanggalFaktur",
      width: 150,
    },
    {
      title: "TOTAL TAGIHAN",
      dataIndex: "totalTagihan",
      key: "totalTagihan",
      width: 150,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 180,
      align: "center",
      render: (status) => {
        const statusColors = {
          SUCCESS: "bg-green-100 text-green-800 border-green-300",
          "AWAITING APPROVAL":
            "bg-yellow-100 text-yellow-800 border-yellow-300",
          DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
          FAILED: "bg-red-100 text-red-800 border-red-300",
          PENGGANTI: "bg-purple-100 text-purple-800 border-purple-300",
        };
        return (
          <div className="flex justify-center">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                statusColors[status] ||
                "bg-gray-100 text-gray-800 border-gray-300"
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      title: "AKSI",
      key: "action",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const menuItems = [
          {
            key: "preview",
            label: "Preview",
            icon: <EyeOutlined style={{ color: "#1890ff" }} />,
            onClick: () => handlePreview(record),
          },
          {
            key: "detail",
            label: "Detail",
            icon: <SVGIcon name="IconDetail" width={16} />,
            onClick: () => {
              window.location.href = `${INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL}?noFaktur=${record.noFaktur}`;
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
          {
            key: "approval-history",
            label: "Approval History",
            icon: <SVGIcon name="IconLogHistory" color="#0075bf" width={16} />,
            onClick: () => handleApprovalHistory(record),
          },
        ];

        if (record.status === "FAILED") {
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

        if (record.status === "DRAFT") {
          menuItems.push(
            { type: "divider" },
            {
              key: "request-approval",
              label: "Request Approval",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="#52c41a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleRequestApproval(record),
            }
          );
        }

        if (record.status === "DRAFT" || record.status === "REJECTED") {
          menuItems.push(
            { type: "divider" },
            {
              key: "delete",
              label: "Hapus",
              icon: <DeleteOutlined style={{ color: "#ff4d4f" }} />,
              danger: true,
              onClick: () => {
              },
            }
          );
        }

        return (
          <div className="flex gap-2 justify-center items-center">
            <Tooltip title="Preview">
              <div
                className="cursor-pointer hover:opacity-70 transition-opacity p-1.5 rounded hover:bg-blue-50 inline-flex items-center justify-center"
                onClick={() => handlePreview(record)}
              >
                <EyeOutlined style={{ fontSize: 18, color: "#1890ff" }} />
              </div>
            </Tooltip>

            <Tooltip title="Detail">
              <Link
                to={INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL}
                state={{
                  noFaktur: record.noFaktur,
                  billingCode: record.billingCode,
                  ratingCode: record.ratingCode,
                  calculationCode: record.calculationCode,
                  saNumber: record.saNumber,
                  accountNumber: record.accountNumber,
                }}
              >
                <div className="cursor-pointer hover:opacity-70 transition-opacity p-1.5 rounded hover:bg-gray-50 inline-flex items-center justify-center">
                  <SVGIcon name="IconDetail" width={18} />
                </div>
              </Link>
            </Tooltip>

            <Dropdown
              menu={{
                items: menuItems.map((item) => {
                  if (item.type === "divider") {
                    return item;
                  }
                  
                  if (item.key === "delete") {
                    return {
                      ...item,
                      label: (
                        <Popconfirm
                          title="Hapus E-Faktur"
                          description={`Apakah Anda yakin ingin menghapus E-Faktur ${record.noFaktur}?`}
                          onConfirm={() => handleDelete(record)}
                          okText="Ya, Hapus"
                          cancelText="Batal"
                          okButtonProps={{ danger: true }}
                        >
                          <span className="text-red-500">Hapus</span>
                        </Popconfirm>
                      ),
                    };
                  }
                  
                  return item;
                }),
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
    {
      action: "Approval",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
          type="submit"
          onClick={() => setModalApproval(true)}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={20} />}
          type="submit"
          onClick={() => setModalRequest(true)}
        >
          Buat E-Faktur
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
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={7} lg={7}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Cari:
                </label>
                <Input
                  placeholder="No. faktur atau nama pelanggan"
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
                  Status:
                </label>
                <Select
                  placeholder="Pilih Status"
                  value={filterStatus || undefined}
                  onChange={(value) => setFilterStatus(value)}
                  allowClear
                  style={{ width: "100%" }}
                  size="middle"
                >
                  <Option value="SUCCESS">SUCCESS</Option>
                  <Option value="AWAITING APPROVAL">AWAITING APPROVAL</Option>
                  <Option value="DRAFT">DRAFT</Option>
                  <Option value="FAILED">FAILED</Option>
                  <Option value="PENGGANTI">PENGGANTI</Option>
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

          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={pagination?.totalElements || 0}
              onSort={onSortApi}
              tableScrolled={{ y: 525, x: 1500 }}
            />
          </div>
        </BaseContainer>

        <ModalPreviewEFaktur
          isOpen={modalPreview}
          handleClose={() => setModalPreview(false)}
          noFaktur={noFakturForPreview}
        />

        <ModalGenerateXML
          isOpen={modalGenerateXML}
          handleClose={() => setModalGenerateXML(false)}
          noFaktur={noFakturForGenerate}
          onSuccess={() => {
            console.log("XML berhasil di-generate");
            handleRefresh();
          }}
        />

        <ModalUploadEFaktur
          isOpen={modalUploadEFaktur}
          handleClose={() => setModalUploadEFaktur(false)}
          noFaktur={noFakturForGenerate}
          onSuccess={() => {
            console.log("E-Faktur berhasil diupload");
            handleRefresh();
          }}
        />

        <ModalBuatFakturPengganti
          isOpen={modalFakturPengganti}
          handleClose={() => setModalFakturPengganti(false)}
          noFakturAsli={noFakturForPengganti}
          onSuccess={() => {
            handleRefresh();
            console.log("Faktur pengganti berhasil dibuat");
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

        <ModalCreateEFaktur
          isOpen={modalRequest}
          handleCancel={() => setModalRequest(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalRequest(true)}
        />

        <ModalApprovalEFaktur
          isOpen={modalApproval}
          handleCancel={() => setModalApproval(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalApproval(true)}
        />

        <LogAktivitasEFaktur
          isOpen={logAktivitasOpen}
          handleClose={() => setLogAktivitasOpen(false)}
          noFaktur={selectedNoFaktur}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default ViewFaktur;