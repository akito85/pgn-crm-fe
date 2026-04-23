import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Checkbox, Spin, Tooltip } from "antd";
import moment from "moment";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import {
  getAllApprovalList,
  getApprovalHistory,
  getDailyRatePaginate,
  getDowloadDailyRate,
  getListApprovalById,
  inactiveDailyRates,
  requestActivateDailyRates,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/dailyrate";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import TableRBI from "../../../../../../components/TableRBI";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../../components/CardContainer";

export const columnDailyRate = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "TYPE",
    dataIndex: "rateType",
    key: "rateType",
    sorter: true,
    align: "left",
    width: 120,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        hasValue(search["rateType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "FROM CURRENCY",
    dataIndex: "fromCurrencyName",
    key: "fromCurrencyName",
    sorter: true,
    align: "center",
    width: 160,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fromCurrencyName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "fromCurrencyName",
        hasValue(search["fromCurrencyName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TO CURRENCY",
    dataIndex: "toCurrencyName",
    key: "toCurrencyName",
    sorter: true,
    align: "center",
    width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "toCurrencyName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) =>
      renderColumn(
        "toCurrencyName",
        hasValue(search["toCurrencyName"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "RATE DATE",
    dataIndex: "rateDate",
    key: "rateDate",
    sorter: true,
    align: "center",
    width: 140,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(search["rateDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "CONVERTED RATE",
    dataIndex: "convertedRate",
    key: "convertedRate",
    sorter: true,
    align: "right",
    width: 170,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convertedRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text, record) => {
      const tempValue = text ? (text + "").split(".") : [];
      const thousandSeparator = ",";
      const decimalSeparator = ".";
      const descimal = tempValue[1]
        ? `${decimalSeparator}${tempValue[1]}`
        : `${decimalSeparator}00`;
      const value =
        tempValue.length > 0
          ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
          : "";

      return renderColumn(
        "convertedRate",
        hasValue(search["convertedRate"]),
        searchText,
        value,
        true,
        "input",
        search,
      );
    },
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    sorter: true,
    width: 250,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    ellipsis: {
      showTitle: false,
    },
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
    width: 130,
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (a) => {
      let text;
      switch (a) {
        case "ACTIVE":
          text = "Active";
          break;
        case "INACTIVE":
          text = "Inactive";
          break;
        case "DRAFT":
          text = "Draft";
          break;
        default:
          text = a ? a.charAt(0).toUpperCase() + a.slice(1).toLowerCase() : a;
          break;
      }
      return renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "status",
        search,
      );
    },
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    key: "statusApproval",
    width: 180,
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (a) => {
      let text;
      switch (a) {
        case "WAITING APPROVAL":
          text = "Waiting Approval";
          break;
        case "DRAFT":
          text = "Draft";
          break;
        case "APPROVAL":
          text = "Approval";
          break;
        default:
          text = a ? a.charAt(0).toUpperCase() + a.slice(1).toLowerCase() : a;
          break;
      }
      return renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "status",
        search,
      );
    },
  },
];

const DailyRateView = ({ dispatch }) => {
  const {
    daily_rate_list,
    daily_rate_pagination,
    dataApprovalHistory,
    loading,
  } = useSelector((state) => state.daily_rate);

  const loadMoreSize = 20;
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const hasMore =
    daily_rate_list.length < (daily_rate_pagination?.totalElements || 0);

  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [ratesId, setRatesId] = useState("");

  // ✅ State untuk fix column dengan format baru { left: [], right: [] }
  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("dailyRateFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: ["no"],
          right: ["action", "status", "statusApproval"],
        };
  });

  // ✅ Save to localStorage when fixedColumns change
  useEffect(() => {
    localStorage.setItem("dailyRateFixedColumns", JSON.stringify(fixedColumns));
  }, [fixedColumns]);

  const formatRupiah = (nilai) => {
    // Separate integer and decimal parts
    const parts = nilai.toString().split(".");
    // Format integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Join integer and decimal parts with a dot
    return parts.join(".");
  };

  // validasi tanggal
  const disabledDate = (current) => {
    return moment(current).isBefore(moment(), "day");
  };

  // Use Effect
  useEffect(() => {
    dispatch(
      getDailyRatePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
  }, [search, sort, dispatch]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  //handleApproval history
  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.DAILY_RATES || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_DAILY_RATES || [],
          activate:
            dataApprovalHistory?.dataApprover?.ACTIVATED_DAILY_RATES || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.DAILY_RATES || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_DAILY_RATES || [],
          activate:
            dataApprovalHistory?.dataHistory?.ACTIVATED_DAILY_RATES || [],
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

  const handleApprovalHistory = useCallback(
    (data) => {
      dispatch(getApprovalHistory(data.ratesId));
      setOpenModalHistory(true);
    },
    [dispatch],
  );

  //handle inactive
  const handleInactive = (r) => {
    setRatesId(r?.ratesId);
    setDataInactivate(r || {});
    setOpenModalInactivate(true);
  };
  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setOpenModalInactivate(false);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleLoadMore = useCallback(async () => {
    if (daily_rate_list.length >= (daily_rate_pagination?.totalElements || 0))
      return;
    const nextPage = Math.floor(daily_rate_list.length / loadMoreSize) + 1;
    await dispatch(
      getDailyRatePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
  }, [dispatch, daily_rate_list.length, daily_rate_pagination, search, sort]);

  const handleRefresh = useCallback(() => {
    dispatch(
      getDailyRatePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
  }, [dispatch, search, sort]);

  const handleSubmitModalInactivate = (res, handleClear) => {
    const selectedStatus = (dataInactivate?.status || "").toUpperCase();
    const isActivateRequest = selectedStatus === "INACTIVE";

    const body = {
      ratesId: ratesId,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };

    const activationAction = isActivateRequest
      ? requestActivateDailyRates({ body })
      : inactiveDailyRates({ body });

    dispatch(activationAction)
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        dispatch(
          getDailyRatePaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: false,
          }),
        );
      });
  };

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
      getDowloadDailyRate({
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
      action: "Download",
      render: (
        <ButtonComponent
          icon={
            <SVGIcon name="IconButtonDownload" style={{ fontSize: "20" }} />
          }
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.DAILY_RATE_CREATE}>
          <ButtonComponent
            icon={
              <SVGIcon name="IconButtonCreate" style={{ fontSize: "20" }} />
            }
            type="submit"
          >
            Create Daily Rates
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
            to={RBI_ROUTES.DAILY_RATE_DETAIL}
            state={{ id: record?.ratesId }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={20} />
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
          record.status === "DRAFT" ||
          (record.status === "ACTIVE" &&
            !moment(record?.rateDate).isBefore(moment(), "day") &&
            !moment(record?.rateDate).isSame(moment(), "day"));

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
              type={"action"}
              border={false}
              disabled={!isEditable}
            >
              <span
                className={`ml-0 ${
                  isEditable ? "text-black " : "text-[#8D91A0]"
                }`}
              >
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
            to={RBI_ROUTES.DAILY_RATE_UPDATE}
            state={{
              id: record.ratesId,
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
        const normalizedStatus = (record.status || "").toUpperCase();
        const isActivateRequest = normalizedStatus === "INACTIVE";

        const isInactivateRequest =
          (record.statusApproval === "APPROVED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "WAITING APPROVAL" &&
            record.status === "ACTIVE") ||
          moment(record?.rateDate).isBefore(moment(), "day");

        const isActivateOrInactivate = isActivateRequest || isInactivateRequest;
        const actionText = isActivateRequest ? "Activate" : "Inactivate";

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={!isActivateOrInactivate}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              }
              type={"action"}
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
            >
              <span className="text-black ml-1">{actionText}</span>
            </ButtonComponent>
          ) : (
            <Tooltip title={actionText}>
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={!isActivateOrInactivate}
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
              border={false}
              type={"action"}
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

  // ✅ Call useColumnActionPermission hook at component level
  const actionColumns = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: 60,
    align: "center",
  }));

  // ✅ Get base columns with key property
  const baseColumns = useMemo(() => {
    const dailyRateCols = [
      ...columnDailyRate(
        search,
        1,
        loadMoreSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleInactive,
        handleApprovalHistory,
        formatRupiah,
        disabledDate,
      ),
      ...actionColumns,
    ];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = dailyRateCols.map((col) => ({
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

  const selectedStatus = (dataInactivate?.status || "").toUpperCase();
  const isActivateFlow = selectedStatus === "INACTIVE";

  return (
    <div>
      <Spin spinning={loading}>
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] text-primary">DAILY RATES LIST</p>

              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <TableRBI
            idTable="dailyRateTable"
            dataSource={daily_rate_list}
            columns={columns}
            totalData={daily_rate_pagination?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{
              x: "max-content",
              y: 525,
            }}
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
        </CardContainer>

        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"daily_rate"}
          alertMessage={`Are you sure you want to ${
            isActivateFlow ? "activate" : "inactivate"
          } `}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </Spin>
    </div>
  );
};

export default DailyRateView;
