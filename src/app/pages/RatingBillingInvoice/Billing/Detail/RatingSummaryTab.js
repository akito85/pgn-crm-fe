import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import { getAllRatingResultPaginate } from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsRatingResult } from "./Table/TableRatingResult";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { showModalError } from "../../../../../redux/slices/general_slice";

const RatingSummaryTab = ({ billHeaderId }) => {
  const { data_ratingResult, loadingDetail } = useSelector((state) => state.billing);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSourceRR = data_ratingResult?.result;

  const initialPageSize = 100;
  const [loadMoreSize] = useState(20);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumnsRR, setFixedColumnsRR] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Load awal saat billHeaderId atau search/sort berubah
  useEffect(() => {
    if (billHeaderId) {
      dispatch(
        getAllRatingResultPaginate({
          id: billHeaderId,
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          isLoadMore: false,
        })
      );
    }
  }, [dispatch, billHeaderId, search, sort]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const handleLoadMore = async () => {
    const totalElements = data_ratingResult?.page?.totalElements || 0;
    const currentLength = dataSourceRR?.length || 0;
    if (currentLength >= totalElements) return;

    const nextPage = Math.floor(currentLength / loadMoreSize) + 1;
    await dispatch(
      getAllRatingResultPaginate({
        id: billHeaderId,
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      })
    );
  };

  const handleRefresh = () => {
    dispatch(
      getAllRatingResultPaginate({
        id: billHeaderId,
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
        isLoadMore: false,
      })
    );
  };

  const hasMore = (dataSourceRR?.length || 0) < (data_ratingResult?.page?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumnsRR = useMemo(() => {
    return columnsRatingResult(
      0,
      0,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
    );
  }, [searchedColumn, searchText, search]);

  const allColumnsRR = useMemo(() => {
    return baseColumnsRR.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsRR]);

  const processedColumnsRR = useMemo(() => {
    return applyFixedColumns(allColumnsRR, fixedColumnsRR);
  }, [allColumnsRR, fixedColumnsRR]);

  const columnDefinitionsRR = useMemo(() => {
    return allColumnsRR.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsRR]);

  const handleDownload = async () => {
    const searchParam = Object.keys(search).some((k) => search[k])
      ? encodeURIComponent(JSON.stringify(search))
      : "";
    const sortParams = sort || "id~desc";
    const url = `/v1/dbs/api/billing/rating-result/download/${billHeaderId}?page=1&size=99999&sort=${sortParams}&searchs=${searchParam}`;
    try {
      await ratingBillingHttpService.downloadXlsx(url, "RATING_RESULT");
    } catch {
      dispatch(showModalError({
        title: "Failed",
        description: "Can't download data, data is empty",
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-3">
        <ButtonComponent onClick={handleDownload} type={"submit"} border={false} icon={<SVGIcon name="IconButtonDownload" width={20} />}>
          Download List
        </ButtonComponent>
      </div>
      <TableRBI
        size="small"
        dataSource={dataSourceRR}
        columns={processedColumnsRR}
        totalData={data_ratingResult?.page?.totalElements || 0}
        tableScrolled={{ x: 1200, y: 525 }}
        onSort={onSort}
        columnDefinitions={columnDefinitionsRR}
        fixedColumns={fixedColumnsRR}
        showExport={false}
        setFixedColumns={setFixedColumnsRR}
        loading={loadingDetail}
        usePagination={false}
        useInfiniteScroll={true}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        showRefresh={true}
        onRefresh={handleRefresh}
        loadMoreThreshold={15}
      />
    </div>
  );
};

export default RatingSummaryTab;