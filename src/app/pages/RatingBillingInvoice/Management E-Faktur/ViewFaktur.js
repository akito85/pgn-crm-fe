import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Dropdown, message, Menu } from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  DownOutlined,
  CheckOutlined,
  UploadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalGenerateEFaktur from "./ModalEfaktur/ModalGenerateEFaktur";
import ModalGenerateXML from "./ModalEfaktur/ModalGenerateXML";
import ModalUploadEFaktur from "./ModalEfaktur/ModalUploadEFaktur";
import ModalApprovalEFaktur from "./ModalEfaktur/ModalApprovalEFaktur";
import ModalRequestApprovalEFaktur from "./ModalEfaktur/ModalRequestApprovalEFaktur";
import LogAktivitasEFaktur from "./LogAktivitasEFaktur";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { getEFakturColumns, getActionColumn } from "./Tabel/EFakturColumns";
import {
  getListEFaktur,
  downloadEFakturList,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const ViewFaktur = () => {
  // Selector
  const {
    list_efaktur,
    loading,
    pagination,
    data_approval_history,
    loading_approval_history,
  } = useSelector((state) => state.efaktur);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = list_efaktur || [];

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("invoiceDate~desc");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [modalGenerateEFaktur, setModalGenerateEFaktur] = useState(false);
  const [modalGenerateXML, setModalGenerateXML] = useState(false);
  const [modalUploadEFaktur, setModalUploadEFaktur] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [logAktivitasOpen, setLogAktivitasOpen] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);

  const [selectedBilling, setSelectedBilling] = useState(null);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["efakturStatus", "action"],
  }));

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

  // Fetch data with filters
  useEffect(() => {
    dispatch(
      getListEFaktur({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, search, page, pageSize, sort]);

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

  // Handle Search
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
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadEFakturList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  // Handle Actions
  const handleGenerateEFaktur = (record) => {
    setSelectedBilling(record);
    setModalGenerateEFaktur(true);
  };

  const handleApprovalHistory = async (record) => {
    if (!record.efakturId) {
      message.warning("E-Faktur belum dibuat untuk billing ini");
      return;
    }

    if (loading_approval_history) {
      return;
    }
    await dispatch(getApprovalHistory(record.efakturId));
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

  const handleRequest = () => {
    setModalRequest(true);
  };

  // Bulk Action Handlers
  const handleBulkApproval = () => {
    setModalApproval(true);
  };

  const handleBulkUploadAttachment = () => {
    setModalUploadEFaktur(true);
  };

  const handleBulkGenerateXML = () => {
    setModalGenerateXML(true);
  };

  const handleRefresh = () => {
    dispatch(
      getListEFaktur({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  // Close Modal Functions
  const closeModalGenerateEFaktur = () => {
    setModalGenerateEFaktur(false);
    setSelectedBilling(null);
  };

  const closeModalGenerateXML = () => {
    setModalGenerateXML(false);
    setSelectedBilling(null);
  };

  const closeModalUploadEFaktur = () => {
    setModalUploadEFaktur(false);
    setSelectedBilling(null);
  };

  const closeModalApproval = () => {
    setModalApproval(false);
    setSelectedBilling(null);
  };

  const closeModalApprovalHistory = () => {
    setModalApprovalHistory(false);
  };

  const closeLogAktivitas = () => {
    setLogAktivitasOpen(false);
    setSelectedBilling(null);
  };

  const closeModalRequest = () => {
    setModalRequest(false);
  };

  // Columns Definition
  const baseColumns = useMemo(
    () =>
      getEFakturColumns({
        page,
        pageSize,
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleApprovalHistory,
        handleGenerateEFaktur,
        handleLogAktivitas,
      }),
    [page, pageSize, search, searchText, searchedColumn]
  );

  // Action Dropdown Menu - Updated Design
  const actionMenu = (
    <Menu
      items={[
        {
          key: "approval",
          label: "Approval",
          icon: <CheckOutlined style={{ color: "#1890ff" }} />,
          onClick: handleBulkApproval,
        },
        {
          key: "upload",
          label: "Upload Attachment",
          icon: <UploadOutlined style={{ color: "#1890ff" }} />,
          onClick: handleBulkUploadAttachment,
        },
        {
          key: "generate-xml",
          label: "Generate XML",
          icon: <FileTextOutlined style={{ color: "#1890ff" }} />,
          onClick: handleBulkGenerateXML,
        },
        {
          type: "divider",
        },
        {
          key: "request",
          label: "Request Approval",
          icon: <PlusOutlined style={{ color: "#52c41a" }} />,
          onClick: handleRequest,
        },
      ]}
    />
  );

  // Item Grant Access untuk action columns
  const itemGrantAccess = [
    ...getActionColumn({
      handleApprovalHistory,
      handleGenerateEFaktur,
      handleLogAktivitas,
    }),
  ];

  const actionCols = useColumnActionPermission(
    ["view", "update"],
    itemGrantAccess
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    const columnsWithFixed = applyFixedColumns(allColumns, fixedColumns);

    // Cari dan update width untuk action column
    return columnsWithFixed.map((col) => {
      // Jika ini adalah action column, set width yang lebih kecil
      if (
        col.key === "action" ||
        col.title === "ACTION" ||
        col.dataIndex === "action"
      ) {
        return {
          ...col,
          width: 80, // Sesuaikan ukuran yang diinginkan: 60, 70, 80, atau 100
          align: "center",
        };
      }
      return col;
    });
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">E-Faktur Management</p>
              <div className="flex gap-2">
                <ButtonComponent
                  type={"submit"}
                  border={false}
                  icon={<SVGIcon name="IconButtonDownload" width={24} />}
                  onClick={() => {
                    handleDownload();
                  }}
                >
                  Download List
                </ButtonComponent>
                {/* Action Dropdown - Updated */}
                <Dropdown overlay={actionMenu} trigger={["click"]}>
                  <ButtonComponent type="default">
                    Action <DownOutlined />
                  </ButtonComponent>
                </Dropdown>

                {/* Create E-Faktur Button */}
                <ButtonComponent
                  icon={<PlusOutlined />}
                  type="submit"
                  onClick={() => setModalGenerateEFaktur(true)}
                >
                  Create E-Faktur
                </ButtonComponent>
              </div>
            </div>
          }
        >
          {/* Table Section */}
          <div className="my-0">
            <TableRBI
              dataSource={dataSource}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={pagination?.totalElements || 0}
              tableScrolled={{ x: 3000, y: 525 }}
              onSort={onSort}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        {/* Modal Generate E-Faktur */}
        <ModalGenerateEFaktur
          isOpen={modalGenerateEFaktur}
          handleClose={closeModalGenerateEFaktur}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalGenerateEFaktur();
            handleRefresh();
          }}
        />

        {/* Modal Generate XML */}
        <ModalGenerateXML
          isOpen={modalGenerateXML}
          handleClose={closeModalGenerateXML}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalGenerateXML();
            handleRefresh();
          }}
        />

        {/* Modal Upload E-Faktur */}
        <ModalUploadEFaktur
          isOpen={modalUploadEFaktur}
          handleClose={closeModalUploadEFaktur}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalUploadEFaktur();
            handleRefresh();
          }}
        />

        {/* Modal Approval */}
        <ModalApprovalEFaktur
          isOpen={modalApproval}
          handleClose={closeModalApproval}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalApproval();
            handleRefresh();
          }}
        />
        {/* Modal Bulk Request Approval */}
        <ModalRequestApprovalEFaktur
          isOpen={modalRequest}
          handleClose={closeModalRequest}
          onSuccess={() => {
            closeModalRequest();
            handleRefresh();
          }}
        />

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && data_approval_history}
          handleClose={closeModalApprovalHistory}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
          loading={loading_approval_history}
        />

        {/* Log Aktivitas E-Faktur */}
        <LogAktivitasEFaktur
          isOpen={logAktivitasOpen}
          handleClose={closeLogAktivitas}
          billingData={selectedBilling}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default ViewFaktur;
