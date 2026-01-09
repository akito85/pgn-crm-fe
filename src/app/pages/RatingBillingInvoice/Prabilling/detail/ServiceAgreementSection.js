import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import TableRBI from "../../../../../components/TableRBI";
import { getPrabillSummaryServiceAgreement } from "../../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import moment from "moment";
import SaDetailSection from "./ServiceAgreement/SaDetailSection";
import SaCalculationRuleSection from "./ServiceAgreement/SaCalculationRuleSection";
import SaPricingSection from "./ServiceAgreement/SaPricingSection";
import SaTosSection from "./ServiceAgreement/SaTosSection";

const columnsServiceAgreement = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  handleDetail
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
    title: "SA NUMBER",
    dataIndex: "saNumber",
    key: "saNumber",
    sorter: true,
    width: 150,
    filteredValue: [search?.saNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "saNumber",
        hasValue(search["saNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SA DATE",
    dataIndex: "saDate",
    key: "saDate",
    sorter: true,
    width: 120,
    filteredValue: [search?.saDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saDate",
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
        "saDate",
        hasValue(search["saDate"]),
        searchText,
        formattedDate,
        "date",
        search
      );
    },
  },
  {
    title: "SA TYPE",
    dataIndex: "saType",
    key: "saType",
    sorter: true,
    width: 100,
    filteredValue: [search?.saType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "saType",
        hasValue(search["saType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "PRODUCT NAME",
    dataIndex: "productName",
    key: "productName",
    sorter: true,
    width: 200,
    ellipsis: { showTitle: false },
    filteredValue: [search?.productName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "productName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "productName",
        hasValue(search["productName"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    sorter: true,
    width: 120,
    filteredValue: [search?.startDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
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
        "startDate",
        hasValue(search["startDate"]),
        searchText,
        formattedDate,
        "date",
        search
      );
    },
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    sorter: true,
    width: 120,
    filteredValue: [search?.endDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
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
        "endDate",
        hasValue(search["endDate"]),
        searchText,
        formattedDate,
        "date",
        search
      );
    },
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    sorter: true,
    width: 100,
    align: "center",
    filteredValue: [search?.status] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACTION",
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 100,
    render: (text, record) => (
      <button
        onClick={() => handleDetail(record)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Detail
      </button>
    ),
  },
];

const ServiceAgreementSection = ({ 
  prabillAccId, 
  customerNumber, 
  accountNumber,
  customerName 
}) => {
  const { data_prabilling_sa, loading } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_prabilling_sa?.result;
  const saDetailRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [tabSection, setTabSection] = useState("Detail");
  const [prabillSaId, setPrabillSaId] = useState(null);
  const [saNumber, setSaNumber] = useState(null);
  const [pageDetail, setPageDetail] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  useEffect(() => {
    if (prabillAccId) {
      dispatch(
        getPrabillSummaryServiceAgreement({
          id: prabillAccId,
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, prabillAccId, search, page, pageSize, sort]);

  useEffect(() => {
    if (pageDetail && saDetailRef.current) {
      setTimeout(() => {
        saDetailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [pageDetail, prabillSaId]);

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

  const handleDetail = (record) => {
    setPageDetail(true);
    setPrabillSaId(record.prabillSaId);
    setSaNumber(record.saNumber);
    setTabSection("Detail");
  };

  const serviceTabItems = [
    {
      key: "Detail",
      label: "Detail",
      children: <SaDetailSection prabillSaId={prabillSaId} />,
    },
    {
      key: "Pricing",
      label: "Pricing",
      children: <SaPricingSection prabillSaId={prabillSaId} saNumber={saNumber} />,
    },
    {
      key: "Calculation Rule",
      label: "Calculation Rule",
      children: <SaCalculationRuleSection prabillSaId={prabillSaId} />,
    },
    {
      key: "Term Of Service",
      label: "Term Of Service",
      children: <SaTosSection prabillSaId={prabillSaId} />,
    },
  ];

  const onChangeTab = (key) => {
    setTabSection(key);
  };

  const baseColumns = useMemo(
    () =>
      columnsServiceAgreement(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        handleDetail
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
          totalData={data_prabilling_sa?.page?.totalElements || 0}
          tableScrolled={{ y: 525, x: 1700 }}
          onSort={onSortApi}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading}
        />
      </div>

      {pageDetail === true ? (
        <div ref={saDetailRef} className="pt-[30px]">
          <Tabs
            items={serviceTabItems}
            onChange={onChangeTab}
            activeKey={tabSection}
          />
        </div>
      ) : null}
    </>
  );
};

export default ServiceAgreementSection;