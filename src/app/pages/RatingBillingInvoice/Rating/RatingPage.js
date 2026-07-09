import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFormatNumberConfig from "../../../../hooks/useFormatNumberConfig";
import { Tabs } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  downloadRatingGas,
  getListRatingGasPaginate,
  getListBillingPeriodForRating,
} from "../../../../redux/slices/rating_billing_invoice/rating";
import { columnsRating } from "./TableRatingView";
import RatingDetail from "./RatingDetail";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import ButtonComponent from "../../../../components/ButtonComponent";
import SelectComponent from "../../../../components/SelectComponent";
import SVGIcon from "../../../../assets/Icon/index";

const RatingPage = () => {
  const { data, loadingList, list_billing_period } = useSelector(
    (state) => state.rating,
  );

  const dispatch = useDispatch();
  useFormatNumberConfig();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  const initialPageSize = 100;
  const [loadMoreSize] = useState(20);

  const [page, setPage] = useState(1);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [valueTab, setValueTab] = useState("Rating Gas");
  const [pageDetail, setPageDetail] = useState(false);
  const [ratingCode, setRatingCode] = useState("");
  const [calculationCode, setCalculationCode] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [saType, setSaType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("ratingFixedColumns");
      return saved ? JSON.parse(saved) : { left: ["no"], right: ["action"] };
    } catch (e) {
      return { left: ["no"], right: ["action"] };
    }
  });

  // Save fixedColumns to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("ratingFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  const detailRef = useRef(null);

  // Fetch billing period saat mount
  useEffect(() => {
    dispatch(getListBillingPeriodForRating());
  }, [dispatch]);

  // Set default billing period ke bulan & tahun sekarang
  useEffect(() => {
    if (
      list_billing_period &&
      list_billing_period.length > 0 &&
      !selectedBillingPeriod
    ) {
      const now = new Date();
      const currentMonth = now.toLocaleString("en-US", { month: "short" });
      const currentYear = now.getFullYear();
      const currentPeriodName = `${currentMonth} ${currentYear}`;

      const currentPeriod = list_billing_period.find(
        (item) => item.name === currentPeriodName,
      );

      if (currentPeriod) {
        setSelectedBillingPeriod(currentPeriod.name);
      } else {
        setSelectedBillingPeriod(list_billing_period[0].name);
      }
    }
  }, [list_billing_period, selectedBillingPeriod]);

  // Scroll ke detail saat row dipilih
  useEffect(() => {
    if (pageDetail && activeRowKey && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [activeRowKey, pageDetail]);

  useEffect(() => {
    if (selectedBillingPeriod) {
      dispatch(
        getListRatingGasPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          period: selectedBillingPeriod,
          isLoadMore: false,
        }),
      );
      setPage(1);
    }
  }, [dispatch, search, sort, selectedBillingPeriod]);

  const tabItems = [
    { key: "Rating Gas", label: "Rating Gas", children: null },
    { key: "Rating Non Gas", label: "Rating Non Gas", disabled: true, children: null },
  ];

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.RATING_VIEW, breadcrumbName: "Rating" },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const handleLoadMore = async () => {
    const totalElements = data?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) return;

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    if (selectedBillingPeriod) {
      await dispatch(
        getListRatingGasPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          period: selectedBillingPeriod,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    }
  };

  const handleRefresh = () => {
    if (selectedBillingPeriod) {
      dispatch(
        getListRatingGasPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          period: selectedBillingPeriod,
          isLoadMore: false,
        }),
      );
      setPage(1);
    }
  };

  const hasMore = (dataSource?.length || 0) < (data?.page?.totalElements || 0);

  const onSortApi = (_, __, sorter) => {
    const fieldMapping = { mreadingCode: "mReadingCode" };
    const field = fieldMapping[sorter.field] || sorter.field;
    const dataSort =
      sorter.order !== undefined
        ? `${field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onChangeTab = (key) => {
    setValueTab(key);
  };

  const handleDetail = (record, rowKey) => {
    const recordKey = rowKey || record.ratingCode;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setRatingCode("");
      setCalculationCode("");
      setSANumberId("");
      setSaType("");
      setAccountNumber("");
    } else {
      setRatingCode(record.ratingCode);
      setCalculationCode(record.calculationCode);
      setSANumberId(record.saNumber);
      setSaType(record.saType);
      setAccountNumber(record.accountNumber);
      setActiveRowKey(recordKey);
      setPageDetail(true);
    }
  };

  const handleDownload = () => {
    if (selectedBillingPeriod) {
      dispatch(
        downloadRatingGas({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize: loadMoreSize,
          sort,
          billPeriodName: selectedBillingPeriod,
        }),
      );
    }
  };

  const handleBillingPeriodChange = (value) => {
    setSelectedBillingPeriod(value);
    setPage(1);
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          onClick={handleDownload}
          disabled={!selectedBillingPeriod}
        >
          Download List
        </ButtonComponent>
      ),
    },
  ];

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      key: item.ratingCode,
    }));
  }, [dataSource]);

  const baseColumns = useMemo(
    () =>
      columnsRating(
        search,
        0,
        0,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    [search, searchedColumn, searchText],
  );

  const actionCols = useColumnActionPermission(["view"], itemGrantAccess);

  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px]">RATING LIST</p>
            <div className="w-full flex justify-end gap-[20px]">
              <Toolbar items={itemGrantAccess} />
            </div>
          </div>
        }
      >
        <Tabs
          items={tabItems}
          onChange={onChangeTab}
          activeKey={valueTab}
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-0"
        />

        <div className="my-0">
          <TableRBI
            idTable="rating-table"
            size="small"
            dataSource={dataSourceWithKeys}
            columns={processedColumns}
            totalData={data?.page?.totalElements || 0}
            tableScrolled={{ y: 525 }}
            onSort={onSortApi}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loadingList}
            enableRowClick={true}
            selectedRowKey={activeRowKey}
            onRowClick={handleDetail}
            showExport={false}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            showRefresh={true}
            onRefresh={handleRefresh}
            loadMoreThreshold={15}
            customHeaderLeft={
              <div className="flex items-center gap-1">
                <SelectComponent
                  value={selectedBillingPeriod}
                  onChange={handleBillingPeriodChange}
                  placeholder="Select Period"
                  style={{ width: "120px" }}
                  options={(list_billing_period || []).map((item) => ({
                    label: item?.name,
                    value: item?.name,
                  }))}
                />
              </div>
            }
          />
        </div>
      </CardContainer>

      {pageDetail && (
        <div
          ref={detailRef}
          className="mt-6 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-0"
        >
          <RatingDetail
            calculationCode={calculationCode}
            SAId={saNumberId}
            ratingCode={ratingCode}
            saType={saType}
            accountNumber={accountNumber}
            billPeriod={selectedBillingPeriod}
            onClose={() => {
              setPageDetail(false);
              setActiveRowKey(null);
              setRatingCode("");
              setCalculationCode("");
              setSANumberId("");
              setSaType("");
              setAccountNumber("");
            }}
          />
        </div>
      )}
    </>
  );
};

export default RatingPage;