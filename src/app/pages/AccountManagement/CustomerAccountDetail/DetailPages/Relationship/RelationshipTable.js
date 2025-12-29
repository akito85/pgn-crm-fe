// React imports
import { Fragment, useRef, useState, useEffect, useMemo, useCallback } from "react";

// Ant Design imports
import { Checkbox, Tooltip, Spin, Popover, Space } from "antd";
import {
  MoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

// React Router imports
import { NavLink, useNavigate } from "react-router-dom";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  getRelationshipListAdvanced,
  toggleRelationshipStatus,
  approveOrRejectRelationship,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";

// Utility imports
import { hasValue, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

// Component imports
import { TablePaginationNew } from "poc-table-dragandrop";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";

// Local imports
import RelationshipDetail from "./RelationshipDetail";
import RelationshipApprovalDetail from "./RelationshipApprovalDetail";
import ModalApprovalHistory from "./ModalApprovalHistory";
import ModalConfirmApproval from "./ModalConfirmApproval";

// Route imports
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";

// Library imports
import moment from "moment";

// Import TablePagination for nested table in expandable rows
import TablePagination from "../../../../../../components/TablePagination";

// ============================================
// CONSTANTS (moved outside component for performance)
// ============================================

// Mock attachment data for approval detail
const MOCK_ATTACHMENT_DATA = [
  {
    key: 1,
    type: "Contract",
    fileName: "relationship_contract.pdf",
    fileSize: "2.5 MB",
  },
  {
    key: 2,
    type: "Agreement",
    fileName: "partnership_agreement.docx",
    fileSize: "1.8 MB",
  },
];

/**
 * Format status text to Title Case with special handling
 * @param {string} status - Raw status string
 * @param {Object} statusMap - Optional mapping for specific status values
 * @returns {string} Formatted status text
 */
const formatStatusText = (status, statusMap = {}) => {
  if (!status) return status;

  // Check for specific mappings first
  const upperStatus = status.toUpperCase().replace(/_/g, " ");
  if (statusMap[upperStatus]) return statusMap[upperStatus];
  if (statusMap[status]) return statusMap[status];

  // Default: Title Case
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

/**
 * Create nested column configuration (DRY helper)
 * @param {string} title - Column title
 * @param {string} dataIndex - Data index for the column
 * @returns {Object} Column configuration
 */
const createNestedColumn = (title, dataIndex) => ({
  title: () => (
    <div className="flex items-center justify-between w-full">
      <span>{title}</span>
    </div>
  ),
  dataIndex,
  align: "left",
  sorter: (a, b) => (a[dataIndex] || "").localeCompare(b[dataIndex] || ""),
  render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
});

// Nested columns configuration (memoized outside component)
const NESTED_COLUMNS = [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (
      <div style={{ padding: "8px 0" }}>{index + 1}</div>
    ),
  },
  createNestedColumn("ACCOUNT NUMBER", "accountNumber"),
  createNestedColumn("ACCOUNT NAME", "accountName"),
  createNestedColumn("ACCOUNT CATEGORY", "accountCategory"),
  createNestedColumn("SOR", "sor"),
  createNestedColumn("COST CENTER", "costCenter"),
  createNestedColumn("METER READING CODE", "meterReadingCode"),
];

// Expandable row renderer for Related Detail (uses memoized NESTED_COLUMNS)
const expandedRowRender = (record) => {
  const relatedDetailData = record?.relatedDetail || [];

  return (
    <div className="bg-blue-50 -mx-2 pl-6 py-2">
      <h4 className="text-[#0075bf] font-semibold text-sm my-2">RELATED DETAIL</h4>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={relatedDetailData}
        columns={NESTED_COLUMNS}
        className="related-detail-nested-table"
      />
    </div>
  );
};

// Column definition function (outside component)
const columns = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => {
  return [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "relationshipTypeName",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "relationshipTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "relationshipTypeName",
          hasValue(search["relationshipTypeName"]),
          searchText,
          text ? text.toUpperCase() : text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CATEGORY",
      dataIndex: "relationshipCategoryName",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "relationshipCategoryName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "relationshipCategoryName",
          hasValue(search["relationshipCategoryName"]),
          searchText,
          text ? text.toUpperCase() : text,
          false,
          "input",
          search
        ),
    },
    {
      title: "RELATED NAME",
      dataIndex: "subjectName",
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "subjectName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text, record) => {
        const displayText = record.subjectName || record.objectName || "";
        return renderColumn(
          "subjectName",
          hasValue(search["subjectName"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      title: "RELATED NUMBER",
      dataIndex: "subjectValue",
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "subjectValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text, record) => {
        const displayText = record.subjectValue || record.objectValue || "";
        return renderColumn(
          "subjectValue",
          hasValue(search["subjectValue"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      title: "START DATE",
      width: 150,
      dataIndex: "startDate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (startDate) => {
        const displayText = startDate
          ? moment(startDate).format("DD MMM YYYY")
          : "";
        return renderColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      title: "END DATE",
      width: 150,
      dataIndex: "endDate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (endDate) => {
        const displayText = endDate
          ? moment(endDate).format("DD MMM YYYY")
          : "";
        return renderColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          displayText,
          false,
          "input",
          search
        );
      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 180,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (statusApproval) => {
        const statusMap = {
          "WAITING APPROVAL": "Waiting Approval",
          "WAITING FOR APPROVAL": "Waiting Approval",
          "WAITING_APPROVAL": "Waiting Approval",
        };
        const text = formatStatusText(statusApproval, statusMap);
        return text
          ? renderColumn(
            "statusApproval",
            hasValue(search["statusApproval"]),
            searchText,
            text,
            false,
            "status",
            search
          )
          : text;
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      sorter: true,
      fixed: "right",
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
        const text = formatStatusText(status);
        return text
          ? renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          )
          : text;
      },
    },
  ];
};

const RelationshipTable = ({
  idAccount = 0,
  page = 1,
  setPage = () => { },
  pageSize = 10,
  setPageSize = () => { },
  searchedColumn = "",
  setSearchedColumn = () => { },
  searchText = "",
  setSearchText = () => { },
  sort = "",
  setSort = () => { },
  search = {},
  setSearch = () => { },
  approvalMode = false,
  handleIsApproval = () => { },
  type = "standard",
  idCustomer = null,
  inputFields = [],
  tempInputFields = [],
  listType = "all",
  isAccessGranted = true,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const { data_relationship, loading } = useSelector(
    (state) => state.relationship
  );

  const [dataTable, setDataTable] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [modalDetail, setModalDetail] = useState(false);
  const [data_detail, setDataDetail] = useState();

  // Approval mode states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalApprovalDetail, setModalApprovalDetail] = useState(false);
  const [approvalDetailData, setApprovalDetailData] = useState(null);
  const [modalHistory, setModalHistory] = useState(false);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(null);
  const [modalConfirmApprove, setModalConfirmApprove] = useState(false);
  const [modalConfirmReject, setModalConfirmReject] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState(null);

  // Inactivate modal states
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactivateRelationshipId, setInactivateRelationshipId] = useState(0);
  const [inactivateRelationshipName, setInactivateRelationshipName] = useState("");



  // Memoized fetch function (DRY + performance optimization)
  const fetchRelationshipData = useCallback(() => {
    if (idAccount) {
      dispatch(
        getRelationshipListAdvanced({
          idAccount,
          page,
          pageSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
          body: {
            inputFields: tempInputFields,
            searchs: search,
            listType: listType,
          },
        })
      );
    }
  }, [dispatch, idAccount, page, pageSize, sort, search, tempInputFields, listType]);

  // check access granted
  useEffect(() => {
    if (isAccessGranted) {
      fetchRelationshipData();
    }
  }, [fetchRelationshipData, isAccessGranted]);

  // Update table data when API response changes
  useEffect(() => {
    if (data_relationship && data_relationship.result) {
      const totalData = data_relationship.page.totalElements;
      // Add key to each row for proper row selection
      const dataWithKeys = data_relationship.result.map((item, index) => ({
        ...item,
        key: item.id || `relationship-${index}`,
      }));
      setDataTable(dataWithKeys);
      setTotalElements(totalData || 0);
    }
  }, [data_relationship]);

  // Reset selected rows when exiting approval mode
  useEffect(() => {
    if (!approvalMode) {
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  }, [approvalMode]);

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

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

  const handleDetail = (record) => {
    // Navigate to detail page instead of opening modal
    navigate(ACCOUNT_MANAGEMENT_ROUTES.DETAIL_RELATIONSHIP, {
      state: {
        idAccount,
        idRelationship: record.id,
        idCustomer,
        type,
      },
    });
  };

  /**
   * Open or close inactivate modal
   */
  const handleInactivateModal = (show, relationshipId = 0, relationshipName = "") => {
    if (show) {
      setInactivateRelationshipId(relationshipId);
      setInactivateRelationshipName(relationshipName);
      setShowInactiveModal(true);
    } else {
      setInactivateRelationshipId(0);
      setInactivateRelationshipName("");
      setShowInactiveModal(false);
    }
  };

  /**
   * Handle inactivate relationship
   */
  const handleInactivateRelationship = (remark, handleClear) => {
    dispatch(
      toggleRelationshipStatus({
        accountId: idAccount,
        relationshipId: inactivateRelationshipId,
        remarks: remark,
      })
    )
      .unwrap()
      .then(() => {
        fetchRelationshipData(); // Use memoized fetch function
        setShowInactiveModal(false);
        handleClear();
      })
      .catch(() => { });
  };

  // Approval handlers
  const handleApprovalDetail = (record) => {
    setApprovalDetailData(record);
    setModalApprovalDetail(true);
  };

  const handleApprovalHistory = (record) => {
    console.log("Opening approval history for record:", record);
    setOpenPopoverId(null); // Close popover when modal opens
    setModalHistory(true);
    setSelectedRelationshipId(record.id);
  };

  const handleApprove = () => {
    setModalConfirmApprove(true);
  };

  const handleReject = () => {
    setModalConfirmReject(true);
  };

  // Unified handler for approve/reject actions (DRY optimization)
  const handleConfirmAction = useCallback((remark, action) => {
    const body = selectedRows.map((row) => ({
      id: row.id,
      approvalId: row.approvalId || row.tappId,
      action,
      description: remark,
    }));

    dispatch(approveOrRejectRelationship({ idAccount, body, action }))
      .unwrap()
      .then(() => {
        if (action === "APPROVE") {
          setModalConfirmApprove(false);
        } else {
          setModalConfirmReject(false);
        }
        setSelectedRowKeys([]);
        setSelectedRows([]);
        // Refresh table data after action
        fetchRelationshipData();
        // Stay in approval mode
        handleIsApproval(true);
      })
      .catch(() => {
        // Error already handled in thunk
      });
  }, [dispatch, idAccount, selectedRows, handleIsApproval, fetchRelationshipData]);

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  // Action items for table
  const itemsActionView = (
    handleDetail,
    handleInactivateModal,
    handleApprovalHistory,
    handleApprovalDetail
  ) => [
      // Outside popover - Detail icon
      {
        action: "View",
        type: "table",
        render: (record, data_length) => {
          return (
            <Tooltip title="Detail">
              <SVGIcon
                name="IconDetail"
                color="#0075bf"
                width={24}
                onClick={() => handleDetail(record)}
                className="cursor-pointer"
              />
            </Tooltip>
          );
        },
      },
      {
        action: "Update",
        type: "table",
        render: (record, data_length) => {

          // editable only for :
          // 1. status DRAFT && statusApproval DRAFT
          // 2. status REJECTED && statusApproval DRAFT

          const isEditable =
            (record.status === "DRAFT" && record.statusApproval === "DRAFT") ||
            (record.status === "REJECTED" && record.statusApproval === "DRAFT") ||
            (record.status === "DRAFT" && record.statusApproval === "REJECTED") ||
            (record.status === "REJECTED" && record.statusApproval === "REJECTED");

          const render =
            data_length > 3 ? (
              <ButtonComponent
                icon={
                  <SVGIcon
                    name="IconEdit"
                    color={!isEditable ? "#8D91A0" : "#0075bf"}
                    width={24}
                  />
                }
                border={false}
                disabled={!isEditable}
              >
                <span
                  className={`${!isEditable ? "text-gray-400" : "text-black"
                    } ml-3`}
                >
                  Update
                </span>
              </ButtonComponent>
            ) : (
              <Tooltip title="Update">
                <div className="pt-1">
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    color={!isEditable ? "#8D91A0" : "#ACC424"}
                    className={!isEditable ? "cursor-not-allowed" : undefined}
                  />
                </div>
              </Tooltip>
            );

          return isEditable ? (
            <NavLink
              to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP}
              state={{ id: record.id, idAccount, idCustomer, type }}
            >
              {render}
            </NavLink>
          ) : (
            render
          );
        },
      },
      {
        action: "Inactive",
        type: "table",
        render: (record, data_length) => {
          // Enable only when status is ACTIVE and statusApproval is APPROVED
          const isApproved = record?.statusApproval === "APPROVED" || record?.statusApproval === "approved";
          const isActive = record?.status === "ACTIVE" || record?.status === "Active";
          const isEnabled = isApproved && isActive;
          const isChecked = !isActive; // Checked when inactive

          return data_length > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  checked={isChecked}
                  disabled={!isEnabled}
                />
              }
              border={false}
              disabled={!isEnabled}
              onClick={() => isEnabled && handleInactivateModal(true, record?.id, record?.subjectName || record?.objectName || "")}
            >
              <span className={`${!isEnabled ? "text-gray-400" : "text-black"} ml-5`}>
                Inactive
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Inactive">
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  disabled={!isEnabled}
                  checked={isChecked}
                  onClick={() => handleInactivateModal(true, record?.id, record?.subjectName || record?.objectName || "")}
                />
              </div>
            </Tooltip>
          );
        },
      },
      {
        action: "Approval History",
        type: "table",
        render: (record, data_length) => {
          return data_length > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconLogHistory" color="#0075bf" width={24} />}
              border={false}
              onClick={() => handleApprovalHistory(record)}
            >
              <span className="text-black ml-3">Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <SVGIcon
                name="IconLogHistory"
                color="#0075bf"
                width={24}
                onClick={() => handleApprovalHistory(record)}
                className="cursor-pointer"
              />
            </Tooltip>
          );
        },
      },
    ];

  // Approval mode action items
  const itemsApprovalMode = [
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Detail">
            <div className="cursor-pointer">
              <UnorderedListOutlined
                onClick={() => handleApprovalDetail(record)}
                style={{
                  fontSize: "20px",
                  color: "#0075bf",
                }}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Approval History",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Approval History">
            <div
              className="cursor-pointer"
              onClick={() => handleApprovalHistory(record)}
            >
              <SVGIcon name="IconLogHistory" color="#0075bf" width={24} />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  // Manual action column (without permission hook for now)
  const actionColumn = {
    title: "ACTION",
    dataIndex: "action",
    fixed: "right",
    width: 150,
    render: (text, record, index) => {
      const items = approvalMode
        ? itemsApprovalMode
        : itemsActionView(
          handleDetail,
          handleInactivateModal,
          handleApprovalHistory,
          handleApprovalDetail
        );

      const totalLength = items.length;

      if (totalLength > 3) {
        // Show popover with actions
        return (
          <div className="w-full flex justify-center items-center gap-4">
            <Popover
              trigger="click"
              placement="bottomRight"
              open={openPopoverId === record.id}
              onOpenChange={(visible) => setOpenPopoverId(visible ? record.id : null)}
              content={
                <Space direction="vertical">
                  {items
                    ?.filter((item) => item?.action !== "View")
                    ?.map((item, idx) => (
                      <div key={idx}>{item?.render(record, totalLength)}</div>
                    ))}
                </Space>
              }
            >
              <div className="pt-1">
                <MoreOutlined
                  style={{
                    fontSize: "24px",
                    color: "#0075bf",
                    cursor: "pointer",
                  }}
                />
              </div>
            </Popover>
            <div className="pt-1">
              {items
                ?.filter((item) => item?.action === "View")
                ?.map((item, idx) => (
                  <div key={idx}>{item?.render(record, totalLength)}</div>
                ))}
            </div>
          </div>
        );
      } else {
        // Show all actions inline
        return (
          <div className="w-full flex justify-center gap-4 mt-1 items-start">
            {items?.map((item, idx) => (
              <div key={idx}>{item?.render(record, totalLength)}</div>
            ))}
          </div>
        );
      }
    },
  };

  // Memoized row selection config for approval mode (performance optimization)
  const rowSelection = useMemo(() => approvalMode
    ? {
      selectedRowKeys,
      onChange: onSelectChange,
      type: "checkbox",
      preserveSelectedRowKeys: true,
      getCheckboxProps: (record) => ({
        style: {
          cursor: "pointer",
        },
      }),
    }
    : null, [approvalMode, selectedRowKeys, onSelectChange]);

  // Memoized columns array (performance optimization)
  const memoizedColumns = useMemo(() => [
    ...columns(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    actionColumn,
  ], [search, page, pageSize, searchedColumn, searchText, actionColumn]);

  return (
    <Fragment>
      <Spin spinning={loading}>
        <TablePaginationNew
          dataSource={dataTable}
          totalData={totalElements}
          current={page}
          pageSize={pageSize}
          tableScrolled={{ y: 400, x: 2000 }}
          onChange={handleChangeSize}
          onSort={onSort}
          columns={memoizedColumns}
          rowSelection={rowSelection}
          rowKey="id"
          rowClassName={(record) =>
            approvalMode && selectedRowKeys.includes(record.id)
              ? "bg-blue-50"
              : ""
          }
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record?.relatedDetail && record.relatedDetail.length > 0,
          }}
          // dragcolumn sementara bisa di semua kondisi
          enableDragColumn={true}
        />
      </Spin>

      {/* Approve/Reject Buttons - Right side, only show when approval mode and items selected */}
      {approvalMode && selectedRowKeys.length > 0 && (
        <div className="w-full flex justify-end items-center gap-3 mt-6 border-t border-gray-200 pt-6">
          <ButtonComponent type="reject" onClick={handleReject}>
            Reject
          </ButtonComponent>
          <ButtonComponent type="approve" onClick={handleApprove}>
            Approve
          </ButtonComponent>
        </div>
      )}

      {/* Modal Detail - Regular mode */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Relationship"
        width={700}
        handleCancel={() => {
          setModalDetail(false);
        }}
      >
        <RelationshipDetail
          data_detail={data_detail}
          idAccount={idAccount}
          relationshipId={data_detail?.id}
        />
      </ModalCustom>

      {/* Modal Detail - Approval mode */}
      <ModalCustom
        isOpen={modalApprovalDetail}
        type="detail"
        header="DETAIL RELATIONSHIP"
        width={1000}
        centered={false}
        handleCancel={() => {
          setModalApprovalDetail(false);
        }}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalApprovalDetail(false)}
            >
              Close
            </ButtonComponent>
          </div>
        }
      >
        <RelationshipApprovalDetail
          data={approvalDetailData}
          attachmentData={MOCK_ATTACHMENT_DATA}
        />
      </ModalCustom>

      {/* Modal Approval History */}
      <ModalApprovalHistory
        isOpen={modalHistory}
        handleCancel={() => {
          setModalHistory(false);
          setSelectedRelationshipId(null);
        }}
        idAccount={idAccount}
        relationshipId={selectedRelationshipId}
      />

      {/* Modal Confirm Approve */}
      <ModalConfirmApproval
        isOpen={modalConfirmApprove}
        handleCancel={() => setModalConfirmApprove(false)}
        handleConfirm={(remark) => handleConfirmAction(remark, "APPROVE")}
        type="approve"
        selectedData={selectedRows}
      />

      {/* Modal Confirm Reject */}
      <ModalConfirmApproval
        isOpen={modalConfirmReject}
        handleCancel={() => setModalConfirmReject(false)}
        handleConfirm={(remark) => handleConfirmAction(remark, "REJECT")}
        type="reject"
        selectedData={selectedRows}
      />

      {/* Modal Inactivate Confirmation */}
      <ModalApproveOrReject
        isOpen={showInactiveModal}
        header={"INACTIVATE"}
        handleCloseModal={() => handleInactivateModal(false)}
        customMessage={`Are you sure you want to inactivate relationship - ${inactivateRelationshipName}?`}
        onFinish={({ remark }, handleClear) => handleInactivateRelationship(remark, handleClear)}
      />
    </Fragment>
  );
};

export default RelationshipTable;
