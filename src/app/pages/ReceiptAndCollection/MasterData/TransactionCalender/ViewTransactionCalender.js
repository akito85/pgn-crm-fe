import {
  Checkbox,
  Form,
  Spin,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainer from "../../../../../components/CardContainer";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import TableRBI from "../../../../../components/TableRBI";
import {
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import {
  renderColumn,
  renderDateColumn,
} from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import ModalHistory from "../../../../../components/Modal/ModalHistory";

import {
  getAllApprovalList,
  getApprovalHistory,
  getDownloadTrans,
  getListApprovalById,
  getPaginateCycle,
  inactiveTransaction,
} from "../../../../../redux/slices/receipt_collection/transactionCalender";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../components/Toolbar";

const ViewTransactionCalender = () => {
  // Selector
  const {
    data_approval,
    loading,
    dataListAppHierId,
    dataListAppHierDetail,
    data,
    dataApprovalHistory,
  } = useSelector((state) => state.cycle);
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  // const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [modalActiveInactive, setModalActiveInactive] = useState(false);
  const [status, setStatus] = useState("");
  const [modalInactive, setModalInactive] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [body, setBody] = useState({});

  //useeffcet paginng
  const handleFetch = useCallback(() => {
    dispatch(
      getPaginateCycle({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSACTION_CALENDER,
      breadcrumbName: "Transaction Calendar",
    },
  ];

  useEffect(() => {
    dispatch(getAllApprovalList());
  }, []);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);
  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);


  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
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
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // handle download
  const handleDownload = () => {
    dispatch(
      getDownloadTrans({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
  };

  const handleApprovalHistory = async (data) => {
    try {
      setBody(data?.idTransCalendar)
      await dispatch(getApprovalHistory(data.idTransCalendar))?.unwrap();
      setOpenModalHistory(true);

    } catch (error) {
      setOpenModalHistory(false);

    }
  };

  const columns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      dataIndex: "key",
      align: "center",
      isClassification: true,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "BEGIN CYCLE",
      key: "beginCycle",
      dataIndex: "beginCycle",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "beginCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "beginCycle",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "END CYCLE",
      key: "endCycle",
      dataIndex: "endCycle",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "endCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "endCycle",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "TIME UNIT",
      key: "timeUnit",
      dataIndex: "timeUnit",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "timeUnit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "timeUnit",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "START DATE",
      key: "startDate",
      sorter: true,
      align: "center",
      dataIndex: "startDate",
      ...getColumnSearchPropsPaging(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (v) =>
        renderDateColumn(
          "startDate",
          searchedColumn,
          searchText,
          v,
          "date",
          search
        ),
    },
    {
      title: "END DATE",
      key: "endDate",
      sorter: true,
      align: "center",
      dataIndex: "endDate",
      ...getColumnSearchPropsPaging(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (v) =>
        renderDateColumn(
          "endDate",
          searchedColumn,
          searchText,
          v,
          "date",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      key: "description",
      dataIndex: "description",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "description",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      key: "status",
      dataIndex: "status",
      width: 150,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status"
        ),
    },
    {
      title: "STATUS APPROVAL",
      key: "statusApproval",
      dataIndex: "statusApproval",
      sorter: true,
      width: 200,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "statusApproval",
          searchedColumn,
          searchText,
          text,
          false,
          "status"
        ),
    },
  ];

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setModalActiveInactive(false);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const data = {
      idTransCalendar: dataInactivate,
      appHierId: res.approvalHierarchy, // Anda dapat menghapus ini jika tidak perlu
      remark: res.remark, // Anda dapat menghapus ini jika tidak perlu
      status: status === "Inactive" ? "Active" : "Inactive",
    };
    setBody(data);
    dispatch(inactiveTransaction(data))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        dispatch(
          getPaginateCycle({ search: encodeURIComponent(JSON.stringify(search)), page, pageSize, sort })
        );
      });
  };

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.TRANSACTION_CALENDAR || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_TRANSACTION_CALENDAR ||
            [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.TRANSACTION_CALENDAR || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_TRANSACTION_CALENDAR ||
            [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const itemActions = [
    // toolbar items
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_TRANSACTION_CALENDER}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_TRANSACTION_CALENDER}
              state={{ id: record?.idTransCalendar }}
            >
              {/* <ButtonComponent
                  className="gap-5"
                  icon={<SVGIcon name="IconDetail" width={24} />}
                  border={false}
                /> */}
              <EyeOutlined
                style={{ fontSize: "24px" }}
              />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isEditable =
          record.status === "Draft" && record.statusApproval === "Rejected"
        return (
          data_length > 3 ? (
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_TRANSACTION_CALENDER}
              state={{ id: record?.idTransCalendar }}
            >
              <ButtonComponent
                className="gap-5 w-full"
                icon={
                  <SVGIcon name="IconEdit" width={24} color={isEditable ? "#0075bf" : "#8D91A0"} />
                }
                border={false}
                disabled={!isEditable}

              >
                <span
                  className={"text-black gap-2 text-xl text-center w-full"}
                >
                  Update
                </span>
              </ButtonComponent>
            </Link>
          ) : (
            <Tooltip title="Update">
              <Link
                to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_TRANSACTION_CALENDER}
                state={{ id: record?.idTransCalendar }}
              >
                <div border={false}>
                  <SVGIcon name="IconEdit"
                    color={!isEditable ? "#8D91A0" : "#ACC424"} width={24}
                    className={!isEditable ? "cursor-not-allowed" : undefined} />
                </div>
              </Link>
            </Tooltip>
          )
        )
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const statusLowerCase = record?.status?.toLowerCase()
        const isActivateOrInactivate =
          (record.statusApproval === "Approved" &&
            record.status === "Active") ||
          (record.statusApproval === "Draft" && record.status === "Active") ||
          (record.statusApproval === "Rejected" &&
            record.status === "Active") ||
          (record.statusApproval === "Waiting Approval" &&
            record.status === "Active");
        return (
          data_length > 3 ?
            <ButtonComponent
              border={false}
              onClick={() => {
                setDataInactivate(record?.idTransCalendar);
                setModalActiveInactive(true);
                setStatus(record?.status);
                // setPaymentItemId(r?.id);
              }}
              disabled={!isActivateOrInactivate
                // disabledActionByStatus('activate', record?.status, record?.statusApproval)
              }
            >
              <Checkbox
                border={false}
                // onClick={() => handleInactive(record)}
                disabled={record?.status !== "Active"}
                checked={record?.status !== "Active"}
              // disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
              />
              <span className={"text-black ml-6 gap-2 text-xl text-center w-full"}>
                {record?.status === "Active" ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
            :
            <Tooltip title={statusLowerCase === "active" || statusLowerCase === 'draft' ? "Inactivate" : "Activate"}>
              <div>
                <Checkbox
                  border={false}
                  onClick={() => {
                    setDataInactivate(record?.idTransCalendar);
                    setModalActiveInactive(true);
                    setStatus(record?.status);
                    // setPaymentItemId(r?.id);
                  }}
                  checked={record?.status !== "Active"}
                  disabled={record?.status !== "Active"}
                // disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                />
              </div>
            </Tooltip>
        )
      },
    },
    {
      action: "history",
      type: "table",
      render: (record, data_length) => {
        return (
          data_length > 3 ?
            <ButtonComponent
              className="gap-5"
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record)}
            >
              <span className={"text-black gap-2 text-xl text-center"}>
                Approval History
              </span>
            </ButtonComponent>
            :
            <Tooltip title={'Approval History'}>
              <div border={false}
                onClick={() => handleApprovalHistory(record)}
              >
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              </div>
            </Tooltip>
        );
      },
    },
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_TRANSACTION_CALENDAR") {
        dispatch(inactiveTransaction(body));
      } else if (bodyError?.action === "GET_APPROVAL_TRANSACTION_CALENDAR") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_TRANSACTION_CALENDAR") {
        handleDownload();
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">TRANSACTION CALENDAR LIST</p>
              <div className="flex gap-2">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <TableRBI
            dataSource={data?.result}
            pageSize={pageSize}
            showExport={true}
            handleDownload={handleDownload}
            columns={[
              ...columns,
              ...useColumnActionPermission(
                ["view", "history", "update", 'activate'],
                itemActions
              ),
            ]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{
              x: "max-content",
              y: 525,
            }}
          />
        </CardContainer>

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
        <ModalInactivateWithHierarchy
          selector={"cycle"}
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          alertMessage={`Are you sure you want to inactivate this Transaction Calender name ${dataInactivate}?`}
          openModalInactivate={modalActiveInactive}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />
      </Spin>

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewTransactionCalender;
