import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Checkbox, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import SVGIcon from "../../../../../../assets/Icon/index";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import GeneralTemplateTableView from "../Table/GeneralTemplateTableView";
import { Link, NavLink } from "react-router-dom";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import {
  activationGeneralTemplate,
  getAllGeneralTemplatePaginate,
  getApprovalHistoryGeneralTemplate,
  getApprovalList,
  getApprovalListDetail,
  getDownloadGeneralTemplateList,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/general_template";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import TableRBI from "../../../../../../components/TableRBI";
import CardContainer from "../../../../../../components/CardContainer";
import { clearBodyMessage } from "../../../../../../redux/slices/general_slice";

const GeneralTemplateView = () => {
  // Selector
  const { data_list, data_approval_history, loading } = useSelector(
    (state) => state.general_template
  );
  const { bodyError: bodyErrorGeneral } = useSelector(
    (state) => state?.general
  );

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // Use State
  const [page, setPage] = useState(1);
  const initialPageSize = 100;
  const loadMoreSize = 20;
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [allData, setAllData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const shouldResetRef = useRef(true);

  const hasMore = allData.length < (data_list?.page?.totalElements || 0);

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("generalTemplateFixedColumns");
      return saved ? JSON.parse(saved) : { left: ["no"], right: ["statusApproval", "action"] };
    } catch (e) {
      return { left: ["no"], right: ["statusApproval", "action"] };
    }
  });

  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [dataInactivate, setDataInactivate] = useState({});

  //modal
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [modalInactivate, setModalInactivate] = useState(false);

  //try again
  const [bodyError, setBodyError] = useState({});
  const [modalError, setModalError] = useState(false);

  //useEffect
  // Save fixedColumns to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("generalTemplateFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  useEffect(() => {
    dispatch(
      getAllGeneralTemplatePaginate({
        page: 1,
        pageSize: initialPageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, sort, search, refreshKey]);

  // Accumulate data for infinite scroll
  useEffect(() => {
    if (data_list?.result) {
      if (shouldResetRef.current || page === 1) {
        setAllData(data_list.result);
        shouldResetRef.current = false;
      } else {
        setAllData((prev) => {
          const ids = new Set(prev.map((item) => item.templateId));
          const newItems = data_list.result.filter(
            (item) => !ids.has(item.templateId)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [data_list, page]);

  // trigger modal try again from general slice
  useEffect(() => {
    if (bodyErrorGeneral?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyErrorGeneral]);

  //approval history
  useEffect(() => {
    if (data_approval_history && data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.GENERAL_TEMPLATE || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_GENERAL_TEMPLATE ||
            [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.GENERAL_TEMPLATE || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_GENERAL_TEMPLATE || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

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
      getDownloadGeneralTemplateList({
        search: tempSearch,
        page,
        pageSize: initialPageSize,
        sort,
      })
    );
  };

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

  const handleChange = (pageChange) => {
    setPage(pageChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    shouldResetRef.current = true;
    setPage(1);
    setSort(dataSort);
  };

  // Handle Load More (infinite scroll)
  const handleLoadMore = useCallback(async () => {
    if (allData.length >= (data_list?.page?.totalElements || 0)) return;
    const nextPage = Math.floor(allData.length / loadMoreSize) + 1;
    setPage(nextPage);
    await dispatch(
      getAllGeneralTemplatePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
      })
    );
  }, [allData.length, data_list?.page?.totalElements, search, sort, dispatch, loadMoreSize]);

  // Handle Refresh
  const handleRefresh = useCallback(() => {
    shouldResetRef.current = true;
    if (page === 1) {
      setRefreshKey((prev) => prev + 1);
    } else {
      setPage(1);
    }
  }, [page]);

  const handleRetry = () => {
    if (bodyError?.value) {
      onFinishInactive(bodyError.value);
    }
    setModalError(false);
    setBodyError({});
    dispatch(clearBodyMessage());
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
    dispatch(clearBodyMessage());
  };

  //handle approval history section
  const handleApprovalHistory = (r) => {
    dispatch(getApprovalHistoryGeneralTemplate({ id: r?.templateId }));
    setOpenModalHistory(true);
  };

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleOpenModalInactivate = (value) => {
    setDataInactivate(value);
    setModalInactivate(true);
  };

  const handleCloseModalInactivate = () => {
    setDataInactivate({});
    setModalInactivate(false);
  };

  const onFinishInactive = (e) => {
    const body = {
      templateId: dataInactivate?.templateId,
      description: e.remark,
      apphierId: e.tappId ? e.tappId : e.approvalHierarchy,
    };

    dispatch(activationGeneralTemplate(body))
      .unwrap()
      .then(async () => {
        shouldResetRef.current = true;
        dispatch(
          getAllGeneralTemplatePaginate({
            page: 1,
            pageSize: initialPageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          })
        );
        setModalInactivate(false);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  };

  // routes
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
      breadcrumbName: "General Template",
    },
  ];

  // Grant Access Item
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
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
        <NavLink to={RBI_ROUTES.GENEREAL_TEMPLATE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type={"submit"}
            border={false}
          >
            Create General Template
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
            to={RBI_ROUTES.GENEREAL_TEMPLATE_DETAIL}
            state={{
              id: record.templateId,
            }}
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
                className={`ml-0 ${
                  isEditable ? "text-black" : "text-[#8D91A0]"
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
            to={RBI_ROUTES.GENEREAL_TEMPLATE_UPDATE}
            state={{
              id: record.templateId,
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
                  onClick={() => handleOpenModalInactivate(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleOpenModalInactivate(record)}
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
                  onClick={() => handleOpenModalInactivate(record)}
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
              onClick={() => handleApprovalHistory(record)}
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
                  onClick={() => handleApprovalHistory(record)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  // Get base columns from GeneralTemplateTableView
  const actionCols = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess
  );

  const baseColumns = useMemo(() => {
    const cols = [
      ...GeneralTemplateTableView(
        search,
        page,
        initialPageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ...actionCols,
    ];
    return cols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [search, page, searchedColumn, searchText, actionCols]);

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

    return [...leftFixed, ...normal, ...rightFixed].map((col) => {
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
              <p className="mt-[15px]">GENERAL TEMPLATE LIST</p>
              <div className="flex gap-[20px]">
                <Toolbar items={itemGrantAccess} />
              </div>
            </div>
          }
        >
          <div className="my-0">
            <TableRBI
              idTable="generalTemplateTable"
              dataSource={allData}
              columns={columns}
              current={page}
              pageSize={initialPageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data_list?.page?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
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

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistory}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={1000}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        {/** Modal Retry */}
        {modalError ? (
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
              <p className="pl-[70px]">
                {bodyError?.message ||
                  bodyErrorGeneral?.response?.data?.message?.toString()}
              </p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        ) : null}

        {modalInactivate ? (
          <ModalInactivateWithHierarchy
            dispatch={dispatch}
            getAPIOption={getApprovalList}
            getAPIDetail={getApprovalListDetail}
            alertMessage={`Are you sure you want to inactivate General Template with name ${
              dataInactivate?.templateName || ""
            }?`}
            openModalInactivate={modalInactivate}
            handleCloseModalInactivate={handleCloseModalInactivate}
            onFinish={onFinishInactive}
            selector="general_template"
          />
        ) : null}
      </Spin>
    </>
  );
};

export default GeneralTemplateView;
