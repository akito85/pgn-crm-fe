import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import DetailSection from "./ServiceAgreement/DetailSection";
import PricingSection from "./ServiceAgreement/PricingSection";
import CalculationRuleSection from "./ServiceAgreement/CalculationRuleSection";
import TosSection from "./ServiceAgreement/TosSection";
import { getAllServiceAgreementPaginate } from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsServiceAgreement } from "./Table/TableServiceAgreement";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const ServiceAgreementSection = ({ ratingCodeId, calculationCode }) => {
  const { data_serviceAgreement, loading } = useSelector((state) => state.rating);

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
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
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

  const serviceSection = [
    {
      label: "Detail",
      value: "Detail",
    },
    {
      label: "Pricing",
      value: "Pricing",
    },
    {
      label: "Calculation Rule",
      value: "Calculation Rule",
    },
    {
      label: "Term Of Service",
      value: "Term Of Service",
    },
  ];

  const onChangeTab = ({ target: { value } }) => {
    setTabSection(value);
  };

  const handleDetail = (record) => {
    setPageDetail(true);
    setRatingSaId(record.ratingSaId);
    setTabSection("Detail");
  };

  const renderServiceAgreementDetail = (tabName) => {
    switch (tabName) {
      case "Detail":
        return <DetailSection SAId={ratingSaId} />;
      case "Pricing":
        return <PricingSection SAId={ratingSaId} />;
      case "Calculation Rule":
        return <CalculationRuleSection SAId={ratingSaId} />;
      case "Term Of Service":
        return <TosSection SAId={ratingSaId} />;
      default:
        return <DetailSection SAId={ratingSaId} />;
    }
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
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">SERVICE AGREEMENT INFORMATION</p>
          </div>
        }
      >
        <div className="flex flex-row align-middle gap-2 mb-4">
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Calculation Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {calculationCode}
          </p>
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Rating Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {ratingCodeId}
          </p>
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
            tableScrolled={{ y: 525, x: 3000 }}
            onSort={onSortApi}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            showExport={false}
            setFixedColumns={setFixedColumns}
            loading={loading}
          />
        </div>
      </CardContainer>

      {pageDetail === true ? (
        <div ref={saDetailRef} className="pt-[30px]">
          <Radio.Group
            options={serviceSection}
            onChange={onChangeTab}
            value={tabSection}
            optionType="button"
            buttonStyle="solid"
            style={{ gap: 12, display: "flex" }}
          />
          {renderServiceAgreementDetail(tabSection)}
        </div>
      ) : null}
    </>
  );
};

export default ServiceAgreementSection;