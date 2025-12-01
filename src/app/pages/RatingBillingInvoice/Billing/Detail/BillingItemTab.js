import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import TableRBI from "../../../../../components/TableRBI";
import {
  getAllBillingItemPaginate,
  getAllRatingResultPaginate,
} from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsBillingItem } from "./Table/TableBillingItem";
import { columnsRatingResult } from "./Table/TableRatingResult";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const BillingItemTab = ({ billingCodeId, ratingCodeId, calculationCodeId }) => {
  const { data_billingItem, data_ratingResult } = useSelector(
    (state) => state.billing
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSourceBI = data_billingItem?.result;
  const dataSourceRR = data_ratingResult?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [pageBI, setPageBI] = useState(1);
  const [pageSizeBI, setPageSizeBI] = useState(10);
  const [searchedColumnBI, setSearchedColumnBI] = useState("");
  const [searchTextBI, setSearchTextBI] = useState("");
  const [sortBI, setSortBI] = useState("");
  const [searchBI, setSearchBI] = useState({});

  const [activeTab, setActiveTab] = useState("1");

  const [fixedColumnsBI, setFixedColumnsBI] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const [fixedColumnsRR, setFixedColumnsRR] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    dispatch(
      getAllRatingResultPaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page: page,
        pageSize: pageSize,
        sort: sort,
      })
    );
  }, [dispatch, ratingCodeId, search, page, pageSize, sort]);

  useEffect(() => {
    dispatch(
      getAllBillingItemPaginate({
        billingCodeId,
        searchBI: encodeURIComponent(JSON.stringify(searchBI)),
        pageBI,
        pageSizeBI,
        sortBI,
      })
    );
  }, [dispatch, billingCodeId, searchBI, pageBI, pageSizeBI, sortBI]);

  const handleSearchBI = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextBI(selectedKeys[0]);
    setSearchedColumnBI(dataIndex);
    setSearchBI((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageBI(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleChangePageBI = (pageChange, pageSizeChange) => {
    const tempPage = pageSizeBI !== pageSizeChange ? 1 : pageChange;
    setPageBI(tempPage);
    setPageSizeBI(pageSizeChange);
  };

  const onSortBI = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortBI(dataSort);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumnsBI = useMemo(() => {
    return columnsBillingItem(
      pageBI,
      pageSizeBI,
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      searchBI
    );
  }, [pageBI, pageSizeBI, searchedColumnBI, searchTextBI, searchBI]);

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

  const baseColumnsRR = useMemo(() => {
    return columnsRatingResult(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
    );
  }, [page, pageSize, searchedColumn, searchText, search]);

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

  const ratingTabItems = [
    {
      key: "1",
      label: "Rating Result",
      children: (
        <div className="pt-4">
          <TableRBI
            size="small"
            dataSource={dataSourceRR}
            columns={processedColumnsRR}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            onSizeChanger={handleChangePage}
            totalData={data_ratingResult?.page?.totalElements || 0}
            tableScrolled={{ x: 1200, y: 525 }}
            onSort={onSort}
            columnDefinitions={columnDefinitionsRR}
            fixedColumns={fixedColumnsRR}
            setFixedColumns={setFixedColumnsRR}
            loading={false}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Promo",
      disabled: true,
      children: (
        <div className="pt-4">
          <p className="text-center text-gray-500">Promo information coming soon</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Billing Item Information Section */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-primary uppercase mb-3">
            Billing Item Information
          </h3>
          <div className="flex flex-row items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-gray-600">
                Calculation Code:
              </p>
              <p className="text-[13px] font-semibold text-primary">
                {calculationCodeId || "-"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-gray-600">
                Billing Code:
              </p>
              <p className="text-[13px] font-semibold text-primary">
                {billingCodeId || "-"}
              </p>
            </div>
          </div>
        </div>

        <TableRBI
          size="small"
          dataSource={dataSourceBI}
          columns={processedColumnsBI}
          current={pageBI}
          pageSize={pageSizeBI}
          onChange={handleChangePageBI}
          onSizeChanger={handleChangePageBI}
          totalData={data_billingItem?.page?.totalElements || 0}
          tableScrolled={{ x: 4500, y: 525 }}
          onSort={onSortBI}
          columnDefinitions={columnDefinitionsBI}
          fixedColumns={fixedColumnsBI}
          setFixedColumns={setFixedColumnsBI}
          loading={false}
        />
      </div>

      {/* Rating Result / Promo Section with Tabs */}
      <div className="mt-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={ratingTabItems}
          type="line"
          className="rating-result-tabs"
        />
      </div>
    </div>
  );
};

export default BillingItemTab;