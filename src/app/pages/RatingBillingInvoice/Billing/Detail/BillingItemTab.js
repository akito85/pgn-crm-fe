import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import { getAllBillingItemPaginate } from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsBillingItem } from "./Table/TableBillingItem";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const BillingItemTab = ({ billingCodeId, calculationCodeId, billHeaderId }) => {
  const { data_billingItem, loadingDetail } = useSelector((state) => state.billing);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSourceBI = data_billingItem?.result;

  const initialPageSize = 100;
  const [loadMoreSize] = useState(20);

  const [searchedColumnBI, setSearchedColumnBI] = useState("");
  const [searchTextBI, setSearchTextBI] = useState("");
  const [sortBI, setSortBI] = useState("");
  const [searchBI, setSearchBI] = useState({});

  const [fixedColumnsBI, setFixedColumnsBI] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    if (billHeaderId) {
      dispatch(
        getAllBillingItemPaginate({
          billHeaderId,
          searchBI: encodeURIComponent(JSON.stringify(searchBI)),
          pageBI: 1,
          pageSizeBI: initialPageSize,
          sortBI,
          isLoadMore: false,
        }),
      );
    }
  }, [dispatch, billHeaderId, searchBI, sortBI]);

  const handleSearchBI = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextBI(selectedKeys[0]);
    setSearchedColumnBI(dataIndex);
    setSearchBI((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const handleLoadMoreBI = async () => {
    const totalElements = data_billingItem?.page?.totalElements || 0;
    const currentLength = dataSourceBI?.length || 0;
    if (currentLength >= totalElements) return;

    const nextPage = Math.floor(currentLength / loadMoreSize) + 1;
    await dispatch(
      getAllBillingItemPaginate({
        billHeaderId,
        searchBI: encodeURIComponent(JSON.stringify(searchBI)),
        pageBI: nextPage,
        pageSizeBI: loadMoreSize,
        sortBI,
        isLoadMore: true,
      }),
    );
  };

  const handleRefreshBI = () => {
    dispatch(
      getAllBillingItemPaginate({
        billHeaderId,
        searchBI: encodeURIComponent(JSON.stringify(searchBI)),
        pageBI: 1,
        pageSizeBI: initialPageSize,
        sortBI,
        isLoadMore: false,
      }),
    );
  };

  const hasMoreBI = (dataSourceBI?.length || 0) < (data_billingItem?.page?.totalElements || 0);

  const onSortBI = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortBI(dataSort);
  };

  const baseColumnsBI = useMemo(() => {
    return columnsBillingItem(
      0,
      0,
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      searchBI,
    );
  }, [searchedColumnBI, searchTextBI, searchBI]);

  const allColumnsBI = useMemo(() => {
    return baseColumnsBI.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsBI]);

  const processedColumnsBI = useMemo(() => {
    return applyFixedColumns(allColumnsBI, fixedColumnsBI);
  }, [allColumnsBI, fixedColumnsBI]);

  const columnDefinitionsBI = useMemo(() => {
    return allColumnsBI.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsBI]);

  // Tambahkan key unik per row menggunakan id dari response
  const dataSourceWithKeys = useMemo(() => {
    return dataSourceBI?.map((item) => ({
      ...item,
      key: item.id,
    }));
  }, [dataSourceBI]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
        <div>
          <p className="text-[13px] text-gray-600 mb-1">Calculation Code</p>
          <p className="text-[15px] text-primary">{calculationCodeId || ""}</p>
        </div>
        <div>
          <p className="text-[13px] text-gray-600 mb-1">Source Number</p>
          <p className="text-[15px] text-primary">{billHeaderId || ""}</p>
        </div>
      </div>

      <TableRBI
        size="small"
        dataSource={dataSourceWithKeys}
        columns={processedColumnsBI}
        totalData={data_billingItem?.page?.totalElements || 0}
        tableScrolled={{ x: 2200, y: 525 }}
        onSort={onSortBI}
        columnDefinitions={columnDefinitionsBI}
        fixedColumns={fixedColumnsBI}
        showExport={false}
        setFixedColumns={setFixedColumnsBI}
        loading={loadingDetail}
        usePagination={false}
        useInfiniteScroll={true}
        onLoadMore={handleLoadMoreBI}
        hasMore={hasMoreBI}
        showRefresh={true}
        onRefresh={handleRefreshBI}
        loadMoreThreshold={15}
      />
    </div>
  );
};

export default BillingItemTab;
