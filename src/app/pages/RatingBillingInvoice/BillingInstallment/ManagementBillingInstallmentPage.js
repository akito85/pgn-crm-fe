import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { Spin, Tooltip, Modal, Dropdown, Descriptions, Table, Tabs, Input, Button, Space } from "antd";
import { WarningOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import StatusComponent from "../../../../components/StatusComponent";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import TableRBI from "../../../../components/TableRBI";
import CardContainer from "../../../../components/CardContainer";
import CardContainerNoBorder from "../../../../components/CardContainerNoBorder";
import Toolbar from "../../../../components/Toolbar";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import moment from "moment";
import {
  getListInstallmentPaginate,
  getDownloadList,
  getDetailInstallment,
  getAccountDetail,
  getOpenItems,
  getApprovalHierarchyDetail,
  getApprovalHierarchyHeader,
  clearDetailInstallment,
  getAttachmentList,
  getEarlyRepaymentByInstallmentId,
  getApprovalHistoryInstallment,
} from "../../../../redux/slices/rating_billing_invoice/installment";
import ApprovalInstallment from "./Modal/ApprovalInstallment";
import { columnsInstallment } from "./Table/TableInstallment";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../constants/configApp";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import BaseContainer from "../../../../components/BaseContainer";
import SectionCard from "../../../../components/SectionCard";
import DetailText from "../../../../components/DetailText";
import LogHistoryInfo from "../../../../components/LogHistoryInfo";

const ManagementBillingInstallmentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const detailContainerRef = useRef(null);

  const {
    data,
    loading,
    data_detail,
    data_account_detail,
    data_open_items,
    data_approval_detail,
    data_approval_header,
    data_attachments,
    data_early_repayment,
    data_approval_history_installment,
  } = useSelector((state) => state.installment || {});
  const dataSource = data?.result || [];
  const totalData = data?.page?.totalElements;

  const [page, setPage] = useState(1);
  const initialPageSize = 100;
  const loadMoreSize = 20;
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [allData, setAllData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const shouldResetRef = useRef(true);

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("installmentFixedColumns");
      return saved
        ? JSON.parse(saved)
        : { left: ["no"], right: ["status", "accountStatus", "statusApproval", "action"] };
    } catch (e) {
      return { left: ["no"], right: ["status", "accountStatus", "statusApproval", "action"] };
    }
  });

  const [modalApproval, setModalApproval] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState(null);

  const [installmentData, setInstallmentData] = useState({});
  const [accountData, setAccountData] = useState({});
  const [contactsData, setContactsData] = useState([]);
  const [approvalData, setApprovalData] = useState([]);
  const [approvalHierarchyName, setApprovalHierarchyName] = useState("");
  const [attachmentData, setAttachmentData] = useState([]);

  // Approval status for detail section
  const [approvalStatus, setApprovalStatus] = useState({
    hasApprovalNormal: false,
    hasApprovalEarlyRepayment: false,
    isApprover: false,
    approvalNormalId: null,
    approvalEarlyRepaymentId: null,
    earlyRepaymentId: null,
  });
  const [modalApprovalAction, setModalApprovalAction] = useState(false);
  const [approvalActionType, setApprovalActionType] = useState("");
  const [approvalDescription, setApprovalDescription] = useState("");
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [loadingApprovalHistory, setLoadingApprovalHistory] = useState(false);

  // Loading state for detail
  const [detailLoading, setDetailLoading] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState("installment");

  // Search and sort state for detail tables (client-side)
  // Contact Information
  const [contactSearchText, setContactSearchText] = useState("");
  const [contactSearchedColumn, setContactSearchedColumn] = useState("");
  const contactSearchInput = useRef(null);

  // Open Item Information
  const [openItemSearchText, setOpenItemSearchText] = useState("");
  const [openItemSearchedColumn, setOpenItemSearchedColumn] = useState("");
  const openItemSearchInput = useRef(null);

  // Installment Detail Item
  const [detailSearchText, setDetailSearchText] = useState("");
  const [detailSearchedColumn, setDetailSearchedColumn] = useState("");
  const detailSearchInput = useRef(null);

  // Approval
  const [approvalSearchText, setApprovalSearchText] = useState("");
  const [approvalSearchedColumn, setApprovalSearchedColumn] = useState("");
  const approvalSearchInput = useRef(null);

  // Attachment
  const [attachmentSearchText, setAttachmentSearchText] = useState("");
  const [attachmentSearchedColumn, setAttachmentSearchedColumn] = useState("");
  const attachmentSearchInput = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("installmentFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  useEffect(() => {
    dispatch(
      getListInstallmentPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
      }),
    );
  }, [search, sort, dispatch, refreshKey]);

  useEffect(() => {
    if (data?.result) {
      if (shouldResetRef.current || page === 1) {
        setAllData(data.result);
        shouldResetRef.current = false;
      } else {
        setAllData((prev) => {
          const ids = new Set(prev.map((item) => item.id));
          const newItems = data.result.filter((item) => !ids.has(item.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  useEffect(() => {
    if (openDetail && selectedInstallmentId) {
      dispatch(getDetailInstallment(selectedInstallmentId));
      dispatch(getEarlyRepaymentByInstallmentId(selectedInstallmentId));
      dispatch(
        getAttachmentList({
          installmentId: selectedInstallmentId,
          page: 0,
          pageSize: 100,
        }),
      );
    }
  }, [openDetail, selectedInstallmentId, dispatch]);

  useEffect(() => {
    if (data_detail && Object.keys(data_detail).length > 0 && openDetail) {
      setInstallmentData(data_detail);
      setContactsData(data_detail.contacts || []);

      if (data_detail.accountNumber) {
        dispatch(getAccountDetail(data_detail.accountNumber));
        dispatch(getOpenItems(data_detail.accountNumber));
      }

      if (data_detail.appHierId) {
        dispatch(getApprovalHierarchyDetail(data_detail.appHierId));
        dispatch(getApprovalHierarchyHeader(data_detail.appHierId));
      }

      // Hide loading when data is loaded
      setDetailLoading(false);
    }
  }, [data_detail, openDetail, dispatch]);

  const fetchApprovalStatus = async (installmentId) => {
    try {
      const response = await ratingBillingHttpService.getDetail(`/v1/dbs/api/installment/check-approval-status/${installmentId}`);
      if (response && response.data) {
        setApprovalStatus(response.data);
      }
    } catch (error) {
      console.error("Error fetching approval status:", error);
    }
  };

  useEffect(() => {
    if (data_account_detail && Object.keys(data_account_detail).length > 0) {
      setAccountData(data_account_detail);
    }
  }, [data_account_detail]);


  useEffect(() => {
    if (data_approval_detail && Array.isArray(data_approval_detail)) {
      setApprovalData(data_approval_detail);
    }
  }, [data_approval_detail]);

  useEffect(() => {
    if (data_approval_header && data_approval_header.approvalName) {
      setApprovalHierarchyName(data_approval_header.approvalName);
    }
  }, [data_approval_header]);

  useEffect(() => {
    if (data_attachments?.result && Array.isArray(data_attachments.result)) {
      const formattedAttachments = data_attachments.result.map((item) => ({
        id: item.id,
        size: item.size,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.type,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        urlFile2: item.urlFile2,
        createdBy: item.createdBy,
        createdDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "",
        dataType: "exist",
        key: item.id,
      }));
      setAttachmentData(formattedAttachments);
    }
  }, [data_attachments]);

  const earlyRepaymentData = data_early_repayment || {};
  const hasEarlyRepayment = Boolean(earlyRepaymentData?.repaymentId || earlyRepaymentData?.id);
  const isEarlyRepaymentApproval = approvalStatus.hasApprovalEarlyRepayment && !approvalStatus.hasApprovalNormal;

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_VIEW,
      breadcrumbName: "Management Billing Installment",
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    shouldResetRef.current = true;
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    shouldResetRef.current = true;
    setPage(1);
    setSort(dataSort);
  };

  // Helper function for client-side table search
  const getColumnSearchProps = (dataIndex, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
            confirm();
          }}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
              confirm();
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSearchText("");
              setSearchedColumn("");
              clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInputRef.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleLoadMore = useCallback(async () => {
    if (allData.length >= (data?.page?.totalElements || 0)) return;
    const nextPage = Math.floor(allData.length / loadMoreSize) + 1;
    setPage(nextPage);
    await dispatch(
      getListInstallmentPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
      }),
    );
  }, [
    allData.length,
    data?.page?.totalElements,
    search,
    sort,
    dispatch,
    loadMoreSize,
  ]);

  const hasMore = allData.length < (data?.page?.totalElements || 0);

  const handleRefresh = useCallback(() => {
    shouldResetRef.current = true;
    if (page === 1) {
      setRefreshKey((prev) => prev + 1);
    } else {
      setPage(1);
    }
  }, [page]);

  const handleDownload = () => {
    let tempSearch = {};
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch[dataIndex] = tempSearchText;
        }
      }
    }
    const searchString = Object.keys(tempSearch).length > 0 ? JSON.stringify(tempSearch) : "";
    
    dispatch(
      getDownloadList({
        page,
        pageSize: initialPageSize,
        sort,
        search: searchString,
      }),
    );
  };

  const handleOpenModalApproval = () => {
    setModalApproval(true);
  };

  const handleCloseModalApproval = () => {
    setModalApproval(false);
  };

  const handleOpenApprovalModal = (type) => {
    setApprovalActionType(type);
    setApprovalDescription("");
    setModalApprovalAction(true);
  };

  const handleCloseApprovalModal = () => {
    setModalApprovalAction(false);
    setApprovalActionType("");
    setApprovalDescription("");
  };

  const handleApprovalHistory = (record) => {
    setLoadingApprovalHistory(true);
    dispatch(getApprovalHistoryInstallment(record.id)).finally(() => {
      setLoadingApprovalHistory(false);
    });
    setModalApprovalHistory(true);
  };

  const handleApprovalHistoryOptions = (approvalData) => {
    const data = approvalData?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  useEffect(() => {
    if (data_approval_history_installment && Object.keys(data_approval_history_installment).length > 0) {
      const installmentHistory = data_approval_history_installment.installment || {};
      const earlyRepaymentHistory = data_approval_history_installment.earlyRepayment || {};

      const dataApprover = {
        installment: installmentHistory?.dataApprover?.INSTALLMENT || [],
        "early repayment": earlyRepaymentHistory?.dataApprover?.INSTALLMENT_EARLY_REPAYMENT || [],
      };

      const dataHistory = {
        installment: installmentHistory?.dataHistory?.INSTALLMENT || [],
        "early repayment": earlyRepaymentHistory?.dataHistory?.INSTALLMENT_EARLY_REPAYMENT || [],
      };

      setDataApprovalHistory({ dataApprover, dataHistory });
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history_installment]);

  const handleConfirmApproval = async () => {
    try {
      const isNormalApproval = approvalStatus.hasApprovalNormal;
      const endpoint = isNormalApproval
        ? "/v1/dbs/api/installment/approval-installment"
        : "/v1/dbs/api/installment/approval-early-repayment";

      const approvalId = isNormalApproval
        ? approvalStatus.approvalNormalId
        : approvalStatus.approvalEarlyRepaymentId;

      const payload = isNormalApproval
        ? {
            installmentIds: [selectedInstallmentId],
            approvalIds: [approvalId],
            description: approvalDescription,
            action: approvalActionType === "approve" ? "APPROVE" : "REJECT",
          }
        : {
            repaymentIds: [approvalStatus.earlyRepaymentId],
            approvalIds: [approvalId],
            description: approvalDescription,
            action: approvalActionType === "approve" ? "APPROVE" : "REJECT",
          };

      await ratingBillingHttpService.createData(endpoint, payload);

      setModalApprovalAction(false);
      Modal.success({
        title: "Success",
        content: `Installment ${approvalActionType === "approve" ? "approved" : "rejected"} successfully.`,
        onOk: () => {
          handleRefresh();
          handleCloseDetail();
        },
      });
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Failed to process approval";
      Modal.error({
        title: "Error",
        content: message,
      });
      setModalApprovalAction(false);
    }
  };

  const handleOpenDetail = (record) => {
    // If clicking the same record that is already open, close it (toggle)
    if (selectedInstallmentId === record.id && openDetail) {
      // Close detail immediately without calling handleCloseDetail to avoid async issues
      setOpenDetail(false);
      setSelectedInstallmentId(null);
      setDetailLoading(false);
      setInstallmentData({});
      setAccountData({});
      setContactsData([]);
      setApprovalData([]);
      setAttachmentData([]);
      dispatch(clearDetailInstallment());
      return;
    }

    // If clicking a different record while detail is open, just switch to new record
    // No need to close and reopen, just update the data
    if (openDetail && selectedInstallmentId !== record.id) {
      setDetailLoading(true);
      setSelectedInstallmentId(record.id);
      setInstallmentData({});
      setAccountData({});
      setContactsData([]);
      setApprovalData([]);
      setApprovalHierarchyName("");
      setAttachmentData([]);
      setApprovalStatus({
        hasApprovalNormal: false,
        hasApprovalEarlyRepayment: false,
        isApprover: false,
        approvalNormalId: null,
        approvalEarlyRepaymentId: null,
        earlyRepaymentId: null,
      });
      fetchApprovalStatus(record.id);
      setTimeout(() => {
        detailContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }

    // Show loading and open detail for the first time
    setDetailLoading(true);
    setSelectedInstallmentId(record.id);
    setOpenDetail(true);
    fetchApprovalStatus(record.id);
    setTimeout(() => {
      detailContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedInstallmentId(null);
    setDetailLoading(false);
    dispatch(clearDetailInstallment());
    setInstallmentData({});
    setAccountData({});
    setContactsData([]);
    setApprovalData([]);
    setApprovalHierarchyName("");
    setApprovalStatus({
      hasApprovalNormal: false,
      hasApprovalEarlyRepayment: false,
      isApprover: false,
      approvalNormalId: null,
      approvalEarlyRepaymentId: null,
    });
  };

  const handleEdit = () => {
    navigate(RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_UPDATE, { state: { id: selectedInstallmentId } });
  };

  const contactColumns = [
    {
      title: "Contact Name",
      dataIndex: "contactName",
      key: "contactName",
      width: 200,
      sorter: (a, b) => (a.contactName || "").localeCompare(b.contactName || ""),
      ...getColumnSearchProps("contactName", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
    {
      title: "Job",
      dataIndex: "job",
      key: "job",
      width: 150,
      sorter: (a, b) => (a.job || "").localeCompare(b.job || ""),
      ...getColumnSearchProps("job", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: 150,
      sorter: (a, b) => (a.position || "").localeCompare(b.position || ""),
      ...getColumnSearchProps("position", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
      ...getColumnSearchProps("address", contactSearchText, setContactSearchText, contactSearchedColumn, setContactSearchedColumn, contactSearchInput),
      render: (text) => {
        if (!text) return "-";
        const maxLength = 30;
        const isLong = text.length > maxLength;
        const displayText = isLong ? `${text.substring(0, maxLength)}...` : text;
        return (
          <Tooltip title={isLong ? text : ""}>
            <span>{displayText}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Primary",
      dataIndex: "isPrimary",
      key: "isPrimary",
      width: 80,
      sorter: (a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isPrimary === value,
      render: (val) => (val ? "Yes" : "No"),
    },
  ];

  const contactDetailColumns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      sorter: (a, b) => (a.type || "").localeCompare(b.type || ""),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 250,
      sorter: (a, b) => (a.value || "").localeCompare(b.value || ""),
    },
  ];

  const openItemColumns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 150,
      sorter: (a, b) => (a.invoiceNumber || "").localeCompare(b.invoiceNumber || ""),
      ...getColumnSearchProps("invoiceNumber", openItemSearchText, setOpenItemSearchText, openItemSearchedColumn, setOpenItemSearchedColumn, openItemSearchInput),
    },
    {
      title: "Billing Period",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 120,
      sorter: (a, b) => (a.billingPeriod || "").localeCompare(b.billingPeriod || ""),
      ...getColumnSearchProps("billingPeriod", openItemSearchText, setOpenItemSearchText, openItemSearchedColumn, setOpenItemSearchedColumn, openItemSearchInput),
    },
    {
      title: "Billing Item Name",
      dataIndex: "billingItemName",
      key: "billingItemName",
      width: 200,
      sorter: (a, b) => (a.billingItemName || "").localeCompare(b.billingItemName || ""),
      ...getColumnSearchProps("billingItemName", openItemSearchText, setOpenItemSearchText, openItemSearchedColumn, setOpenItemSearchedColumn, openItemSearchInput),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      render: (amount) => new Intl.NumberFormat("id-ID").format(amount || 0),
    },
  ];

  const approvalColumns = [
    {
      title: "Approver Name",
      dataIndex: "approverName",
      key: "approverName",
      width: 200,
      sorter: (a, b) => (a.approverName || "").localeCompare(b.approverName || ""),
      ...getColumnSearchProps("approverName", approvalSearchText, setApprovalSearchText, approvalSearchedColumn, setApprovalSearchedColumn, approvalSearchInput),
    },
    {
      title: "Position",
      dataIndex: "positionName",
      key: "positionName",
      width: 200,
      sorter: (a, b) => (a.positionName || "").localeCompare(b.positionName || ""),
      ...getColumnSearchProps("positionName", approvalSearchText, setApprovalSearchText, approvalSearchedColumn, setApprovalSearchedColumn, approvalSearchInput),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => (record.status || "Pending") === value,
      render: (status) => (
        <StatusComponent colour={status}>{status || "Pending"}</StatusComponent>
      ),
    },
    {
      title: "Approved Date",
      dataIndex: "approvedDate",
      key: "approvedDate",
      width: 150,
      sorter: (a, b) => new Date(a.approvedDate || 0) - new Date(b.approvedDate || 0),
      render: (date) => (date ? moment(date).format("DD MMM YYYY HH:mm:ss") : "-"),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      width: 200,
      sorter: (a, b) => (a.remark || "").localeCompare(b.remark || ""),
      ...getColumnSearchProps("remark", approvalSearchText, setApprovalSearchText, approvalSearchedColumn, setApprovalSearchedColumn, approvalSearchInput),
    },
  ];

  const renderAccountInformation = () => (
    <SectionCard title="ACCOUNT INFORMATION">
      <div className="grid grid-cols-5 w-full gap-y-4 gap-x-4">
        <DetailText label="Account Number">
          {installmentData.accountNumber || "-"}
        </DetailText>
        <DetailText label="Account Name">
          {accountData.accountName || installmentData.accountName || "-"}
        </DetailText>
        <DetailText label="Customer Number">
          {accountData.customerNumber || "-"}
        </DetailText>
        <DetailText label="Customer Name">
          {accountData.customerName || installmentData.customerName || "-"}
        </DetailText>
        <DetailText label="Account Group Type">
          {accountData.accountGroupType || installmentData.accountGroupType || "-"}
        </DetailText>
        <DetailText label="Account Type">
          {accountData.accountType || installmentData.accountType || "-"}
        </DetailText>
        <DetailText label="Classification Type">
          {accountData.classificationType || installmentData.classificationType || "-"}
        </DetailText>
        <DetailText label="Service Type">
          {accountData.serviceType || installmentData.serviceType || "-"}
        </DetailText>
        <DetailText label="SOR">
          {accountData.sor || installmentData.sor || "-"}
        </DetailText>
        <DetailText label="Cost Center">
          {accountData.costCenter || installmentData.costCenter || "-"}
        </DetailText>
        <DetailText label="Account Segment">
          {accountData.accountSegment || installmentData.accountSegment || "-"}
        </DetailText>
        <DetailText label="Meter Reading Code">
          {accountData.meterReadingCode || "-"}
        </DetailText>
        <DetailText label="Account Registration Number">
          {accountData.accountRegistrationNumber || "-"}
        </DetailText>
        <DetailText label="Account Status">
          {accountData.accountStatus || installmentData.accountStatus ? (
            <StatusComponent colour={accountData.accountStatus || installmentData.accountStatus}>
              {accountData.accountStatus || installmentData.accountStatus}
            </StatusComponent>
          ) : (
            "-"
          )}
        </DetailText>
      </div>
    </SectionCard>
  );

  const renderContactInformation = () => (
    <SectionCard title="CONTACT INFORMATION">
      {contactsData.length === 0 ? (
        <p className="text-gray-400 text-xs p-4">No contact available</p>
      ) : (
        <Table
          className="custom-table-small"
          columns={contactColumns}
          dataSource={contactsData.map((item, idx) => ({
            ...item,
            key: idx,
          }))}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: "12px 24px", backgroundColor: "#f9f9f9" }}>
                <Table
                  className="custom-table-small"
                  columns={contactDetailColumns}
                  dataSource={(record.contactDetails || []).map((detail, dIdx) => ({
                    ...detail,
                    key: dIdx,
                  }))}
                  pagination={false}
                  size="small"
                  showHeader={true}
                  bordered={true}
                  style={{ backgroundColor: "#fff", borderSize: 4 }}
                />
              </div>
            ),
            rowExpandable: (record) => (record.contactDetails || []).length > 0,
          }}
          pagination={false}
          size="small"
          bordered={true}
          scroll={{ y: 250 }}
        />
      )}
    </SectionCard>
  );

  const renderInstallmentInformation = () => (
    <SectionCard title="INSTALLMENT INFORMATION">
      <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
        <DetailText label="Installment Number">
          {installmentData.installmentNumber || "-"}
        </DetailText>
        <DetailText label="Type">
          {installmentData.installmentType || "-"}
        </DetailText>
        <DetailText label="Tenor">
          {installmentData.tenor ? `${installmentData.tenor} Bulan` : "-"}
        </DetailText>
        <DetailText label="Start Period">
          {installmentData.startPeriod || "-"}
        </DetailText>
        <DetailText label="Source">
          {installmentData.source || "-"}
        </DetailText>
        <DetailText label="Request Date">
          {installmentData.createdDate
            ? moment(installmentData.createdDate).format("DD MMM YYYY")
            : "-"}
        </DetailText>
        <DetailText label="Currency">
          {installmentData.currency || "-"}
        </DetailText>
        <DetailText label="Total Amount">
          {installmentData.totalAmount
            ? `${installmentData.currency || ""} ${new Intl.NumberFormat("id-ID").format(installmentData.totalAmount)}`
            : "-"}
        </DetailText>
        <DetailText label="Status">
          {installmentData.status ? (
            <StatusComponent colour={installmentData.status}>{installmentData.status}</StatusComponent>
          ) : (
            "-"
          )}
        </DetailText>
        <DetailText label="Status Approval">
          {installmentData.statusApproval ? (
            <StatusComponent colour={installmentData.statusApproval}>
              {installmentData.statusApproval}
            </StatusComponent>
          ) : (
            "-"
          )}
        </DetailText>
        <DetailText label="Created Date">
          {installmentData.createdDate
            ? moment(installmentData.createdDate).format("DD MMM YYYY HH:mm:ss")
            : "-"}
        </DetailText>
        <DetailText label="Created By">
          {installmentData.createdBy || "-"}
        </DetailText>
        <div className="col-span-5">
          <DetailText label="Remark">{installmentData.remark || "-"}</DetailText>
        </div>
      </div>
    </SectionCard>
  );

  const renderEarlyRepaymentInformation = () => (
    <SectionCard title="EARLY REPAYMENT INFORMATION">
      <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
        <DetailText label="Source">
          {earlyRepaymentData.source || "-"}
        </DetailText>
        <DetailText label="Request Date">
          {earlyRepaymentData.repaymentDate
            ? moment(earlyRepaymentData.repaymentDate).format("DD MMM YYYY")
            : "-"}
        </DetailText>
        <DetailText label="Status Approval">
          {earlyRepaymentData.statusApproval ? (
            <StatusComponent colour={earlyRepaymentData.statusApproval}>
              {earlyRepaymentData.statusApproval}
            </StatusComponent>
          ) : (
            "-"
          )}
        </DetailText>
        <div className="col-span-5">
          <DetailText label="Reason">
            {earlyRepaymentData.reason || "-"}
          </DetailText>
        </div>
      </div>
    </SectionCard>
  );

  const renderOpenItemInformation = () => {
    const selectedOpenItems = data_detail?.selectedOpenItems || [];

    if (selectedOpenItems.length === 0) {
      return (
        <SectionCard title="OPEN ITEM INFORMATION">
          <p className="text-gray-400 text-xs p-4">No open items selected</p>
        </SectionCard>
      );
    }

    // Columns without checkbox (view only)
    const selectedOpenItemColumns = [
      {
        title: "Invoice Number",
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 150,
      },
      {
        title: "Billing Period",
        dataIndex: "billingPeriod",
        key: "billingPeriod",
        width: 120,
      },
      {
        title: "Billing Item Name",
        dataIndex: "billingItemName",
        key: "billingItemName",
        width: 200,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 150,
        align: "right",
        render: (amount) => new Intl.NumberFormat("id-ID").format(amount || 0),
      },
    ];

    return (
      <SectionCard title="OPEN ITEM INFORMATION">
        {(data_open_items || []).map((currencyGroup) => {
          // Filter items that are selected for this currency
          const selectedItems = (currencyGroup.items || []).filter((item) =>
            selectedOpenItems.some(
              (sel) => sel.currency === currencyGroup.currency && sel.billingItemId === item.billItemId
            )
          );

          // Skip if no selected items for this currency
          if (selectedItems.length === 0) {
            return null;
          }

          const totalAmount = selectedItems.reduce((sum, item) => sum + (item.amount || 0), 0);

          return (
            <React.Fragment key={currencyGroup.currency}>
              <p className="text-sm font-semibold text-primary mb-2 mt-4 first:mt-0">Currency: {currencyGroup.currency}</p>
              <Table
                className="custom-table-small"
                columns={selectedOpenItemColumns}
                dataSource={selectedItems.map((item, idx) => ({
                  ...item,
                  key: `${currencyGroup.currency}-${item.billItemId || idx}`,
                  currency: currencyGroup.currency,
                }))}
                pagination={false}
                size="small"
                bordered={true}
                scroll={{ y: 200 }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3} index={0}>
                      <strong>Total</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <strong>
                        {currencyGroup.currency} {new Intl.NumberFormat("id-ID").format(totalAmount)}
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </React.Fragment>
          );
        })}
      </SectionCard>
    );
  };

  const renderInstallmentSchedule = () => {
    if (!installmentData.details || installmentData.details.length === 0) {
      return (
        <SectionCard title="INSTALLMENT DETAIL ITEM">
          <p className="text-gray-400 text-xs">No installment schedule available</p>
        </SectionCard>
      );
    }

    // Define columns with search and sort
    const detailColumns = [
      {
        title: "Sequence",
        dataIndex: "sequenceNo",
        key: "sequenceNo",
        width: 100,
        align: "center",
        sorter: (a, b) => (a.sequenceNo || 0) - (b.sequenceNo || 0),
        ...getColumnSearchProps("sequenceNo", detailSearchText, setDetailSearchText, detailSearchedColumn, setDetailSearchedColumn, detailSearchInput),
      },
      {
        title: "Period",
        dataIndex: "period",
        key: "period",
        width: 150,
        sorter: (a, b) => (a.period || "").localeCompare(b.period || ""),
        ...getColumnSearchProps("period", detailSearchText, setDetailSearchText, detailSearchedColumn, setDetailSearchedColumn, detailSearchInput),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 150,
        align: "right",
        sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
        render: (amount) =>
          `${installmentData.currency || ""} ${new Intl.NumberFormat("id-ID").format(amount || 0)}`,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
        filters: [
          { text: "Draft", value: "Draft" },
          { text: "Open", value: "Open" },
          { text: "Paid", value: "Paid" },
        ],
        onFilter: (value, record) => (record.status || "Draft") === value,
        render: (status) => (
          <div className="flex justify-center">
            <StatusComponent colour={status || "P"}>{status || "Draft"}</StatusComponent>
          </div>
        ),
      },
    ];

    return (
      <SectionCard title="INSTALLMENT DETAIL ITEM">
        <Table
          className="custom-table-small"
          columns={detailColumns}
          dataSource={installmentData.details.map((item, idx) => ({
            ...item,
            key: idx,
          }))}
          pagination={false}
          size="small"
          bordered={true}
          scroll={{ y: 300 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2} index={0}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <strong>
                  {installmentData.currency || ""} {new Intl.NumberFormat("id-ID").format(installmentData.totalAmount || 0)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
            </Table.Summary.Row>
          )}
        />
      </SectionCard>
    );
  };

  // Tab items configuration
  const tabItems = [
    {
      key: "installment",
      label: "Installment",
      children: (
        <div className="space-y-4 p-5">
          {renderAccountInformation()}
          {renderInstallmentInformation()}
          {hasEarlyRepayment && renderEarlyRepaymentInformation()}
          {renderContactInformation()}
          {renderOpenItemInformation()}
          {renderInstallmentSchedule()}
          <LogHistoryInfo
            data={{
              recordId: installmentData?.installmentId || "-",
              createdDate: installmentData?.createdDate
                ? moment(installmentData?.createdDate).format("DD MMM YYYY HH:mm:ss")
                : "-",
              createdBy: installmentData?.createdBy || "-",
              updatedDate: installmentData?.updatedDate
                ? moment(installmentData?.updatedDate).format("DD MMM YYYY HH:mm:ss")
                : "-",
              updatedBy: installmentData?.updatedBy || "-",
            }}
          />
        </div>
      ),
    },
    {
      key: "approval",
      label: "Approval",
      children: (
        <div className="px-5 pb-5">
          <BaseContainer header="APPROVAL INFORMATION">
            <ApprovalComponentGeneral
              dataTable={approvalData}
              dataOption={[]}
              selectedHierarchy={installmentData?.appHierId}
              showSelect={false}
              disableSelect={true}
              approvalName={approvalHierarchyName || installmentData?.approvalHierarchyName}
            />
          </BaseContainer>
        </div>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <div className="px-5 pb-5">
          <BaseContainer header="ATTACHMENT INFORMATION">
            <AttachmentComponent
              data={attachmentData}
              type="detail"
              typeSelector="installment"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </BaseContainer>
        </div>
      ),
    },
  ];

  const baseColumns = useMemo(() => {
    const installmentCols = [
      ...columnsInstallment(
        search,
        page,
        initialPageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    ];

    const columnsWithKeys = installmentCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [search, page, searchedColumn, searchText]);

  const actionColumn = useMemo(() => {
    return [
      {
        title: "ACTION",
        key: "action",
        width: 120,
        align: "center",
        fixed: "right",
        render: (text, record) => {
          const isDraft = record.statusApproval?.toLowerCase() === "draft";
          const isActive = record.status?.toUpperCase() === "ACTIVE";
          
          const menuItems = [
            {
              key: "edit",
              label: isDraft ? (
                <NavLink
                  to={`${RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_UPDATE}`}
                  state={{ id: record.id }}
                >
                  Edit
                </NavLink>
              ) : (
                <span className="text-[#8D91A0]">Edit</span>
              ),
              icon: (
                <SVGIcon
                  name="IconEdit"
                  color={isDraft ? "#0075BF" : "#8D91A0"}
                  width={16}
                />
              ),
              disabled: !isDraft,
            },
            {
              key: "earlyRepayment",
              label: isActive ? (
                <NavLink
                  to={`${RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_EARLY_REPAYMENT}`}
                  state={{ id: record.id }}
                >
                  Early Repayment
                </NavLink>
              ) : (
                <span className="text-[#8D91A0]">Early Repayment</span>
              ),
              icon: (
                <SVGIcon
                  name="IconEdit"
                  color={isActive ? "#0075BF" : "#8D91A0"}
                  width={16}
                />
              ),
              disabled: !isActive,
            },
            {
              key: "history",
              label: "Approval History",
              icon: (
                <SVGIcon
                  name="IconLogHistory"
                  color="#0075BF"
                  width={16}
                />
              ),
              onClick: () => handleApprovalHistory(record),
            },
            {
              key: "delete",
              label: isDraft ? "Delete" : "Cannot Delete",
              icon: (
                <SVGIcon
                  name="IconDelete"
                  color={isDraft ? "#D32F2F" : "#8D91A0"}
                  width={16}
                />
              ),
              disabled: !isDraft,
              onClick: () => {
                if (isDraft) {
                  Modal.confirm({
                    title: "Delete Installment",
                    icon: <WarningOutlined style={{ color: "#faad14" }} />,
                    content: `Are you sure you want to delete Installment ${record.installmentNumber}?`,
                    okText: "Delete",
                    okType: "danger",
                    cancelText: "Cancel",
                    centered: true,
                    onOk: () => {
                      ratingBillingHttpService
                        .deleteData(`/v1/dbs/api/installment/delete/${record.id}`)
                        .then(() => {
                          Modal.success({
                            title: "Success",
                            content: "Installment deleted successfully.",
                            onOk: () => {
                              handleRefresh();
                            },
                          });
                        })
                        .catch((error) => {
                          const message =
                            error?.response?.data?.message ||
                            error?.message ||
                            "Failed to delete installment";
                          Modal.error({
                            title: "Error",
                            content: message,
                          });
                        });
                    },
                  });
                }
              },
            },
          ];

          return (
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title="Aksi Lainnya">
                <Dropdown
                  menu={{ items: menuItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <div className="cursor-pointer">
                    <MoreOutlined style={{ fontSize: 20, color: "#0075BF" }} />
                  </div>
                </Dropdown>
              </Tooltip>
              <Tooltip title="Detail">
                <div
                  className="cursor-pointer"
                  onClick={() => handleOpenDetail(record)}
                >
                  <SVGIcon name="IconDetail" width={20} />
                </div>
              </Tooltip>
            </div>
          );
        },
      },
    ];
  }, [openDetail, selectedInstallmentId]);

  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionColumn].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, actionColumn]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            border={false}
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Upload",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconUpload" color={"#FFFFFF"} width={17} />}
          type="submit"
          border={false}
        >
          Upload
        </ButtonComponent>
      ),
    },
    {
      action: "Approve",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" color={"#FFFFFF"} width={20} />}
          type="submit"
          border={false}
          onClick={() => handleOpenModalApproval()}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Download",
      render: (
        <ButtonComponent
          type="submit"
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .custom-table-small .ant-table {
          font-size: 11px !important;
        }
        .custom-table-small .ant-table-cell {
          font-size: 11px !important;
          padding: 4px 8px !important;
        }
        .custom-table-small .ant-table-thead > tr > th {
          font-size: 10px !important;
          padding: 4px 8px !important;
        }
        .custom-table-small .ant-table-tbody > tr > td {
          font-size: 11px !important;
          padding: 4px 8px !important;
        }
      `}</style>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">BILLING INSTALLMENT</p>
            <div className="flex gap-x-2">
              <NavLink to={RBI_ROUTES.MANAGEMENT_BILLING_INSTALLMENT_CREATE}>
                <ButtonComponent
                  icon={<SVGIcon name="IconButtonCreate" width={20} />}
                  type="submit"
                  border={false}
                >
                  Create
                </ButtonComponent>
              </NavLink>
              <ButtonComponent
                icon={<SVGIcon name="IconUpload" color={"#FFFFFF"} width={17} />}
                type="submit"
                border={false}
              >
                Upload
              </ButtonComponent>
              <ButtonComponent
                icon={<SVGIcon name="IconRequestApproval" color={"#FFFFFF"} width={20} />}
                type="submit"
                border={false}
                onClick={() => handleOpenModalApproval()}
              >
                Approval
              </ButtonComponent>
              <ButtonComponent
                type="submit"
                border={false}
                icon={<SVGIcon name="IconButtonDownload" width={20} />}
                onClick={() => handleDownload()}
              >
                Download List
              </ButtonComponent>
            </div>
          </div>
        }
      >
        <div className="my-0">
          <TableRBI
            idTable="installment-table"
            totalData={totalData}
            dataSource={allData}
            columns={processedColumns}
            tableScrolled={{ x: 2000, y: 525 }}
            onSort={onSort}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadMoreThreshold={20}
            showRefresh={true}
            onRefresh={handleRefresh}
            refreshLabel="Refresh"
          />
        </div>
      </CardContainer>

      {openDetail === true && (
        <div ref={detailContainerRef} className="mb-5">
          <CardContainerNoBorder
            header="BILLING INSTALLMENT DETAIL"
            className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
            noPadding
            collapsible={true}
            defaultExpanded={true}
            extraHeader={
              <div className="flex gap-x-2">
                <ButtonComponent
                  icon={<SVGIcon name="IconEdit" width={20} />}
                  type="submit"
                  border={false}
                  onClick={handleEdit}
                  disabled={
                    installmentData.statusApproval?.toLowerCase() !== "draft" &&
                    installmentData.statusApproval?.toLowerCase() !== "rejected"
                  }
                >
                  Edit
                </ButtonComponent>
                <ButtonComponent
                  icon={<SVGIcon name="IconClose" width={20} />}
                  type="button"
                  border={false}
                  onClick={handleCloseDetail}
                >
                  Close
                </ButtonComponent>
              </div>
            }
          >
            {detailLoading ? (
              <div className="flex justify-center items-center py-10">
                <Spin size="large" />
              </div>
            ) : (
              <div className="full-width-tabs">
                <Tabs
                  activeKey={activeTab}
                  items={tabItems}
                  onChange={setActiveTab}
                  className="custom-tabs-layout"
                />
                {approvalStatus.isApprover && (approvalStatus.hasApprovalNormal || approvalStatus.hasApprovalEarlyRepayment) && (
                  <div className="flex justify-end gap-2 px-5 pb-5">
                    <ButtonComponent
                      type="submit"
                      border={false}
                      onClick={() => handleOpenApprovalModal("approve")}
                    >
                      {isEarlyRepaymentApproval ? "Approve Early Repayment" : "Approve"}
                    </ButtonComponent>
                    <ButtonComponent
                      type="default"
                      onClick={() => handleOpenApprovalModal("reject")}
                    >
                      Reject
                    </ButtonComponent>
                  </div>
                )}
              </div>
            )}
          </CardContainerNoBorder>
        </div>
      )}

      <ApprovalInstallment
        isOpen={modalApproval}
        handleCancel={handleCloseModalApproval}
        handleApproveReject={handleRefresh}
      />

      <Modal
        title={
          approvalActionType === "approve"
            ? `${isEarlyRepaymentApproval ? "Approve Early Repayment" : "Approve"} Installment`
            : "Reject Installment"
        }
        open={modalApprovalAction}
        onCancel={handleCloseApprovalModal}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button key="cancel" onClick={handleCloseApprovalModal}>
              Cancel
            </Button>
            <Button
              key="submit"
              type={approvalActionType === "approve" ? "primary" : "default"}
              danger={approvalActionType === "reject"}
              onClick={handleConfirmApproval}
              disabled={!approvalDescription.trim()}
            >
              {approvalActionType === "approve"
                ? isEarlyRepaymentApproval
                  ? "Approve Early Repayment"
                  : "Approve"
                : "Reject"}
            </Button>
          </div>
        }
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter description / remark"
          value={approvalDescription}
          onChange={(e) => setApprovalDescription(e.target.value)}
        />
      </Modal>

      <ModalHistory
        isOpen={modalApprovalHistory && dataApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header="Approval History"
        width={1000}
        tabOptions={handleApprovalHistoryOptions(dataApprovalHistory)}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
        loading={loadingApprovalHistory}
      />
    </>
  );
};

export default ManagementBillingInstallmentPage;
