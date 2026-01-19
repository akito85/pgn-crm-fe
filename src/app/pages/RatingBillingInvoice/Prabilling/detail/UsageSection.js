import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import { getPrabillSummaryUsage } from "../../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import moment from "moment";

const columnsUsage = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search
) => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ASSET SERIAL NUM",
    dataIndex: "assetSerialNum",
    key: "assetSerialNum",
    sorter: true,
    width: 150,
    filteredValue: [search?.assetSerialNum] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "assetSerialNum",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "assetSerialNum",
        hasValue(search["assetSerialNum"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ASSET TYPE",
    dataIndex: "assetType",
    key: "assetType",
    sorter: true,
    width: 100,
    filteredValue: [search?.assetType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "assetType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "assetType",
        hasValue(search["assetType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "STREAM",
    dataIndex: "stream",
    key: "stream",
    sorter: true,
    width: 80,
    align: "center",
    filteredValue: [search?.stream] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "stream",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "stream",
        hasValue(search["stream"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BEGIN STAND",
    dataIndex: "beginStand",
    key: "beginStand",
    sorter: true,
    width: 120,
    align: "right",
    filteredValue: [search?.beginStand] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "beginStand",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "beginStand",
        hasValue(search["beginStand"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "END STAND",
    dataIndex: "endStand",
    key: "endStand",
    sorter: true,
    width: 120,
    align: "right",
    filteredValue: [search?.endStand] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endStand",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "endStand",
        hasValue(search["endStand"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "VOL MEASURED 27",
    dataIndex: "volMeasured27",
    key: "volMeasured27",
    sorter: true,
    width: 130,
    align: "right",
    filteredValue: [search?.volMeasured27] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "volMeasured27",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      const displayText = text ? Number(text).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : "";
      return renderColumn(
        "volMeasured27",
        hasValue(search["volMeasured27"]),
        searchText,
        displayText,
        false,
        "input",
        search
      );
    },
  },
  {
    title: "ENG MEASURED",
    dataIndex: "engMeasured",
    key: "engMeasured",
    sorter: true,
    width: 130,
    align: "right",
    filteredValue: [search?.engMeasured] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "engMeasured",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      const displayText = text ? Number(text).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : "";
      return renderColumn(
        "engMeasured",
        hasValue(search["engMeasured"]),
        searchText,
        displayText,
        false,
        "input",
        search
      );
    },
  },
  {
    title: "MEAS DATE",
    dataIndex: "measDate",
    key: "measDate",
    sorter: true,
    width: 120,
    filteredValue: [search?.measDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "measDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => {
      const formattedDate = text ? moment(text).format("DD MMM YYYY") : "";
      return renderDateColumn(
        "measDate",
        hasValue(search["measDate"]),
        searchText,
        formattedDate,
        "date",
        search
      );
    },
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    key: "costCenter",
    sorter: true,
    width: 150,
    ellipsis: { showTitle: false },
    filteredValue: [search?.costCenter] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "SOURCES",
    dataIndex: "sources",
    key: "sources",
    sorter: true,
    width: 100,
    align: "center",
    filteredValue: [search?.sources] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sources",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "sources",
        hasValue(search["sources"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
];

const UsageSection = ({ 
  customerNumber, 
  billPeriod,
  accountNumber,
  customerName 
}) => {
  const { data_prabilling_usage, loading } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_prabilling_usage?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    if (customerNumber && billPeriod) {
      dispatch(
        getPrabillSummaryUsage({
          billPeriod,
          customerNumber,
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, customerNumber, billPeriod, search, page, pageSize, sort]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () =>
      columnsUsage(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [page, pageSize, searchedColumn, searchText, search]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
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
          CUSTOMER INFORMATION
        </p>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-normal text-gray-700">
              Customer Number
            </p>
            <p className="text-[20px] font-medium text-[#0075bf]">
              {customerNumber}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-normal text-gray-700">
              Customer Name
            </p>
            <p className="text-[20px] font-medium text-[#0075bf]">
              {customerName}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-normal text-gray-700">
              Account Number
            </p>
            <p className="text-[20px] font-medium text-[#0075bf]">
              {accountNumber}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <TableRBI
          dataSource={dataSource}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          showExport={false}
          onSizeChanger={handleChange}
          totalData={data_prabilling_usage?.page?.totalElements || 0}
          tableScrolled={{ y: 525, x: 2000 }}
          onSort={onSortApi}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading}
        />
      </div>
    </>
  );
};

export default UsageSection;