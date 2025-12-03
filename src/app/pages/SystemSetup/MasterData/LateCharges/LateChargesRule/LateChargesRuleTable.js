import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../utils/Icon";
import {
  getApprovalHistory,
  getLateChargeRulePaginate,
  getListAppHier,
  getListAppHierDetail,
  inactiveLateChargeRule,
  deleteLateChargeRule,
} from "../../../../../../redux/slices/account_management/MasterData/late_charges";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { Checkbox, Tooltip } from "antd";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../../assets/Icon/index";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import moment from "moment";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { dateFormatting } from "../../../../../../utils";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import ToolbarAccount from "../../../../AccountManagement/ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../../AccountManagement/ComponentAccount/ColumnActionPermissionAccount";

const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleApprovalHistory = () => {},
  handleOpenModalInactivate = () => {},
  lateChargeId,
  openModalDeleteRule = () => {},
  isUpdate,
  isInactive,
  isDelete,
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    // {
    //   title: "CURRENCY",
    //   width: 240,
    //   sorter: true,
    //   align: "left",
    //   dataIndex: "currency",
    //   ...getColumnSearchPropsPaging(
    //     "currency",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    // },
    {
      title: "DOCUMENT NUMBER",
      width: 240,
      sorter: true,
      align: "left",
      dataIndex: "documentNumber",
      ...getColumnSearchPropsPaging(
        "documentNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "LATE CHARGE MAX AMOUNT",
      width: 240,
      sorter: true,
      align: "right",
      dataIndex: "maxAmount",
      ...getColumnSearchPropsPaging(
        "maxAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "START DATE",
      width: 200,
      sorter: true,
      align: "center",
      dataIndex: "startDate",
      ...getColumnSearchPropsPaging(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) => {
        const tempValue = text ? moment(text).format(dateFormatting.date) : "";
        if (searchedColumn === "startDate") {
          const highlight = (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={tempValue || ""}
            />
          );
          if (tempValue) {
            return highlight;
          }
          return highlight;
        } else {
          if (tempValue) {
            return tempValue;
          }
          return "";
        }
      },
    },
    {
      title: "END DATE",
      width: 200,
      sorter: true,
      align: "center",
      dataIndex: "endDate",
      ...getColumnSearchPropsPaging(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) => {
        const tempValue = text ? moment(text).format(dateFormatting.date) : "";
        if (searchedColumn === "endDate") {
          const highlight = (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={tempValue || ""}
            />
          );
          if (tempValue) {
            return highlight;
          }
          return highlight;
        } else {
          if (tempValue) {
            return tempValue;
          }
          return "";
        }
      },
    },
    {
      title: "DESCRIPTION",
      width: 160,
      sorter: true,
      dataIndex: "productDescription",
      ...getColumnSearchPropsPaging(
        "productDescription",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "productDescription") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "STATUS",
      width: 140,
      sorter: true,
      dataIndex: "status",
      key: "status",
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      title: "STATUS APPROVAL",
      width: 200,
      sorter: true,
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "approvalStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING_APPROVAL":
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    // {
    //   title: "ACTION",
    //   align: "center",
    //   width: 120,
    //   fixed: "right",
    //   render: (v, r, i) => {
    //     return (
    //       <div className="flex justify-center align-middle gap-2">
    //         <Popover
    //           content={
    //             <div>
    //               <Link
    //                 to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_LATE_CHARGES_RULE}
    //                 state={{ id: r?.id, lateChargeId }}
    //               >
    //                 <ButtonComponent
    //                   icon={
    //                     <SVGIcon
    //                       name="IconDetail"
    //                       color={"#0075bf"}
    //                       width={24}
    //                     />
    //                   }
    //                   border={false}
    //                 >
    //                   <span className={"text-black"}>Detail</span>
    //                 </ButtonComponent>
    //               </Link>
    //               {
    //                 r.approvalStatus !== "WAITING_APPROVAL" && r.status !== "INACTIVE"
    //                 ? (!isUpdate ?
    //                   <Link
    //                     to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_LATE_CHARGES_RULE}
    //                     state={{
    //                       id: r?.id,
    //                       lateChargeId,
    //                     }}
    //                   >
    //                     <ButtonComponent
    //                       icon={
    //                         <SVGIcon
    //                           name="IconEdit"
    //                           color={"#0075bf"}
    //                           width={24}
    //                         />
    //                       }
    //                       border={false}
    //                     >
    //                       <span className={"text-black"}>Update</span>
    //                     </ButtonComponent>
    //                   </Link>
    //                  : (
    //                   <ButtonComponent
    //                     icon={
    //                       <SVGIcon name="IconEdit" color={"#8D91A0"} width={24} />
    //                     }
    //                     border={false}
    //                     disabled={true}
    //                   >
    //                     <span className={"text-black"}>Update</span>
    //                   </ButtonComponent>
    //                   )
    //                  ) : (
    //                   <ButtonComponent
    //                     icon={
    //                       <SVGIcon name="IconEdit" color={"#8D91A0"} width={24} />
    //                     }
    //                     border={false}
    //                     disabled={true}
    //                   >
    //                     <span className={"text-black"}>Update</span>
    //                   </ButtonComponent>
    //               )}

    //               {r.status === "ACTIVE" &&
    //                 <ButtonComponent
    //                   icon={
    //                     <Checkbox
    //                       className="inactive-check"
    //                       checked={!(r.status === "ACTIVE")}
    //                       disabled={
    //                         !(
    //                           r.status === "ACTIVE" &&
    //                           r.approvalStatus !== "WAITING_APPROVAL"
    //                         )
    //                       }
    //                     />
    //                   }
    //                   border={false}
    //                   disabled={
    //                     !(
    //                       r.status === "ACTIVE" &&
    //                       r.approvalStatus !== "WAITING_APPROVAL"
    //                     )
    //                   }
    //                   onClick={
    //                     r.status === "ACTIVE" &&
    //                     r.approvalStatus !== "WAITING_APPROVAL"
    //                       ? () => handleOpenModalInactivate(r)
    //                       : undefined
    //                   }
    //                 >
    //                   <span className={"text-black"}>
    //                     {r.status === "ACTIVE" ? "Inactivate" : "Activate"}
    //                   </span>
    //                 </ButtonComponent>
    //               }

    //               <ButtonComponent
    //                 icon={
    //                   <SVGIcon
    //                     name="IconLogHistory"
    //                     color={"#0075bf"}
    //                     width={24}
    //                   />
    //                 }
    //                 border={false}
    //                 onClick={() => handleApprovalHistory(r)}
    //               >
    //                 <span className={"text-black"}>Approval History</span>
    //               </ButtonComponent>
    //             </div>
    //           }
    //           trigger={"click"}
    //           placement="bottomRight"
    //         >
    //           <ButtonComponent icon={<MoreOutlined />} border={false} />
    //         </Popover>
    //         <Tooltip title="Delete">
    //           <span
    //             className={`flex justify-center ${(r.approvalStatus === "DRAFT" && r.status === "DRAFT") ? (!isDelete ? "" : "cursor-not-allowed") : "cursor-not-allowed"}`}
    //           >
    //             <SVGIcon
    //               name="IconDelete"
    //               className={
    //                 (r.approvalStatus === "DRAFT" && r.status === "DRAFT")
    //                 ? "" : " disabled"}
    //               width={24}
    //               onClick={
    //                 (r.approvalStatus === "DRAFT" && r.status === "DRAFT")
    //                 ? () => openModalDeleteRule(r?.id)
    //                 : undefined
    //               }
    //             />
    //           </span>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    //   key: "action",
    // },
  ];
};

const LateChargesRuleTable = ({ id, isRuleActive, access }) => {
  const { data_late_charge_rule, dataApprovalHistory = {} } = useSelector(
    (state) => state.late_charge,
  );
  const { user } = useSelector((state) => state.auth);
  // Access Action Menu
  const dataArr = user?.data?.actionList;
  const isUpdate = dataArr?.some((element) => element.name == "Update");
  const isInactive = dataArr?.some((element) => element.name == "Inactivate");
  const isCreate = dataArr?.some((element) => element.name == "Create");
  const isDelete = dataArr?.some(
    (element) => element.name == "Hapus" || element.name == "Delete",
  );

  const dispatch = useDispatch();
  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [modalDeleteRule, setModalDeleteRule] = useState(false);
  const [idDeleteRule, setIdDeleteRule] = useState("");

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.LATE_CHARGE_RULE || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_LATE_CHARGE_RULE || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.LATE_CHARGE_RULE || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_LATE_CHARGE_RULE || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getLateChargeRulePaginate({
        id,
        search: tempSearch,
        sort,
        page,
        pageSize,
      }),
    );
  }, [dispatch, id, page, pageSize, search, sort]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    // handleOk();
    setModalError(false);
    setBodyError({});
  };

  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistory(data.id));
    setOpenModalHistory(true);
  };

  const handleOpenModalInactivate = (data) => {
    setDataInactivate(data);
    setOpenModalInactivate(true);
  };

  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setOpenModalInactivate(false);
  };
  const handleSubmitModalInactivate = (res, handleClear) => {
    const data = {
      lateChargeRuleId: dataInactivate.id,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
      endDate: moment(res.endDate).format(dateFormatting.f_date),
    };
    dispatch(inactiveLateChargeRule({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(
          getLateChargeRulePaginate({
            id,
            page,
            pageSize,
            sort,
            search: tempSearch,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleDisableActive = () => {
    const errorBody = {
      title: "Failed",
      description: `Only 1 data Late Charge Rule Active`,
    };
    dispatch(showModalError(errorBody));
  };

  const openModalDeleteRule = (id) => {
    setModalDeleteRule(true);
    setIdDeleteRule(id);
  };
  const handleDeleteRule = () => {
    dispatch(deleteLateChargeRule(idDeleteRule))
      .unwrap()
      .then(async (data) => {
        if (data?.code === 200) {
          setModalDeleteRule(false);
          setIdDeleteRule("");
          let tempSearch = "";
          for (const dataIndex in search) {
            if (Object.hasOwnProperty.call(search, dataIndex)) {
              const tempSearchText = search[dataIndex];
              if (tempSearchText) {
                tempSearch += `${dataIndex}~${tempSearchText},`;
              }
            }
          }
          tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
          dispatch(
            getLateChargeRulePaginate({
              id,
              search: tempSearch,
              sort,
              page,
              pageSize,
            }),
          );
        }
      })
      .catch((error) => {});
  };
  const itemActions = [
    //action toolbar
    {
      action: "Create",
      render: (
        <NavLink
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_LATE_CHARGES_RULE}
          state={{
            lateChargeId: id,
            from: "create",
          }}
        >
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        const renderAction =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconDetail" color={"#0075bf"} width={24} />}
              border={false}
            >
              <span className={"text-black ml-2"}>Detail</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          );
        return (
          <Link
            to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_LATE_CHARGES_RULE}
            state={{ id: record?.id, lateChargeId: id }}
          >
            {renderAction}
          </Link>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isUpdate =
          record.approvalStatus !== "WAITING_APPROVAL" &&
          record.status !== "INACTIVE";
        const renderAction =
          data > 3 ? (
            isUpdate ? (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_LATE_CHARGES_RULE}
                state={{
                  id: record?.id,
                  lateChargeId: id,
                }}
              >
                <ButtonComponent
                  icon={
                    <SVGIcon name="IconEdit" color={"#0075bf"} width={24} />
                  }
                  border={false}
                >
                  <span className={"text-black ml-2"}>Update</span>
                </ButtonComponent>
              </Link>
            ) : (
              <ButtonComponent
                icon={<SVGIcon name="IconEdit" color={"#8D91A0"} width={24} />}
                border={false}
                disabled={true}
              >
                <span className={"text-black ml-2"}>Update</span>
              </ButtonComponent>
            )
          ) : (
            <Tooltip title="Update">
              {isUpdate ? (
                <Link
                  to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_LATE_CHARGES_RULE}
                  state={{
                    id: record?.id,
                    lateChargeId: id,
                  }}
                >
                  <div className="pt-1">
                    <SVGIcon name="IconEdit" width={24} />
                  </div>
                </Link>
              ) : (
                <div className={"cursor-not-allowed pt-1"}>
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    color={"#C0BEC6"}
                    className={"cursor-not-allowed"}
                  />
                </div>
              )}
            </Tooltip>
          );
        return renderAction;
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActivate = record.status === "ACTIVE";
        const renderAction =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  checked={!(record.status === "ACTIVE")}
                  disabled={
                    !(
                      record.status === "ACTIVE" &&
                      record.approvalStatus !== "WAITING_APPROVAL"
                    )
                  }
                />
              }
              border={false}
              disabled={
                !(
                  record.status === "ACTIVE" &&
                  record.approvalStatus !== "WAITING_APPROVAL"
                )
              }
              onClick={
                record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING_APPROVAL"
                  ? () => handleOpenModalInactivate(record)
                  : undefined
              }
            >
              <span className={"text-black ml-3"}>
                {record.status === "ACTIVE" ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              <div className="pt-1">
                <Checkbox
                  onClick={
                    record.status === "ACTIVE" &&
                    record.approvalStatus !== "WAITING_APPROVAL"
                      ? () => handleOpenModalInactivate(record)
                      : undefined
                  }
                  checked={record?.status === "INACTIVE"}
                  disabled={
                    !(
                      record.status === "ACTIVE" &&
                      record.approvalStatus !== "WAITING_APPROVAL"
                    )
                  }
                />
              </div>
            </Tooltip>
          );
        return renderAction;
      },
    },
    {
      action: "Delete",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Delete">
            <div
              className={`pt-1 ${record.approvalStatus === "DRAFT" && record.status === "DRAFT" ? (!isDelete ? "" : "cursor-not-allowed") : "cursor-not-allowed"}`}
            >
              <SVGIcon
                name="IconDelete"
                className={
                  record.approvalStatus === "DRAFT" && record.status === "DRAFT"
                    ? ""
                    : "disabled cursor-not-allowed"
                }
                width={24}
                color={
                  record.approvalStatus === "DRAFT" && record.status === "DRAFT"
                    ? "#FF2E2E"
                    : "#8d91a0"
                }
                onClick={
                  record.approvalStatus === "DRAFT" && record.status === "DRAFT"
                    ? () => openModalDeleteRule(record?.id)
                    : undefined
                }
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const renderAction =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record)}
            >
              <span className={"text-black ml-2"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div className="pt-1">
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => handleApprovalHistory(record)}
                />
              </div>
            </Tooltip>
          );
        return renderAction;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-end">
        <ToolbarAccount items={itemActions} advancedAccess={access} />
      </div>

      <div className="w-full">
        <TablePaginationNew
          dataSource={data_late_charge_rule?.result || []}
          columns={[
            ...columns(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              handleApprovalHistory,
              handleOpenModalInactivate,
              id,
              openModalDeleteRule,
            ),
            ...useColumnActionPermissionAccount(
              ["Delete", "Activate", "View", "Update", "History"],
              itemActions,
              access,
              "Delete",
            ),
          ]}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSort={onSort}
          totalData={data_late_charge_rule?.page?.totalElements || 0}
          tableScrolled={{
            x: 1800,
            y: 300,
          }}
        />
      </div>
      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
      {openModalInactivate ? (
        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getListAppHier}
          getAPIDetail={getListAppHierDetail}
          selector="late_charge"
          alertMessage={`Are you sure you want to inactivate Late Charge Rule with named ${dataInactivate.documentNumber}?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
          addEndDate={true}
          dataStartDate={dataInactivate.startDate || null}
        />
      ) : null}
      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal.icon_error_default}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${bodyError.status}. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>

      {/* Modal Delete Late Charge Rule */}
      <ModalConfirm
        isOpen={modalDeleteRule}
        handleCancel={() => setModalDeleteRule(false)}
        handleOk={handleDeleteRule}
        header={"Delete Late Charge Rule"}
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className={"w-full flex flex-row items-center px-10"}>
            <WarningOutlined style={{ color: "red" }} className={"text-4xl"} />
            <span className={"text-lg text-black font-bold h-auto mx-auto"}>
              {`Are you sure want to delete late charge rule?`}
            </span>
          </div>
          {/* <div className={"w-full justify-center my-4 flex text-sm"}>
              <Alert
                message={
                  <span className="text-sm">
                    Warning! If you delete this data, your data will be deleted permanently.
                  </span>
                }
                type="error"
                icon={<WarningOutlined />}
              />
            </div> */}
        </div>
      </ModalConfirm>
    </div>
  );
};

export default LateChargesRuleTable;
