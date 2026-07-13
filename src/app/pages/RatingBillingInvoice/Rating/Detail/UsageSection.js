import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  getAllUsageServiceAgreementPaginate,
  downloadUsageList,
} from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsUsage } from "./Table/TableUsage";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const INITIAL_PAGE_SIZE = 100;
const LOAD_MORE_SIZE = 20;

const UsageSection = ({
  ratingCode,
  calculationCode,
  accountNumber,
  billPeriod,
}) => {
  const { data_usageSA, loadingUsage, usage_pagination } = useSelector(
    (state) => state.rating,
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const dataSource = data_usageSA?.result || [];
  const totalElements = usage_pagination?.totalElements || 0;
  const hasMore = dataSource.length < totalElements;

  const [page, setPage] = useState(1);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    dispatch(
      getAllUsageServiceAgreementPaginate({
        id: ratingCode,
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: INITIAL_PAGE_SIZE,
        sort,
        billPeriod,
        accountNumber,
        isLoadMore: false,
        calculationCode: calculationCode,
      }),
    );
    setPage(1);
  }, [
    dispatch,
    ratingCode,
    search,
    sort,
    billPeriod,
    accountNumber,
    calculationCode,
  ]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    const nextPage = Math.floor(dataSource.length / LOAD_MORE_SIZE) + 1;

    setIsLoadingMore(true);
    try {
      await dispatch(
        getAllUsageServiceAgreementPaginate({
          id: ratingCode,
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: LOAD_MORE_SIZE,
          sort,
          billPeriod,
          accountNumber,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    dispatch,
    ratingCode,
    search,
    sort,
    billPeriod,
    accountNumber,
    dataSource.length,
    hasMore,
    isLoadingMore,
  ]);

  const handleRefresh = useCallback(() => {
    dispatch(
      getAllUsageServiceAgreementPaginate({
        id: ratingCode,
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: INITIAL_PAGE_SIZE,
        sort,
        billPeriod,
        accountNumber,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, ratingCode, search, sort, billPeriod, accountNumber]);

  const handleDownloadUsage = useCallback(() => {
    dispatch(
      downloadUsageList({
        ratingCode,
        calculationCode,
        accountNumber,
        billPeriod,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      }),
    );
  }, [dispatch, ratingCode, calculationCode, accountNumber, billPeriod, search, sort]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(() => {
    return columnsUsage(
      search,
      page,
      LOAD_MORE_SIZE,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ).filter((item) => item?.title !== "APPROVED BY");
  }, [search, page, searchedColumn, searchText]);

  const allColumns = useMemo(() => {
    return baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns]);

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
      <div className="mb-4">
        <p className="text-[15px] font-medium text-[#0075bf] mb-3">
          USAGE ITEM INFORMATION
        </p>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-normal text-gray-700">
              Calculation Code
            </p>
            <p className="text-[20px] font-medium text-[#0075bf]">
              {calculationCode}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-normal text-gray-700">Rating Code</p>
            <p className="text-[20px] font-medium text-[#0075bf]">
              {ratingCode}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-end mb-2">
          <ButtonComponent
            type="submit"
            border={false}
            icon={<SVGIcon name="IconButtonDownload" width={20} />}
            onClick={handleDownloadUsage}
          >
            Download
          </ButtonComponent>
        </div>
        <TableRBI
          idTable="usage-section-table"
          dataSource={dataSource}
          columns={processedColumns}
          showExport={false}
          totalData={totalElements}
          tableScrolled={{ x: 2000, y: 525 }}
          onSort={onSort}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loadingUsage}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadMoreThreshold={20}
          showRefresh={true}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  );
};

export default UsageSection;
