import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Tooltip } from "antd";
import IconViewList from "../../../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../../../assets/Icon/Nx/IconEdit";
import IconDeleteMenu from "../../../../../../assets/Icon/Nx/IconDeleteMenu";
import IconActive from "../../../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../../../assets/icons/nx/IconInactive";
import Highlighter from "react-highlight-words";
import moment from "moment";

import { IconModal } from "../../../../../../utils/Icon";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../components/Modal/ModalPopUp";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import { dateFormatting } from "../../../../../../utils";
import {
  getApprovalHistory,
  getTaxImplicationRulePaginate,
  getListAppHier,
  getListAppHierDetail,
  inactiveTaxImplicationRule,
  deleteTaxImplicationRule,
} from "../../../../../../redux/slices/account_management/MasterData/tax_implication";
import { useColumnActionPermissionAccount } from "../../../../AccountManagement/ComponentAccount/ColumnActionPermissionAccount";

const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
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
        handleSearch
      ),
    },
    {
      title: "IMPLICATION TYPE",
      width: 240,
      sorter: true,
      align: "left",
      dataIndex: "implicationType",
      ...getColumnSearchPropsPaging(
        "implicationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "VAT INVOICE ISSUANCE",
      width: 240,
      sorter: true,
      align: "right",
      dataIndex: "isVatInv",
      ...getColumnSearchPropsPaging(
        "isVatInv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "GUNGGUNG",
      width: 240,
      sorter: true,
      align: "right",
      dataIndex: "isGunggung",
      ...getColumnSearchPropsPaging(
        "isGunggung",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "TRANSACTION CODE",
      width: 240,
      sorter: true,
      align: "right",
      dataIndex: "transCodeName",
      ...getColumnSearchPropsPaging(
        "transCodeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
        "date"
      ),
      render: (text) =>
        searchedColumn === "startDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
            ]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text || ""
        ),
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
        "date"
      ),
      render: (text) =>
        searchedColumn === "endDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
            ]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text || ""
        ),
    },
    {
      title: "DESCRIPTION",
      width: 160,
      sorter: true,
      dataIndex: "description",
      ...getColumnSearchPropsPaging(
        "desc",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "isGunggung") {
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
        true
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
        true
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
    //                 to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_TAX_IMPLICATION_RULE}
    //                 state={{ id: r?.id, taxImplicationId: id }}
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
    //               {r.approvalStatus !== "WAITING_APPROVAL" &&
    //               r.status !== "INACTIVE" ? (
    //                 <Link
    //                   to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_TAX_IMPLICATION_RULE}
    //                   state={{
    //                     id: r?.id,
    //                     taxImplicationId: id
    //                   }}
    //                 >
    //                   <ButtonComponent
    //                     icon={
    //                       <SVGIcon
    //                         name="IconEdit"
    //                         color={"#0075bf"}
    //                         width={24}
    //                       />
    //                     }
    //                     border={false}
    //                   >
    //                     <span className={"text-black"}>Update</span>
    //                   </ButtonComponent>
    //                 </Link>
    //               ) : (
    //                 <ButtonComponent
    //                   icon={
    //                     <SVGIcon name="IconEdit" color={"#8D91A0"} width={24} />
    //                   }
    //                   border={false}
    //                   disabled={true}
    //                 >
    //                   <span className={"text-black"}>Update</span>
    //                 </ButtonComponent>
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
    //             className={`flex justify-center
    //               ${r.approvalStatus !== "DRAFT" && r.status !== "DRAFT" ?
    //               "cursor-not-allowed" :
    //               ""
    //             }`}
    //           >
    //             <SVGIcon
    //               name="IconDelete"
    //               className={
    //                 r.approvalStatus !== "DRAFT" && r.status !== "DRAFT" ? " disabled" : ""
    //               }
    //               width={24}
    //               onClick={
    //                 r.approvalStatus === "DRAFT" && r.status === "DRAFT"
    //                 ? ()=>openModalDeleteRule(r?.id)
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

const TaxImplicationRuleTable = ({ id, isRuleActive, access }) => {
  const dispatch = useDispatch();
  const { data_tax_implication_rule, dataApprovalHistory = {} } = useSelector(
    (state) => state.tax_implication
  );

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
          create: dataApprovalHistory?.dataApprover?.TAX_IMPLICATION_RULE || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_TAX_IMPLICATION_RULE ||
            [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.TAX_IMPLICATION_RULE || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_TAX_IMPLICATION_RULE ||
            [],
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
      getTaxImplicationRulePaginate({
        id,
        search: tempSearch,
        sort,
        page,
        pageSize,
      })
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
      taxImplicationRuleId: dataInactivate.id,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
      endDate: moment(res.endDate).format(dateFormatting.f_date),
    };
    dispatch(inactiveTaxImplicationRule({ data }))
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
          getTaxImplicationRulePaginate({
            id,
            page,
            pageSize,
            sort,
            search: tempSearch,
          })
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
      description: `Only 1 data Tax Implication Rule Active`,
    };
    dispatch(showModalError(errorBody));
  };

  const openModalDeleteRule = (id) => {
    setModalDeleteRule(true);
    setIdDeleteRule(id);
  };
  const handleDeleteRule = () => {
    dispatch(deleteTaxImplicationRule(idDeleteRule))
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
            getTaxImplicationRulePaginate({
              id,
              search: tempSearch,
              sort,
              page,
              pageSize,
            })
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
              <IconViewList width={20} />
            </Tooltip>
          );
        return (
          <Link
            to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_TAX_IMPLICATION_RULE}
            state={{ id: record?.id, lateChargeId: id }}
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
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
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_TAX_IMPLICATION_RULE}
                state={{
                  id: record?.id,
                  taxImplicationId: id,
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
                  to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_TAX_IMPLICATION_RULE}
                  state={{
                    id: record?.id,
                    taxImplicationId: id,
                  }}
                  className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
                >
                  <IconEditNx width={20} />
                </Link>
              ) : (
                <div className={"inline-flex items-center cursor-not-allowed text-gray-300"}>
                  <span className="pointer-events-none">
                    <IconEditNx width={20} />
                  </span>
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
              {record.status === "ACTIVE" && record.approvalStatus !== "WAITING_APPROVAL"
                ? <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={() => handleOpenModalInactivate(record)}>
                    <IconInactive width={20} />
                  </span>
                : record.status === "INACTIVE"
                  ? <span className="inline-flex items-center text-green-600 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={() => handleOpenModalInactivate(record)}>
                      <IconActive width={20} />
                    </span>
                  : <span className="inline-flex items-center text-gray-300 cursor-not-allowed">
                      <IconInactive width={20} />
                    </span>
              }
            </Tooltip>
          );
        return renderAction;
      },
    },
    {
      action: "Delete",
      type: "table",
      render: (record, data) => {
        const canDelete = record.approvalStatus === "DRAFT" && record.status === "DRAFT";
        return (
          <Tooltip title="Delete">
            {canDelete
              ? <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={() => openModalDeleteRule(record?.id)}>
                  <IconDeleteMenu width={20} />
                </span>
              : <span className="inline-flex items-center text-gray-300 cursor-not-allowed">
                  <IconDeleteMenu width={20} />
                </span>
            }
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
      {!isRuleActive ? (
        <div className="flex w-full justify-end">
          <NavLink
            to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_TAX_IMPLICATION_RULE}
            state={{
              taxImplicationId: id,
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
        </div>
      ) : (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
            onClick={handleDisableActive}
          >
            Create
          </ButtonComponent>
        </div>
      )}

      <div className="w-full">
        <TablePaginationNew
          dataSource={data_tax_implication_rule?.result || []}
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
              openModalDeleteRule
            ),
            ...useColumnActionPermissionAccount(
              ["Delete", "Activate", "View", "Update", "History"],
              itemActions,
              access,
              "Delete"
            ),
          ]}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSort={onSort}
          totalData={data_tax_implication_rule?.page?.totalElements || 0}
          tableScrolled={{
            x: 1500,
            y: 300,
          }}
        />
      </div>

      {/* Modal History*/}
      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      {/* Modal Inactivate Hierarchy */}
      {openModalInactivate ? (
        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getListAppHier}
          getAPIDetail={getListAppHierDetail}
          selector="tax_implication"
          alertMessage={`Are you sure you want to inactivate Tax Implication Rule with named ${dataInactivate.documentNumber}?`}
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

      {/* Modal Delete Tax Implication Rule */}
      <ModalConfirm
        isOpen={modalDeleteRule}
        handleCancel={() => setModalDeleteRule(false)}
        handleOk={handleDeleteRule}
        header={"Delete tax implication Rule"}
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className={"w-full flex flex-row items-center px-10"}>
            <WarningOutlined style={{ color: "red" }} className={"text-4xl"} />
            <span className={"text-lg text-black font-bold h-auto mx-auto"}>
              {`Are you sure want to delete tax implication rule?`}
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

export default TaxImplicationRuleTable;
