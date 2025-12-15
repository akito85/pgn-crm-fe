// React imports
import { Fragment, useRef, useState, useEffect } from "react";

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
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";

// Utility imports
import { hasValue, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

// Component imports
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";

// Local imports
import RelationshipDetail from "./RelationshipDetail";
import RelationshipApprovalDetail from "./RelationshipApprovalDetail";
import ModalApprovalHistory from "./ModalApprovalHistory";
import ModalConfirmApproval from "./ModalConfirmApproval";

// Route imports
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";

// Library imports
import moment from "moment";

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
        let text;
        switch (statusApproval) {
          case "WAITING APPROVAL":
          case "WAITING_FOR_APPROVAL":
          case "WAITING_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = statusApproval
              ? statusApproval.charAt(0).toUpperCase() +
              statusApproval.slice(1).toLowerCase()
              : statusApproval;
            break;
        }
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
        let text;
        switch (status) {
          case "ACTIVE":
            text = "Active";
            break;
          case "INACTIVE":
            text = "Inactive";
            break;
          case "DRAFT":
            text = "Draft";
            break;
          default:
            text = status
              ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
              : status;
            break;
        }
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
  type = "standard",
  idCustomer = null,
  inputFields = [],
  tempInputFields = [],
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

  // Mock attachment data for approval detail
  const mockAttachmentData = [
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

  // Fetch relationship data from API
  useEffect(() => {
    if (idAccount) {
      dispatch(
        getRelationshipListAdvanced({
          idAccount,
          page,
          pageSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
          body: { inputFields: tempInputFields },
        })
      );
    }
  }, [dispatch, idAccount, page, pageSize, sort, search, tempInputFields]);

  // Update table data when API response changes
  useEffect(() => {
    if (data_relationship && data_relationship.result) {
      const totalData = data_relationship.page.totalElements;
      setDataTable(data_relationship.result);
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

  const handleActiveOrInactive = (record) => {
    console.log("Toggle activation for:", record.id);

    // Call API to toggle relationship status
    dispatch(
      toggleRelationshipStatus({
        relationshipId: record.id,
        remarks: "test", // Hardcoded as requested
      })
    ).then((result) => {
      // Only refresh the list if the API call was successful
      if (result.type === "TOGGLE_RELATIONSHIP_STATUS/fulfilled") {
        dispatch(
          getRelationshipListAdvanced({
            idAccount,
            page,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
            body: { inputFields: tempInputFields },
          })
        );
      }
    });
  };

  // Approval handlers
  const handleApprovalDetail = (record) => {
    setApprovalDetailData(record);
    setModalApprovalDetail(true);
  };

  const handleApprovalHistory = (record) => {
    console.log("Opening approval history for record:", record);
    setModalHistory(true);
    setSelectedRelationshipId(record.id);
  };

  const handleApprove = () => {
    setModalConfirmApprove(true);
  };

  const handleReject = () => {
    setModalConfirmReject(true);
  };

  const handleConfirmApprove = (remark) => {
    console.log("Approving:", selectedRows, "with remark:", remark);
    // Call API here
    setModalConfirmApprove(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const handleConfirmReject = (remark) => {
    console.log("Rejecting:", selectedRows, "with remark:", remark);
    // Call API here
    setModalConfirmReject(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

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
    handleActiveOrInactive,
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
          // Show Update only for status Active or Draft
          const isEditable = ["Active", "Draft", "ACTIVE", "DRAFT"].includes(
            record?.status
          );

          const render =
            data_length > 3 ? (
              <ButtonComponent
                icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
                border={false}
                disabled={!isEditable}
              >
                {data_length > 3 && (
                  <span className="text-black ml-3">Update</span>
                )}
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
        action: "Active",
        type: "table",
        render: (record, data_length) => {
          const isActive = record?.status === "Active" || record?.status === "ACTIVE";

          return data_length > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  checked={isActive}
                  disabled={false}
                />
              }
              border={false}
              onClick={() => handleActiveOrInactive(record)}
            >
              <span className="text-black ml-5">
                {isActive ? "Active" : "Inactive"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title={isActive ? "Active" : "Inactive"}>
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleActiveOrInactive(record)}
                  checked={isActive}
                  disabled={false}
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
              <div className="pt-1">
                <SVGIcon
                  name="IconLogHistory"
                  color="#0075bf"
                  width={24}
                  onClick={() => handleApprovalHistory(record)}
                  className="cursor-pointer"
                />
              </div>
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
              className="cursor-pointer pt-1"
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
          handleActiveOrInactive,
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

  // Row selection config for approval mode
  const rowSelection = approvalMode
    ? {
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (record) => ({
        style: {
          cursor: "pointer",
        },
      }),
    }
    : null;

  return (
    <Fragment>
      <Spin spinning={loading}>
        <TablePaginationNew
          dataSource={dataTable}
          totalData={totalElements}
          current={page}
          pageSize={pageSize}
          tableScrolled={{ y: 525, x: 1800 }}
          onChange={handleChangeSize}
          onSort={onSort}
          columns={[
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
          ]}
          rowSelection={rowSelection}
          rowKey="id"
          rowClassName={(record) =>
            approvalMode && selectedRowKeys.includes(record.id)
              ? "bg-blue-50"
              : ""
          }
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
          attachmentData={mockAttachmentData}
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
        handleConfirm={handleConfirmApprove}
        type="approve"
        selectedData={selectedRows}
      />

      {/* Modal Confirm Reject */}
      <ModalConfirmApproval
        isOpen={modalConfirmReject}
        handleCancel={() => setModalConfirmReject(false)}
        handleConfirm={handleConfirmReject}
        type="reject"
        selectedData={selectedRows}
      />
    </Fragment>
  );
};

export default RelationshipTable;
