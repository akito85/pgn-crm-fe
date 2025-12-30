import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import DetailSection from "./ServiceAgreement/DetailSection";
import PricingSection from "./ServiceAgreement/PricingSection";
import CalculationRuleSection from "./ServiceAgreement/CalculationRuleSection";
import TosSection from "./ServiceAgreement/TosSection";
import { getAllServiceAgreementPaginate } from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsServiceAgreement } from "./Table/TableServiceAgreement";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const ServiceAgreementSection = ({ ratingCodeId, calculationCode }) => {
  const { data_serviceAgreement, loading } = useSelector(
    (state) => state.rating
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_serviceAgreement?.result;
  const saDetailRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [tabSection, setTabSection] = useState("Detail");
  const [ratingSaId, setRatingSaId] = useState();
  const [saNumber, setSaNumber] = useState();
  const [pageDetail, setPageDetail] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  useEffect(() => {
    dispatch(
      getAllServiceAgreementPaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [ratingCodeId, search, page, pageSize, sort, dispatch]);

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
  }, [pageDetail, ratingSaId]);

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
  
  const serviceTabItems = [
    {
      key: "Detail",
      label: "Detail",
      children: <DetailSection SAId={ratingSaId} />,
    },
    {
      key: "Pricing",
      label: "Pricing",
      children: <PricingSection SAId={saNumber} />,
    },
    {
      key: "Calculation Rule",
      label: "Calculation Rule",
      children: <CalculationRuleSection SAId={ratingSaId} />,
    },
    {
      key: "Term Of Service",
      label: "Term Of Service",
      children: <TosSection SAId={ratingSaId} />,
    },
  ];

  const onChangeTab = (key) => {
    setTabSection(key);
  };

  const handleDetail = (record) => {
    setPageDetail(true);
    setRatingSaId(record.ratingSaId);
    setSaNumber(record.saNumber);
    setTabSection("Detail");
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
        handleDetail
      ),
    [page, pageSize, searchedColumn, searchText]
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
          SERVICE ITEM INFORMATION
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
              {ratingCodeId}
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
          totalData={data_serviceAgreement?.page?.totalElements || 0}
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