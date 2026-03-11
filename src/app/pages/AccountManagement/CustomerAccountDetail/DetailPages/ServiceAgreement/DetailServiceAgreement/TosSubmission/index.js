import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, Spin, Tooltip } from "antd";

import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../utils/getColumnSearchProps";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { Link, NavLink } from "react-router-dom";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import NxHistoryModal from "../../../../../../../../components/Nx/NxHistoryModal";
import ModalInactivateWithHierarchy from "../../../../../../../../components/Modal/ModalInactivateWithHierarchy";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../../../components/Modal/ModalPopUp";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDraftTosSubmission,
  getListAppHierDetailInactive,
  getListAppHierInactive,
  getListTosSubmissionPaging,
  inactiveTosSubmission,
  getApprovalHistory,
} from "../../../../../../../../redux/slices/account_management/detailAccount/tosSubmissionSlice";
import moment from "moment";
import { WarningOutlined } from "@ant-design/icons";
import { getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import ToolbarAccount from "../../../../../ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../../../ComponentAccount/ColumnActionPermissionAccount";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../../../utils";
import { nxApplyFixedColumns } from "../../../../../../../../utils/Nx/nxApplyFixedColumns";

const TosSubmission = ({ idSA, idAccount, idCustomer, type, dataDetailSA }) => {
  const saMainStartDate = dataDetailSA?.saInfo?.saMainStartDate
  const saMainEndDate = dataDetailSA?.saInfo?.saMainEndDate
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalElements, setTotalElement] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [fixedColumns, setFixedColumns] = useState({
    right: ["statusApproval", "status", "action"],
    left: [],
  });
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [dataDeleteSelected, setDataDeleteSelected] = useState({});
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const { data, loading, dataApprovalHistory } = useSelector(
    (state) => state.tosSubmission
  );
  const { access_account } = useSelector((state) => state.accountManagement);
  const filteredArray = {
    actionList: access_account?.actionList?.filter(action =>
      action.path.includes("/account-management/account-standard/service-agreement/tos/")
    )
  }
  useEffect(() => {
    dispatch(getGrantedAccessAccount('/account-management/account-standard/service-agreement/tos/'))
  }, [dispatch])
  
  useEffect(() => {
    if (dataApprovalHistory?.dataApprover && dataApprovalHistory?.dataHistory) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.TOS_SUBMISSION || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_TOS_SUBMISSION || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.TOS_SUBMISSION || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_TOS_SUBMISSION || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const encodedSearch = useMemo(
    () => encodeURIComponent(JSON.stringify(search)),
    [search]
  );

  const refreshCurrentList = useCallback(
    (targetPage = 1) => {
      dispatch(
        getListTosSubmissionPaging({
          id: idSA,
          page: targetPage,
          pageSize,
          search: encodedSearch,
          sort,
        })
      );
    },
    [dispatch, encodedSearch, idSA, sort]
  );

  useEffect(() => {
    refreshCurrentList(page);
  }, [page, refreshCurrentList]);

  useEffect(() => {
    if (!data?.result) {
      return;
    }

    const incomingData = data.result || [];
    const totalData = data?.page?.totalElements || 0;
    setTotalElement(totalData);

    setDataTable((prevData) => {
      const mergedData =
        page === 1
          ? incomingData
          : [
              ...prevData,
              ...incomingData.filter(
                (item) => !prevData.some((prevItem) => prevItem.id === item.id)
              ),
            ];

      setHasMore(mergedData.length < totalData);
      return mergedData;
    });
  }, [data, page]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) {
      return Promise.resolve();
    }

    setPage((prevPage) => prevPage + 1);
    return Promise.resolve();
  }, [hasMore, loading]);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  }, []);

  const onSort = (_, __, sort) => {
    const dataOrder = sort.order === "ascend" ? "asc" : "desc";
    const dataSort = sort.order ? `${sort.field}~${dataOrder}` : "";
    setSort(dataSort);
    setPage(1);
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
  const handleDelete = (data) => {
    setDataDeleteSelected(data);
    setOpenModalDelete(true);
  };
  const handleCloseModalDelete = () => {
    setDataDeleteSelected({});
    setOpenModalDelete(false);
  };
  const handleConfirmModalDelete = () => {
    dispatch(deleteDraftTosSubmission({ id: dataDeleteSelected.id }))
      .unwrap()
      .then(() => {
        handleCloseModalDelete();
        setPage(1);
        setDataTable([]);
        refreshCurrentList(1);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message || error.message || error.toString();
          setBodyError({ type: "delete", message });
          setModalError(true);
        }
      });
  };

  const columns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "TERM OF SERVICE NAME",
      dataIndex: "tosName",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "tosName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('tosName', hasValue(search['tosName']), searchText, text, false, 'input', search)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 200,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, text, 'date', search)
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 200,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, text, 'date', search)
    },
    {
      title: "APPLIED DATE",
      dataIndex: "appliedDate",
      width: 200,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "appliedDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) => renderDateColumn('appliedDate', hasValue(search['appliedDate']), searchText, text, 'date', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "remark",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('remark', hasValue(search['remark']), searchText, text, true, 'input', search)
    },
    
    {
      title: "STATUS",
      width: 160,
      sorter: true,
      dataIndex: "status",
      key: "status",
      fixed:'right',
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
    },
    {
      title: "STATUS APPROVAL",
      width: 240,
      sorter: true,
      dataIndex: "statusApproval",
      key: "statusApproval",
      fixed: 'right',
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('statusApproval', hasValue(search['statusApproval']), searchText, text, false, 'status', search)
    },
  ], [handleSearch, search, searchText, searchedColumn]);


  const itemActions = [
    //action toolbar
    {
      action: 'Create',
      render: (
        <NavLink
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_TOS_SUBMISSION}
          state={{ idAccount, idCustomer, type, idSA, saMainStartDate, saMainEndDate }}
        >
          <ButtonComponent
            disabled={moment(dataDetailSA?.saInfo?.endDate) < moment()}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>

      )
    },

    // Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        const renderAction = data > 3 ? (
          <ButtonComponent
            icon={
              <SVGIcon
                name="IconDetail"
                color={"#0075bf"}
                width={24}
              />
            }
            border={false}
          >
            <span className={"text-black"}>Detail</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Detail">
            <div className="">
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        )
        return (
          <Link
            to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_TOS_SUBMISSION}
            state={{
              id: record?.id,
              idAccount,
              idCustomer,
              type,
              idSA,
            }}
          >
            {renderAction}
          </Link>
        )
      }
    },

    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isUpdate = record.status === "DRAFT" && record.statusApproval !== "WAITING APPROVAL";
        const renderAction = data > 3 ? (
          isUpdate ? (
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_TOS_SUBMISSION}
              state={{
                id: record?.id,
                idAccount,
                idCustomer,
                type,
                idSA,
                saMainStartDate,
                saMainEndDate
              }}
            >
              <ButtonComponent
                icon={
                  <SVGIcon
                    name="IconEdit"
                    color={"#0075bf"}
                    width={24}
                  />
                }
                border={false}
              >
                <span className={"text-black"}>Update</span>
              </ButtonComponent>
            </Link>
          ) : (
            <ButtonComponent
              icon={
                <SVGIcon name="IconEdit" color={"#8D91A0"} width={24} />
              }
              border={false}
              disabled={true}
            >
              <span className={"text-black"}>Update</span>
            </ButtonComponent>
          )
        ) : (
          <Tooltip title="Update">
            {isUpdate ? (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_TOS_SUBMISSION}
                state={{
                  id: record?.id,
                  idAccount,
                  idCustomer,
                  type,
                  idSA,
                  saMainStartDate,
                  saMainEndDate
                }}
              >
                <div>
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Link>
            ) : (
              <div className={"cursor-not-allowed"}>
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={"#C0BEC6"}
                  className={"cursor-not-allowed"}
                />
              </div>
            )}
          </Tooltip>
        )
        return renderAction;
      }
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const renderAction = data > 3 ? (
          <ButtonComponent
            icon={
              <Checkbox
                className="inactive-check"
                checked={!(record.status === "ACTIVE")}
                disabled={
                  !(
                    record.status === "ACTIVE" &&
                    record.approvalStatus !== "WAITING APPROVAL"
                  )
                }
              />
            }
            border={false}
            disabled={
              !(
                record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING APPROVAL"
              )
            }
            onClick={
              record.status === "ACTIVE" &&
                record.approvalStatus !== "WAITING APPROVAL"
                ? () => handleOpenModalInactivate(record)
                : undefined
            }
          >
            <span className={"text-black"}>
              {record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            </span>
          </ButtonComponent>
        ) : (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                onClick={
                  record.status === "ACTIVE" &&
                    record.approvalStatus !== "WAITING APPROVAL"
                    ? () => handleOpenModalInactivate(record)
                    : undefined
                }
                checked={record?.status === "INACTIVE"}
                disabled={
                  !(
                    record.status === "ACTIVE" &&
                    record.approvalStatus !== "WAITING APPROVAL"
                  )
                }
              />
            </div>
          </Tooltip>
        )
        return renderAction;
      }
    },

    {
      action: "Delete",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Delete">
            <span
              className={`flex justify-center${(record.status === "DRAFT" && record.statusApproval) !== "WAITING APPROVAL"
                  ? " cursor-pointer"
                  : " cursor-not-allowed"
                }`}
            >
              <SVGIcon
                name="IconDelete"
                color={
                  record.status === "DRAFT" &&
                    record.statusApproval !== "WAITING APPROVAL"
                    ? "#D90000"
                    : "#8D91A0"
                }
                className={`flex justify-center${(record.status === "DRAFT" && record.statusApproval) !== "WAITING APPROVAL"
                    ? " cursor-pointer"
                    : " cursor-not-allowed"
                  }`}
                width={24}
                onClick={
                  record.status === "DRAFT" &&
                    record.statusApproval !== "WAITING APPROVAL"
                    ? () => handleDelete(record)
                    : undefined
                }
              />
            </span>
          </Tooltip>
        )
      }
    },

    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const renderAction = data > 3 ? (
          <ButtonComponent
            icon={
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
              />
            }
            border={false}
            onClick={() => handleApprovalHistory(record)}
          >
            <span className={"text-black"}>Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Approval History">
            <span>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name="IconLogHistory"
                    color={"#0075bf"}
                    width={24}
                  />
                }
                border={false}
                onClick={() => handleApprovalHistory(record)}
              >
              </ButtonComponent>
            </span>
          </Tooltip>
        )
        return renderAction;
      }
    }
  ]

  const actionColumns = useColumnActionPermissionAccount(
    ["Delete", "Activate", "View", "Update", "History"],
    itemActions,
    filteredArray,
    "Delete"
  );

  const allColumns = useMemo(() => {
    const mergedColumns = [...columns, ...actionColumns].map((column) => ({
      ...column,
      key: column.key || column.dataIndex || column.title,
    }));

    return nxApplyFixedColumns(mergedColumns, fixedColumns);
  }, [actionColumns, columns, fixedColumns]);

  const columnDefinitions = useMemo(
    () =>
      allColumns.map((column) => ({
        key: column.key,
        title: column.title,
      })),
    [allColumns]
  );

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      key: item,
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
      label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };
  const handleSubmitModalInactivate = (res, handleClear) => {
    const data = {
      tosSubmissionId: dataInactivate.id,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveTosSubmission({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        setPage(1);
        setDataTable([]);
        refreshCurrentList(1);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message || error.message || error.toString();
          setBodyError({
            body: { ...res },
            type: "inactive",
            handleClear,
            message,
          });
          setModalError(true);
        }
      });
  };
  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    if (bodyError.type === "inactive") {
      handleSubmitModalInactivate(bodyError.body, bodyError.handleClear);
    }
    if (bodyError.type === "delete") {
      handleConfirmModalDelete();
    }
    setModalError(false);
    setBodyError({});
  };
  return (
    <div>
      <Spin spinning={loading}>
        <NxCardContainer
          type="profile"
          hideChildren
          element={(
            <div className="flex flex-col w-full gap-4">
              <div className="flex w-full justify-end">
                <ToolbarAccount items={itemActions} advancedAccess={filteredArray} />
              </div>
              <NxTable
                idTable="tos-submission-table"
                dataSource={dataTable}
                totalData={totalElements}
                current={page}
                loading={loading}
                tableScrolled={{ y: 300, x: "max-content" }}
                onSort={onSort}
                columns={allColumns}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                usePagination={false}
                useInfiniteScroll={true}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                loadMoreThreshold={2}
              />
            </div>
          )}
        />
        <NxHistoryModal
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getListAppHierInactive}
          getAPIDetail={getListAppHierDetailInactive}
          selector="tosSubmission"
          alertMessage={`Are you sure you want to inactivate TOS Submission ${dataInactivate?.termOfServiceName || ""
            }?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />
        {/* Modal Delete */}
        <ModalConfirm
          isOpen={openModalDelete}
          handleCancel={handleCloseModalDelete}
          handleOk={handleConfirmModalDelete}
          width={400}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              Are you sure want to delete draft ?
            </p>
          </div>
          {/* <Alert
            message="Warning! your data will deleted permanently"
            type={"error"}
          /> */}
        </ModalConfirm>

        {/** Modal Error */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${bodyError.type === "inactive" ? "inactivate" : "deleted"
              }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </div>
  );
};

export default TosSubmission;
