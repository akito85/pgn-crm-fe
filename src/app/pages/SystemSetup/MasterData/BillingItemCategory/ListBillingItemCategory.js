import { Tooltip, Checkbox } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import Toolbar from "../../../../../components/Toolbar";
import TableRBI from "../../../../../components/TableRBI";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  getListBillingItemCategory,
  requestInactiveBillingItemCategory,
  getDownloadBillingItemCategory,
  getApprovalHistory,
  getAvailableApproval,
  getSelectedApproval,
} from "../../../../../redux/slices/system_setup/master_data/billingItemCategory";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";

const ListBillingItemCategory = () => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20); // Load 20 data each time
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  // Modal States
  const [modalInactive, setModalInactive] = useState(false);
  const [chooseId, setChooseId] = useState(null);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  // Fixed columns state - initialize with default fixed columns
  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("billingItemCategoryFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: [],
          right: ["status", "statusApproval", "action"],
        };
  });

  // Save to localStorage when fixedColumns change
  useEffect(() => {
    localStorage.setItem(
      "billingItemCategoryFixedColumns",
      JSON.stringify(fixedColumns),
    );
  }, [fixedColumns]);

  const { loading, data, pagination, dataApprovalHistory } = useSelector(
    (state) => state.billingItemCategory,
  );

  // Handle Refresh
  const handleRefresh = useCallback(() => {
    const searchObject = Object.keys(search)
      .filter((key) => search[key])
      .reduce((obj, key) => {
        obj[key] = search[key];
        return obj;
      }, {});

    const sortArray = sort ? [sort] : [];

    dispatch(
      getListBillingItemCategory({
        page: 1,
        size: 100, // Initial load 100 data
        sort: sortArray,
        search: searchObject,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);

  // Use Effect - Initial fetch with 100 data
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Approval History Logic
  useEffect(() => {
    if (dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create:
            dataApprovalHistory?.dataApprover?.BILLING_ITEM_CATEGORY || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_BILLING_ITEM_CATEGORY ||
            [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.BILLING_ITEM_CATEGORY || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_BILLING_ITEM_CATEGORY ||
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

  const handleApprovalHistory = async (record) => {
    try {
      await dispatch(getApprovalHistory(record.id)).unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      console.error("Failed to fetch approval history:", error);
      setOpenModalHistory(false);
    }
  };

  const handleCancelInactive = () => {
    setChooseId(null);
    setModalInactive(false);
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      id: chooseId.id,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(requestInactiveBillingItemCategory(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelInactive();
        handleRefresh();
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

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
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

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      const searchObject = Object.keys(search)
        .filter((key) => search[key])
        .reduce((obj, key) => {
          obj[key] = search[key];
          return obj;
        }, {});

      const sortArray = sort ? [sort] : [];

      await dispatch(
        getListBillingItemCategory({
          page: nextPage,
          size: loadMoreSize, // Load 20 more
          sort: sortArray,
          search: searchObject,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    }
  };

  // Get current data from Redux state with default empty array
  const currentData = useMemo(() => {
    return data || [];
  }, [data]);

  // Calculate if there's more data
  const hasMore = currentData.length < (pagination?.totalElements || 0);

  // Function Search Column - Reset page to 1 when search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }

      // If selectedKeys is empty, remove the key from search object
      if (!selectedKeys[0]) {
        const newState = { ...prevState };
        delete newState[dataIndex];
        return newState;
      }

      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    const searchObject = Object.keys(search)
      .filter((key) => search[key])
      .reduce((obj, key) => {
        obj[key] = search[key];
        return obj;
      }, {});

    const sortArray = sort ? [sort] : [];

    dispatch(
      getDownloadBillingItemCategory({
        page: 1,
        size: pagination?.totalElements || 1000,
        sort: sortArray,
        search: searchObject,
      }),
    );
  };

  const handleAdvanceSearch = (searchData) => {
    const simpleSearch = {};

    if (searchData?.filters && Array.isArray(searchData.filters)) {
      searchData.filters.forEach((rule) => {
        if (
          rule.column &&
          rule.value !== undefined &&
          rule.value !== null &&
          rule.value !== ""
        ) {
          simpleSearch[rule.column] = rule.value;
        }
      });
    }

    if (searchData?.filterRules && Array.isArray(searchData.filterRules)) {
      searchData.filterRules.forEach((ruleGroup) => {
        if (ruleGroup?.filters && Array.isArray(ruleGroup.filters)) {
          ruleGroup.filters.forEach((rule) => {
            const hasValue =
              rule.value !== undefined &&
              rule.value !== null &&
              rule.value !== "";
            if (rule.column && hasValue) {
              simpleSearch[rule.column] = rule.value;
            }
          });
        }
      });
    }

    setSearch(simpleSearch);
    setPage(1);
  };

  const itemGrantAccess = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_BILLING_ITEM_CATEGORY}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "20px" }} />}
            type="submit"
          >
            Transaction Mapping Category
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={SYSTEM_SETUP_ROUTES.DETAIL_BILLING_ITEM_CATEGORY}
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

        const content =
          data > 3 ? (
            isEditable ? (
              <Link
                to={SYSTEM_SETUP_ROUTES.UPDATE_BILLING_ITEM_CATEGORY}
                state={{
                  id: record.id,
                  status: record.status,
                  statusApproval: record.statusApproval,
                }}
              >
                <ButtonComponent
                  icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
                  border={false}
                  type={"action"}
                >
                  <span className="text-black ml-0">Update</span>
                </ButtonComponent>
              </Link>
            ) : (
              <div className="flex items-center cursor-not-allowed px-2 py-1">
                <span className="pointer-events-none">
                  <SVGIcon name="IconEdit" color="#8D91A0" width={24} />
                </span>
                <span className="text-gray-400 ml-2 pointer-events-none">
                  Update
                </span>
              </div>
            )
          ) : isEditable ? (
            <Tooltip title="Update">
              <Link
                to={SYSTEM_SETUP_ROUTES.UPDATE_BILLING_ITEM_CATEGORY}
                state={{
                  id: record.id,
                  status: record.status,
                  statusApproval: record.statusApproval,
                }}
              >
                <SVGIcon name="IconEdit" width={24} color="#ACC424" />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Update">
              <Link>
                <div className="cursor-not-allowed">
                  <span className="pointer-events-none">
                    <SVGIcon name="IconEdit" width={24} color="#8D91A0" />
                  </span>
                </div>
              </Link>
            </Tooltip>
          );

        return content;
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const canInactivate =
          record.statusApproval === "APPROVED" && record.status === "ACTIVE";

        const Content =
          data_length > 3 ? (
            canInactivate ? (
              <ButtonComponent
                icon={
                  <Checkbox
                    className="inactive-check"
                    onClick={() => handleInactive(record)}
                    disabled={false}
                    checked={false}
                  />
                }
                type={"action"}
                border={false}
                onClick={() => handleInactive(record)}
              >
                <span className="ml-1 text-black">Inactivate</span>
              </ButtonComponent>
            ) : (
              <div className="flex items-center px-2 py-1">
                <Checkbox
                  className="inactive-check"
                  disabled={true}
                  checked={false}
                />
                <span className="text-gray-400 ml-4">Inactivate</span>
              </div>
            )
          ) : (
            <Tooltip title="Inactivate">
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={
                    canInactivate ? () => handleInactive(record) : undefined
                  }
                  disabled={!canInactivate}
                  checked={false}
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
                  width={24}
                  onClick={() => handleApprovalHistory(record)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  const columns = useMemo(
    () => [
      {
        title: "NO",
        key: "no",
        width: 55,
        dataIndex: "key",
        align: "center",
        isClassification: true,
        render: (text, object, index) => index + 1,
      },
      {
        title: "CATEGORY CODE",
        dataIndex: "code",
        key: "code",
        width: 60,
        align: "left",
        sorter: true,
        filteredValue: search?.code ? [search.code] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "code",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "code",
            hasValue(search["code"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "CATEGORY NAME",
        dataIndex: "name",
        key: "name",
        width: 50,
        align: "left",
        sorter: true,
        filteredValue: search?.name ? [search.name] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "name",
            hasValue(search["name"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        key: "startDate",
        width: 100,
        sorter: true,
        align: "center",
        filteredValue: search?.startDate ? [search.startDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "startDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "date",
        ),
        render: (v) =>
          renderDateColumn(
            "startDate",
            hasValue(search["startDate"]),
            searchText,
            v,
            "date",
            search,
          ),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        key: "endDate",
        width: 100,
        sorter: true,
        align: "center",
        filteredValue: search?.endDate ? [search.endDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "endDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "date",
        ),
        render: (v) =>
          renderDateColumn(
            "endDate",
            hasValue(search["endDate"]),
            searchText,
            v,
            "date",
            search,
          ),
      },
      {
        key: "description",
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
        width: 80,
        filteredValue: [search?.description] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "description",
            hasValue(search["description"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        width: 85,
        sorter: true,
        filteredValue: search?.status ? [search.status] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text ? text.toUpperCase() : text,
            false,
            "status",
          ),
      },
      {
        title: "APPROVAL STATUS",
        dataIndex: "statusApproval",
        key: "statusApproval",
        width: 90,
        sorter: true,
        filteredValue: search?.statusApproval ? [search.statusApproval] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "statusApproval",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "statusApproval",
            hasValue(search["statusApproval"]),
            searchText,
            text ? text.toUpperCase() : text,
            false,
            "status",
          ),
      },
    ],
    [searchedColumn, searchText, search],
  );

  // Call useColumnActionPermission hook at component level
  const actionColumns = useColumnActionPermission(
    ["View", "Activate", "Update", "History"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: 75,
    align: "center",
  }));

  // Get base columns with key property
  const baseColumns = useMemo(() => {
    const allColumns = [...columns, ...actionColumns];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = allColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [columns, actionColumns]);

  // Column definitions for ColumnSettings
  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  // Process columns with fixed state
  const processedColumns = useMemo(() => {
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

  // Map data to include keys for table rendering
  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: item.id || index,
    }));
  }, [currentData]);

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
      breadcrumbName: "Transaction Mapping Category",
    },
  ];

  return (
    <>
      {/* <Spin spinning={loading}> */}
      <BreadCrumb routes={routes} />
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px]">TRANSACTION MAPPING CATEGORY LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemGrantAccess} />
            </div>
          </div>
        }
      >
        <TableRBI
          key={`billing-item-category-${page}-${currentData.length}`}
          idTable="billing-item-category-table"
          showExport={false}
          dataSource={dataSourceWithKeys}
          columns={processedColumns}
          totalData={pagination?.totalElements || 0}
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
          loadMoreThreshold={20}
          tableScrolled={{ y: 525, x: 500 }}
          onRefresh={handleRefresh}
          showRefresh={true}
          onAdvanceSearch={handleAdvanceSearch}
        />
      </CardContainer>
      <ModalInactivateWithHierarchy
        selector={"billingItemCategory"}
        dispatch={dispatch}
        getAPIOption={getAvailableApproval}
        getAPIDetail={getSelectedApproval}
        alertMessage={`Are you sure you want to inactivate this Transaction Mapping Category with code ${
          chooseId?.code || ""
        }?`}
        openModalInactivate={modalInactive}
        handleCloseModalInactivate={handleCancelInactive}
        onFinish={handleOk}
      />

      <ModalHistory
        isOpen={openModalHistory}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
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
          <p className="pl-[70px]">{`Your data was not inactivated. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
      {/* </Spin> */}
    </>
  );
};

export default ListBillingItemCategory;
