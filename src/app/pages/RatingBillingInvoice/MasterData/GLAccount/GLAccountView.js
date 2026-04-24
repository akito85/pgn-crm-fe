import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Checkbox, Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { columnsGLAccount } from "./Table/TableGLAccount";
import {
  getAllGLAccountPaginate,
  getApprovalHistory,
  getApprovalHierarchyList,
  getApprovalHierarchyDetail,
  inactiveGLAccount,
  requestActivateGLAccount,
  downloadGLAccount,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/glAccount";
import TableRBI from "../../../../../components/TableRBI";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";
import ModalApprovalGLAccount from "./ModalApprovalGLAccount";

const GLAccountView = () => {
  const {
    loading,
    data_approval_history,
    gl_account_list,
    gl_account_pagination,
  } = useSelector((state) => state.glAccount);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const isLoadMoreInFlight = useRef(false);
  const lastRequestedPage = useRef(1);

  // State
  const loadMoreSize = 20;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const hasMore =
    gl_account_list.length < (gl_account_pagination?.totalElements || 0);

  const [modalInactive, setModalInactive] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [chooseId, setChooseId] = useState();

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("glAccountFixedColumns");
      return saved ? JSON.parse(saved) : { left: ["no"], right: ["action"] };
    } catch (e) {
      return { left: ["no"], right: ["action"] };
    }
  });

  const normalizeStatus = (value) =>
    (value || "")
      .toString()
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

  // Save fixedColumns to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("glAccountFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  // Use Effect - Fetch data
  useEffect(() => {
    isLoadMoreInFlight.current = false;
    lastRequestedPage.current = 1;
    dispatch(
      getAllGLAccountPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
  }, [search, sort, dispatch]);

  useEffect(() => {
    if (data_approval_history) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.GL_ACCOUNT || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_GL_ACCOUNT || [],
          activate:
            data_approval_history?.dataApprover?.ACTIVATED_GL_ACCOUNT || [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.GL_ACCOUNT || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_GL_ACCOUNT || [],
          activate:
            data_approval_history?.dataHistory?.ACTIVATED_GL_ACCOUNT || [],
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
      path: RBI_ROUTES.GLACCOUNT,
      breadcrumbName: "GL Account",
    },
  ];

  // Handle Search Table
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  // Handle Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleLoadMore = useCallback(async () => {
    if (isLoadMoreInFlight.current) return;
    if (gl_account_list.length >= (gl_account_pagination?.totalElements || 0))
      return;

    const nextPage = Math.floor(gl_account_list.length / loadMoreSize) + 1;
    if (nextPage <= lastRequestedPage.current) return;

    isLoadMoreInFlight.current = true;
    const action = await dispatch(
      getAllGLAccountPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );

    if (getAllGLAccountPaginate.fulfilled.match(action)) {
      lastRequestedPage.current = nextPage;
    }

    isLoadMoreInFlight.current = false;
  }, [dispatch, gl_account_list.length, gl_account_pagination, search, sort]);

  const handleRefresh = useCallback(() => {
    isLoadMoreInFlight.current = false;
    lastRequestedPage.current = 1;
    dispatch(
      getAllGLAccountPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
  }, [dispatch, search, sort]);

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
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleOk = (res, handleClear) => {
    const selectedStatus = normalizeStatus(chooseId?.status);
    const selectedApprovalStatus = normalizeStatus(chooseId?.approvalStatus);
    const isActivateRequest =
      selectedStatus === "INACTIVE" &&
      selectedApprovalStatus !== "WAITING APPROVAL";
    const dataValue = {
      glAccountId: chooseId.glAccountId,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(
      (isActivateRequest ? requestActivateGLAccount : inactiveGLAccount)(
        dataValue,
      ),
    )
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        isLoadMoreInFlight.current = false;
        lastRequestedPage.current = 1;
        dispatch(
          getAllGLAccountPaginate({
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
          setBodyError({
            body: { ...res },
            handleClear,
            message,
            actionType: isActivateRequest ? "activate" : "inactivate",
          });
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
      downloadGLAccount({
        search: tempSearch,
        page: 1,
        pageSize: loadMoreSize,
        sort,
      }),
    );
  };

  // Grant Access Item
  const itemGrantAccess = [
    {
      action: "Approve",
      render: (
        <ButtonComponent
          icon={
            <SVGIcon name="IconRequestApproval" width={20} color="#ffffff" />
          }
          type="submit"
          className="bg-red-500"
          onClick={() => setModalApproval(true)}
        >
          Bulk Approve
        </ButtonComponent>
      ),
    },
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.GLACCOUNT_CREATE}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "20px" }} />}
            type="submit"
          >
            Create GL Account
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
            to={RBI_ROUTES.GLACCOUNT_DETAIL}
            state={{ id: record.glAccountId }}
          >
            <Tooltip title="Detail">
              <div className="pt-0">
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
          record.approvalStatus === "DRAFT" ||
          record.approvalStatus === "REJECTED";
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
                className={`ml-0 ${isEditable ? "text-black " : "text-[#8D91A0]"
                  }`}
              >
                {" "}
                Update
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-0">
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
            to={RBI_ROUTES.GLACCOUNT_UPDATE}
            state={{
              id: record.glAccountId,
              status: record.status,
              statusApproval: record.approvalStatus,
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
        const rowStatus = normalizeStatus(record.status);
        const rowApprovalStatus = normalizeStatus(record.approvalStatus);
        const canInactivate =
          rowStatus === "ACTIVE" &&
          ["ACTIVE", "APPROVED", "DRAFT", "REJECTED", "WAITING APPROVAL"].includes(
            rowApprovalStatus,
          );
        const canActivate =
          rowStatus === "INACTIVE" && rowApprovalStatus !== "WAITING APPROVAL";
        const isActivateOrInactivate = canInactivate || canActivate;

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={!isActivateOrInactivate}
                  checked={rowStatus !== "ACTIVE"}
                />
              }
              type={"action"}
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
            >
              <span className="text-black ml-1">
                {rowStatus !== "ACTIVE" ? "Activate" : "Inactivate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={rowStatus === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={!isActivateOrInactivate}
                  checked={rowStatus !== "ACTIVE"}
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
              onClick={() => handleApprovalHistory(record.glAccountId)}
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
                  onClick={() => handleApprovalHistory(record.glAccountId)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  // Call useColumnActionPermission hook at component level
  const actionColumns = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess,
  );

  // Get base columns with key property
  const baseColumns = useMemo(() => {
    const glAccountCols = [
      ...columnsGLAccount(
        search,
        1,
        loadMoreSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      ...actionColumns,
    ];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = glAccountCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [search, searchedColumn, searchText, actionColumns]);

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

  // Render keys just like Prabilling module to prevent rows changing weirdly
  const dataSourceWithKeys = useMemo(() => {
    if (!gl_account_list || gl_account_list.length === 0) return [];
    return gl_account_list.map((item) => ({
      ...item,
      key: item.glAccountId,
    }));
  }, [gl_account_list]);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] text-primary">GL ACCOUNT LIST</p>

              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className={"w-full"}>
            <TableRBI
              idTable="glAccountTable"
              dataSource={dataSourceWithKeys}
              columns={columns}
              totalData={gl_account_pagination?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1000 }}
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
              loadMoreThreshold={20}
            />
          </div>
        </CardContainer>

        {/* Modal Bulk Approval */}
        <ModalApprovalGLAccount
          isOpen={modalApproval}
          handleCancel={() => setModalApproval(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalApproval(true)}
        />

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
          selector={"glAccount"}
          dispatch={dispatch}
          getAPIOption={getApprovalHierarchyList}
          getAPIDetail={getApprovalHierarchyDetail}
          alertMessage={`Are you sure you want to ${normalizeStatus(chooseId?.status) === "INACTIVE"
            ? "activate"
            : "inactivate"
            } this GL Account with account number ${chooseId?.glAccount || ""}?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

        {/* Modal Error Inactive */}
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
            <p className="pl-[70px]">{`Your data was not ${bodyError.actionType || "inactivate"
              }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default GLAccountView;
