import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tabs } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
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
  const { data, loading, list_billing_period } = useSelector((state) => state.rating);

  // Debug: Log list_billing_period
  useEffect(() => {
    console.log('list_billing_period:', list_billing_period);
  }, [list_billing_period]);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [valueTab, setValueTab] = useState("Rating Gas");
  const [pageDetail, setPageDetail] = useState(false);
  const [ratingCode, setRatingCode] = useState("");
  const [calculationCode, setCalculationCode] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [activeRowKey, setActiveRowKey] = useState(null);

  // State untuk billing period filter
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  const detailRef = useRef(null);

  // Load billing period list saat component mount
  useEffect(() => {
    dispatch(getListBillingPeriodForRating());
  }, [dispatch]);

  // Set default billing period ke ID tertentu setelah data loaded
  useEffect(() => {
    if (list_billing_period && list_billing_period.length > 0 && !selectedBillingPeriod) {
      // OPTION 1: Set ke ID spesifik (misal 453)
      const defaultPeriod = list_billing_period.find(item => item.id === 453);
      if (defaultPeriod) {
        setSelectedBillingPeriod(defaultPeriod.id);
      } else {
        // Fallback ke yang pertama jika ID 453 tidak ada
        setSelectedBillingPeriod(list_billing_period[0].id);
      }
      
      // OPTION 2: Atau langsung set ke yang pertama
      // setSelectedBillingPeriod(list_billing_period[0].id);
    }
  }, [list_billing_period]);

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

  // Initial fetch - sekarang dengan billPeriodId
  useEffect(() => {
    // Hanya fetch jika billing period sudah dipilih
    if (selectedBillingPeriod) {
      dispatch(
        getListRatingGasPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: 100,
          sort,
          billPeriodId: selectedBillingPeriod,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [dispatch, search, sort, selectedBillingPeriod]);

  const tabItems = [
    {
      key: "Rating Gas",
      label: "Rating Gas",
      children: null,
    },
    {
      key: "Rating Non Gas",
      label: "Rating Non Gas",
      disabled: true,
      children: null,
    },
  ];

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.RATING_VIEW,
      breadcrumbName: "Rating",
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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

  // Load more handler dengan billPeriodId
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data?.page?.totalPages || 0;

    if (nextPage <= totalPages && selectedBillingPeriod) {
      await dispatch(
        getListRatingGasPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          billPeriodId: selectedBillingPeriod,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore = (dataSource?.length || 0) < (data?.page?.totalElements || 0);

  const onSortApi = (_, __, sorter) => {
    const fieldMapping = {
      mreadingCode: "mReadingCode",
    };

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
    } else {
      setRatingCode(record.ratingCode);
      setCalculationCode(record.calculationCode);
      setSANumberId(record.saNumber);
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
          billPeriodId: selectedBillingPeriod,
        })
      );
    }
  };

  // Handle billing period change
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
        handleSearch
      ),
    [search, searchedColumn, searchText]
  );

  const actionCols = useColumnActionPermission(["view"], itemGrantAccess);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
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
    <LayoutMenu>
      <Spin spinning={loading}>
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

          {/* Filter Section */}
          <div className="flex gap-4 mb-1 items-end">
            <div className="w-1/4">
              <label className="block text-sm font-medium mb-2">
                Billing Period <span className="text-red-500">*</span>
              </label>
              <SelectComponent
                value={selectedBillingPeriod}
                onChange={handleBillingPeriodChange}
                placeholder="Select Billing Period"
                options={(list_billing_period || []).map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
              />
            </div>
          </div>

          <div className="my-0">
            <TableRBI
              idTable="rating-table"
              size="small"
              dataSource={dataSourceWithKeys}
              columns={processedColumns}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ y: 525, x: 3000 }}
              onSort={onSortApi}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              enableRowClick={true}
              selectedRowKey={activeRowKey}
              onRowClick={handleDetail}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadMoreThreshold={20}
            />
          </div>
        </CardContainer>

        {pageDetail && (
          <div
            ref={detailRef}
            className="mt-6 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-4"
          >
            <RatingDetail
              calculationCode={calculationCode}
              SAId={saNumberId}
              ratingCodeId={ratingCode}
              onClose={() => {
                setPageDetail(false);
                setActiveRowKey(null);
                setRatingCode("");
                setCalculationCode("");
                setSANumberId("");
              }}
            />
          </div>
        )}
      </Spin>
    </LayoutMenu>
  );
};

export default RatingPage;