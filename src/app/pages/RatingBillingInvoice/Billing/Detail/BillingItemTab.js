import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import TableRBI from "../../../../../components/TableRBI";
import {
  getAllBillingItemPaginate,
  getAllRatingResultPaginate,
} from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsBillingItem } from "./Table/TableBillingItem";
import { columnsRatingResult } from "./Table/TableRatingResult";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const BillingItemTab = ({ billingCodeId, ratingCodeId, calculationCodeId }) => {
  // Selector
  const { data_billingItem, data_ratingResult } = useSelector(
    (state) => state.billing
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSourceBI = data_billingItem?.result;
  const dataSourceRR = data_ratingResult?.result;

  // State for Rating Result Table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // State for Billing Item Table
  const [pageBI, setPageBI] = useState(1);
  const [pageSizeBI, setPageSizeBI] = useState(10);
  const [searchedColumnBI, setSearchedColumnBI] = useState("");
  const [searchTextBI, setSearchTextBI] = useState("");
  const [sortBI, setSortBI] = useState("");
  const [searchBI, setSearchBI] = useState({});

  const [tabHeader, setTabHeader] = useState("Rating Result");

  // ✅ State untuk fix column Billing Item (tanpa localStorage)
  const [fixedColumnsBI, setFixedColumnsBI] = useState({
    no: "left",
  });

  // ✅ State untuk fix column Rating Result (tanpa localStorage)
  const [fixedColumnsRR, setFixedColumnsRR] = useState({
    no: "left",
  });

  // Use Effect for Rating Result
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

  // Use Effect for Billing Item
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

  // Function Search API for Billing Item
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

  // Function Search API for Rating Result
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

  // Handle Change Page for Rating Result
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Handle Change Page for Billing Item
  const handleChangePageBI = (pageChange, pageSizeChange) => {
    const tempPage = pageSizeBI !== pageSizeChange ? 1 : pageChange;
    setPageBI(tempPage);
    setPageSizeBI(pageSizeChange);
  };

  // Sort Table for Billing Item
  const onSortBI = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortBI(dataSort);
  };

  // Sort Table for Rating Result
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // ✅ Base columns for Billing Item
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

  // ✅ Columns with keys for Billing Item
  const allColumnsBI = useMemo(() => {
    return baseColumnsBI.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsBI]);

  // ✅ Apply fixed columns for Billing Item
  const processedColumnsBI = useMemo(() => {
    return applyFixedColumns(allColumnsBI, fixedColumnsBI);
  }, [allColumnsBI, fixedColumnsBI]);

  // ✅ Column definitions for dropdown - Billing Item
  const columnDefinitionsBI = useMemo(() => {
    return allColumnsBI.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsBI]);

  // ✅ Base columns for Rating Result
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

  // ✅ Columns with keys for Rating Result
  const allColumnsRR = useMemo(() => {
    return baseColumnsRR.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsRR]);

  // ✅ Apply fixed columns for Rating Result
  const processedColumnsRR = useMemo(() => {
    return applyFixedColumns(allColumnsRR, fixedColumnsRR);
  }, [allColumnsRR, fixedColumnsRR]);

  // ✅ Column definitions for dropdown - Rating Result
  const columnDefinitionsRR = useMemo(() => {
    return allColumnsRR.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsRR]);

  // data tabs
  const dataTabs = [
    {
      label: "Rating Result",
      value: "Rating Result",
    },
    {
      label: "Promo",
      value: "Promo",
      disabled: true,
    },
  ];

  // change tabs
  const changeTabHeader = ({ target: { value } }) => {
    setTabHeader(value);
  };

  // render tabs item
  const renderLayout = (valueTab) => {
    switch (valueTab) {
      case "Rating Result":
        return (
          <BaseContainer header={"RATING RESULT INFORMATION"}>
            <div className="w-full">
              <TableRBI
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
          </BaseContainer>
        );
      case "Promo":
        return <BaseContainer header={"Promo Information"}></BaseContainer>;
      default:
        return (
          <BaseContainer header={"RATING RESULT INFORMATION"}>
            <div className="w-full">
              <TableRBI
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
          </BaseContainer>
        );
    }
  };

  return (
    <div>
      <BaseContainer header={"billing item information"}>
        <div className="flex flex-row align-middle gap-2">
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Calculation Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {calculationCodeId}
          </p>
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Billing Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {billingCodeId}
          </p>
        </div>
        <div className="w-full">
          <TableRBI
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
      </BaseContainer>

      <div className="pt-[30px]">
        <Radio.Group
          options={dataTabs}
          onChange={changeTabHeader}
          value={tabHeader}
          optionType="button"
          buttonStyle="solid"
          style={{ gap: 12, display: "flex" }}
        />
        {renderLayout(tabHeader)}
      </div>
    </div>
  );
};

export default BillingItemTab;