import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import SVGIcon from "../../../../../../assets/Icon";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Link, NavLink } from "react-router-dom";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getBillingCycleList,
  downloadBillingCycle,
  getApprovalHierarchy,
  getDetailApproval,
  inactiveBillingCycle,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import { Checkbox, Spin, Tooltip } from "antd";
import TableRBI from "../../../../../../components/TableRBI";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { columnsBillingCycleList } from "../Table/TableBillingCycleList";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import { getApprovalHistory } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../../components/CardContainer";

const BillingCycleView = ({ type }) => {
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const loadMoreSize = 20;
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalInactive, setModalInactive] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [bodyError, setBodyError] = useState({});
  const [chooseId, setChooseId] = useState();
  const {
    loading,
    dataApprovalHistory,
    billing_cycle_list,
    billing_cycle_pagination,
  } = useSelector((state) => state.billingCycle);

  const hasMore =
    billing_cycle_list.length < (billing_cycle_pagination?.totalElements || 0);

  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("billingCycleFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: ["no"],
          right: ["action"],
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "billingCycleFixedColumns",
      JSON.stringify(fixedColumns),
    );
  }, [fixedColumns]);

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: "",
      breadcrumbName: "Billing Cycle",
    },
  ];

  const handleDownload = () => {
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
      downloadBillingCycle({
        search: tempSearch,
        page: 1,
        pageSize: loadMoreSize,
        sort,
      }),
    );
  };

  const handleApprovalHistory = useCallback(
    (r) => {
      dispatch(getApprovalHistory(r));
      setModalApprovalHistory(true);
    },
    [dispatch],
  );

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  useEffect(() => {
    dispatch(
      getBillingCycleList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
  }, [dispatch, search, sort]);

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.BILLING_CYCLE || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_BILLING_CYCLE || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.BILLING_CYCLE || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_BILLING_CYCLE || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
  };

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleRetry = () => {
    handleOk();
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      billingCycleId: chooseId.billingCycleId,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveBillingCycle(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        dispatch(
          getBillingCycleList({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: false,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };

  const handleLoadMore = useCallback(async () => {
    if (
      billing_cycle_list.length >=
      (billing_cycle_pagination?.totalElements || 0)
    )
      return;
    const nextPage = Math.floor(billing_cycle_list.length / loadMoreSize) + 1;
    await dispatch(
      getBillingCycleList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
  }, [
    dispatch,
    billing_cycle_list.length,
    billing_cycle_pagination,
    search,
    sort,
  ]);

  const handleRefresh = useCallback(() => {
    dispatch(
      getBillingCycleList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
  }, [dispatch, search, sort]);

  // Grant Access Item
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.BILLING_CYCLE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type={"submit"}
            border={false}
          >
            Create Billing Cycle
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.BILLING_CYCLE_DETAIL}
            state={{
              id: record.billingCycleId,
              action: record.status,
              statusApproval: record.statusApproval,
            }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED" ||
          (record.status === "ACTIVE" && record.statusApproval === "APPROVED");

        const linkContent =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconEdit"
                  color={isEditable ? "#0075bf" : "#8D91A0"}
                  width={24}
                />
              }
              type={"action"}
              border={false}
              disabled={!isEditable}
            >
              <span
                className={`ml-0 ${
                  isEditable ? "text-black " : "text-[#8D91A0]"
                }`}
              >
                {" "}
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
          <Link
            to={RBI_ROUTES.BILLING_CYCLE_UPDATE}
            state={{
              status: record?.status,
              statusApproval: record?.statusApproval,
              id: record?.billingCycleId,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div>{linkContent}</div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActivateOrInactivate =
          (record.statusApproval === "APPROVED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "WAITING APPROVAL" &&
            record.status === "ACTIVE");

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              }
              type={"action"}
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
            >
              <span className="text-black ml-1">
                {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              type={"action"}
              border={false}
              onClick={() => handleApprovalHistory(record.billingCycleId)}
            >
              <span className={"text-black ml-0"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div className="pt-1">
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => handleApprovalHistory(record.billingCycleId)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  // ✅ Call useColumnActionPermission hook at component level
  const actionColumns = useColumnActionPermission(
    ["activate", "view", "update", "history"],
    itemGrantAccess,
  );

  // ✅ Get base columns with key property
  const baseColumns = useMemo(() => {
    const billingCycleCols = [
      ...columnsBillingCycleList(
        search,
        1,
        loadMoreSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleApprovalHistory,
        handleInactive,
      ),
      ...actionColumns,
    ];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = billingCycleCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [
    search,
    searchedColumn,
    searchText,
    actionColumns,
    handleApprovalHistory,
  ]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  const columns = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    baseColumns.forEach((col) => {
      const colKey = col.key || col.dataIndex || col.title;

      if (fixedColumns.left.includes(colKey)) {
        leftFixed.push(col);
      } else if (fixedColumns.right.includes(colKey)) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    const reorderedColumns = [...leftFixed, ...normal, ...rightFixed];

    return reorderedColumns.map((col) => {
      const newCol = { ...col };
      const colKey = col.key || col.dataIndex || col.title;

      if (fixedColumns.left.includes(colKey)) {
        newCol.fixed = "left";
      } else if (fixedColumns.right.includes(colKey)) {
        newCol.fixed = "right";
      } else {
        delete newCol.fixed;
      }

      return newCol;
    });
  }, [baseColumns, fixedColumns]);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] w-full">BILLING CYCLE LIST</p>
              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className="w-full">
            <TableRBI
              idTable="billingCycleTable"
              dataSource={billing_cycle_list}
              columns={columns}
              totalData={billing_cycle_pagination?.totalElements || 0}
              tableScrolled={{ y: 525, x: 2200 }}
              onSort={onSort}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              showRefresh={true}
              onRefresh={handleRefresh}
              refreshLabel="Refresh"
            />
          </div>
        </CardContainer>

        {/* Modal approval history */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistoryFix}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />

        <ModalInactivateWithHierarchy
          selector={"billingCycle"}
          dispatch={dispatch}
          getAPIOption={getApprovalHierarchy}
          getAPIDetail={getDetailApproval}
          alertMessage={`Are you sure you want to inactivate this Billing Cycle with Begin Cycle ${
            chooseId?.beginCycle || ""
          }?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

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
            <p className="pl-[70px]">{`Your data was not inactivate. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default BillingCycleView;