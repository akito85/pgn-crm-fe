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
} from "../../../../redux/slices/rating_billing_invoice/rating";
import { columnsRating } from "./TableRatingView";
import RatingDetail from "./RatingDetail";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";

const RatingPage = () => {
  const { data, loading } = useSelector((state) => state.rating);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // PERUBAHAN: State untuk infinite scroll
  const [page, setPage] = useState(0); // Start from 0
  const [loadMoreSize] = useState(20); // Load 20 data each time
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

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  const detailRef = useRef(null);

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

  // PERUBAHAN: Initial fetch dengan 100 data
  useEffect(() => {
    dispatch(
      getListRatingGasPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 0,
        pageSize: 100, // Initial load 100 data
        sort,
        isLoadMore: false, // Flag untuk initial load
      })
    );
    setPage(0);
  }, [dispatch, search, sort]);

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

  // PERUBAHAN: Reset page ke 0 saat search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(0); // Reset to 0
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // TAMBAHAN: Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data?.page?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage < totalPages) {
      await dispatch(
        getListRatingGasPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize, // Load 20 more
          sort,
          isLoadMore: true, // Flag untuk load more
        })
      );
      setPage(nextPage);
    }
  };

  // TAMBAHAN: Calculate if there's more data
  const hasMore = (dataSource?.length || 0) < (data?.page?.totalElements || 0);

  const onSortApi = (_, __, sorter) => {
    // Mapping untuk field yang berbeda case
    const fieldMapping = {
      mreadingCode: "mReadingCode",
      // Tambahkan mapping lain jika ada field serupa
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
    dispatch(
      downloadRatingGas({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
      })
    );
  };

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
        0, // Tidak perlu pass page karena tidak digunakan untuk infinite scroll
        0, // Tidak perlu pass pageSize karena tidak digunakan untuk infinite scroll
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
            className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-4"
          />

          <div className="my-0">
            <TableRBI
              idTable="rating-table"
              size="small"
              dataSource={dataSourceWithKeys}
              columns={processedColumns}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ y: 525, x: 13000 }}
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
