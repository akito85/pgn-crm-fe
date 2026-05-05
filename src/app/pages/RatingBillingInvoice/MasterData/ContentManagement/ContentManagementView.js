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
import { columnsContentManagement } from "./Table/TableContentManagement";
import {
  getAllContentManagementPaginate,
  getApprovalHistory,
  getListApprovalHierarchy,
  getListApprovalHierarchyDetail,
  inactiveContentManagement,
  activateContentManagement,
  downloadContentManagementList,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/contentManagement";
import TableRBI from "../../../../../components/TableRBI";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";

const ContentManagementView = () => {
  // Selector
  const { loading, data_approval_history, content_list, content_pagination } =
    useSelector((state) => state.contentManagement);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const loadMoreSize = 20;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const hasMore =
    content_list.length < (content_pagination?.totalElements || 0);

  const [modalInactive, setModalInactive] = useState(false);
  const [modalActivate, setModalActivate] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalActivateError, setModalActivateError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyActivateError, setBodyActivateError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [chooseId, setChooseId] = useState();
  const [chooseActivateId, setChooseActivateId] = useState();

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("contentManagementFixedColumns");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          left: parsed.left || [],
          right: parsed.right || [],
        };
      }
      return { left: ["NO"], right: ["action"] };
    } catch (e) {
      return { left: ["NO"], right: ["action"] };
    }
  });

  // Save fixedColumns to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("contentManagementFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllContentManagementPaginate({
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
          create: data_approval_history?.dataApprover?.CONTENT_TEMPLATE || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_CONTENT_TEMPLATE ||
            [],
          activate:
            data_approval_history?.dataApprover?.ACTIVE_CONTENT_TEMPLATE || [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.CONTENT_TEMPLATE || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_CONTENT_TEMPLATE || [],
          activate:
            data_approval_history?.dataHistory?.ACTIVE_CONTENT_TEMPLATE || [],
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
      path: RBI_ROUTES.CONTENT_MANAGEMENT,
      breadcrumbName: "Content Management",
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
    if (content_list.length >= (content_pagination?.totalElements || 0)) return;
    const nextPage = Math.floor(content_list.length / loadMoreSize) + 1;
    await dispatch(
      getAllContentManagementPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
  }, [dispatch, content_list.length, content_pagination, search, sort]);

  const handleRefresh = useCallback(() => {
    dispatch(
      getAllContentManagementPaginate({
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
    const dataValue = {
      id: chooseId.id,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveContentManagement(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        dispatch(
          getAllContentManagementPaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: false,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
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

  // Handle Modal Request Activate
  const handleRequestActivate = (data) => {
    setChooseActivateId(data);
    setModalActivate(true);
  };

  // Handle Cancel Modal Request Activate
  const handleCancelActivate = () => {
    setChooseActivateId();
    setModalActivate(false);
  };

  const handleOkActivate = (res, handleClear) => {
    const dataValue = {
      id: chooseActivateId.id,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(activateContentManagement(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelActivate();
        dispatch(
          getAllContentManagementPaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: false,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyActivateError({ body: { ...res }, handleClear, message });
          setModalActivateError(true);
        }
      });
  };

  const handleRetryActivate = () => {
    handleOkActivate(bodyActivateError.body, bodyActivateError.handleClear);
    setModalActivateError(false);
    setBodyActivateError({});
  };

  const handleCloseModalActivateError = () => {
    setModalActivateError(false);
    setBodyActivateError({});
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
      downloadContentManagementList({
        search: tempSearch,
        page: 1,
        pageSize: loadMoreSize,
        sort,
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
        <NavLink to={RBI_ROUTES.CONTENT_MANAGEMENT_CREATE}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "20px" }} />}
            type="submit"
          >
            Create Content Management
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
            to={RBI_ROUTES.CONTENT_MANAGEMENT_DETAIL}
            state={{ id: record.id }}
          >
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
                className={`ml-0 ${isEditable ? "text-black" : "text-[#8D91A0]"
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
            to={RBI_ROUTES.CONTENT_MANAGEMENT_UPDATE}
            state={{
              id: record.id,
              status: record.status,
              statusApproval: record.statusApproval,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div>
            {linkContent}
          </div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isWaiting =
          record.statusApproval === "WAITING_APPROVAL" ||
          record.statusApproval === "WAITING APPROVAL";
        const isEnabled = !isWaiting;
        const isActive = record.status === "ACTIVE";
        const label = isActive ? "Inactivate" : "Activate";
        const handleClick = () =>
          isActive
            ? handleInactive(record)
            : handleRequestActivate(record);

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={isEnabled ? handleClick : undefined}
                  disabled={!isEnabled || !isActive}
                  checked={!isActive}
                />
              }
              type={"action"}
              border={false}
              disabled={!isEnabled}
              onClick={isEnabled ? handleClick : undefined}
            >
              <span className={isEnabled ? "text-black ml-1" : "text-[#8D91A0] ml-1"}>
                {label}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title={label}>
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={isEnabled ? handleClick : undefined}
                  disabled={!isEnabled || !isActive}
                  checked={!isActive}
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
              onClick={() => handleApprovalHistory(record.id)}
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
                  onClick={() => handleApprovalHistory(record.id)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess,
  );

  const baseColumns = useMemo(() => {
    const contentManagementCols = [
      ...columnsContentManagement(
        search,
        1,
        loadMoreSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      ...actionCols,
    ];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = contentManagementCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [search, searchedColumn, searchText, actionCols]);

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
                CONTENT MANAGEMENT LIST
              </p>

              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className={"w-full"}>
            <TableRBI
              idTable="contentManagementTable"
              dataSource={content_list}
              columns={columns}
              totalData={content_pagination?.totalElements || 0}
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
          selector={"contentManagement"}
          dispatch={dispatch}
          getAPIOption={getListApprovalHierarchy}
          getAPIDetail={getListApprovalHierarchyDetail}
          alertMessage={`Are you sure you want to inactivate this Content Management with name ${chooseId?.templateName || ""
            }?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

        {/* Modal Request Activate */}
        <ModalInactivateWithHierarchy
          selector={"contentManagement"}
          dispatch={dispatch}
          getAPIOption={getListApprovalHierarchy}
          getAPIDetail={getListApprovalHierarchyDetail}
          header="Request Activate Information"
          alertMessage={`Are you sure you want to request activate this Content Management with name ${chooseActivateId?.templateName || ""
            }?`}
          openModalInactivate={modalActivate}
          handleCloseModalInactivate={handleCancelActivate}
          onFinish={handleOkActivate}
        />

        {/* Modal Error Request Activate */}
        <ModalError
          isOpen={modalActivateError}
          handleOk={handleRetryActivate}
          handleCancel={handleCloseModalActivateError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your request activate was not submitted. ${bodyActivateError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

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
            <p className="pl-[70px]">{`Your data was not inactivated. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default ContentManagementView;
