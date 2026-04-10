import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Checkbox, Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { columnsBillingBucket } from "./Table/TableBillingBucket";
import {
  downloadBillingBucket,
  getApprovalHistory,
  getAllBillingBucketPaginate,
  getListApprovalHierarchy,
  inactiveBillingBucket,
  getListApprovalHierarchyDetail,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import TableRBI from "../../../../../components/TableRBI";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";

const BillingBucketView = () => {
  // Selector
  const { data, loading, data_approval_history } = useSelector(
    (state) => state.billing_bucket,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const initialPageSize = 100;
  const loadMoreSize = 20;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [allData, setAllData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const shouldResetRef = useRef(true);

  const hasMore = allData.length < (data?.page?.totalElements || 0);

  const [modalInactive, setModalInactive] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [chooseId, setChooseId] = useState();

  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("billingBucketFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: ["no"],
          right: ["action"],
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "billingBucketFixedColumns",
      JSON.stringify(fixedColumns),
    );
  }, [fixedColumns]);

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllBillingBucketPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
      }),
    );
  }, [search, sort, dispatch, refreshKey]);

  // Accumulate data for infinite scroll
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
    if (data_approval_history) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.BILLING_BUCKET || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_BILLING_BUCKET || [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.BILLING_BUCKET || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_BILLING_BUCKET || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Breadcrumbs
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
      path: RBI_ROUTES.BILLING_BUCKET_VIEW,
      breadcrumbName: "Billing Bucket",
    },
  ];

  // Handle Search Table
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

  // Handle Change Page Table
  const handleChange = (pageChange) => {
    setPage(pageChange);
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

  // Handle Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    shouldResetRef.current = true;
    setPage(1);
    setSort(dataSort);
  };

  // Handle Load More (infinite scroll)
  const handleLoadMore = useCallback(async () => {
    if (allData.length >= (data?.page?.totalElements || 0)) return;
    const nextPage = Math.floor(allData.length / loadMoreSize) + 1;
    setPage(nextPage);
    await dispatch(
      getAllBillingBucketPaginate({
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

  // Handle Refresh
  const handleRefresh = useCallback(() => {
    shouldResetRef.current = true;
    if (page === 1) {
      setRefreshKey((prev) => prev + 1);
    } else {
      setPage(1);
    }
  }, [page]);

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      billingBucketCode: chooseId.billingBucketCode,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveBillingBucket(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
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
          getAllBillingBucketPaginate({
            search: tempSearch,
            page: 1,
            pageSize: initialPageSize,
            sort,
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

  // Handle Approval History
  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistory(id));
    setModalApprovalHistory(true);
  };

  // Handle Modal Confirmation Inactive
  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
  };

  // Handle Cancel Modal Confirmation Inactive
  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  // Handle Download
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
      downloadBillingBucket({
        page,
        pageSize: initialPageSize,
        sort,
        search: tempSearch,
      }),
    );
  };

  // Grant Access Item - moved outside useMemo
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          icon={
            <SVGIcon name="IconButtonDownload" style={{ fontSize: "20" }} />
          }
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.BILLING_BUCKET_CREATE}>
          <ButtonComponent
            icon={
              <SVGIcon name="IconButtonCreate" style={{ fontSize: "20" }} />
            }
            type="submit"
          >
            Create Billing Bucket
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
          <Link to={RBI_ROUTES.BILLING_BUCKET_DETAIL} state={{ id: record.id }}>
            <Tooltip title="Detail">
              <SVGIcon name="IconDetail" width={20} />
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
          record.statusApproval === "REJECTED";

        const linkContent =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconEdit"
                  color={isEditable ? "#0075bf" : "#8D91A0"}
                  width={20}
                />
              }
              border={false}
              disabled={!isEditable}
              type={"action"}
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
                  width={20}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={RBI_ROUTES.BILLING_BUCKET_UPDATE}
            state={{
              id: record.id,
              status: record.status,
              statusApproval: record.statusApproval,
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
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
              type={"action"}
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
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
              }
              type={"action"}
              border={false}
              onClick={() => handleApprovalHistory(record.billingBucketCode)}
            >
              <span className={"text-black ml-0"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div className="pt-1">
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={20}
                  onClick={() =>
                    handleApprovalHistory(record.billingBucketCode)
                  }
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
    ["view", "activate", "update", "history"],
    itemGrantAccess,
  );

  // ✅ Get base columns with key property
  const baseColumns = useMemo(() => {
    const billingBucketCols = [
      ...columnsBillingBucket(
        search,
        page,
        initialPageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      ...actionColumns,
    ];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = billingBucketCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [search, page, searchedColumn, searchText, actionColumns]);

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
              <p className="w-full mt-[15px] text-primary">
                BILLING BUCKET LIST
              </p>

              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className={"w-full"}>
            <TableRBI
              idTable="billingBucketTable"
              dataSource={allData}
              columns={columns}
              current={page}
              pageSize={initialPageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              loading={loading}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1000 }}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              useInfiniteScroll={true}
              usePagination={false}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              showRefresh={true}
              onRefresh={handleRefresh}
              refreshLabel="Refresh"
            />
          </div>
        </CardContainer>

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        {/* Modal Inactive */}
        <ModalInactivateWithHierarchy
          selector={"billing_bucket"}
          dispatch={dispatch}
          getAPIOption={getListApprovalHierarchy}
          getAPIDetail={getListApprovalHierarchyDetail}
          alertMessage={`Are you sure you want to inactivate this Billing Bucket with name ${
            chooseId?.billingBucketCode || ""
          }?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

        {/* Modal Modal Error Inactive */}
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

export default BillingBucketView;
