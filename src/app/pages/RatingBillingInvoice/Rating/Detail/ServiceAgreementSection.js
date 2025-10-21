import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailSection from "./ServiceAgreement/DetailSection";
import PricingSection from "./ServiceAgreement/PricingSection";
import CalculationRuleSection from "./ServiceAgreement/CalculationRuleSection";
import TosSection from "./ServiceAgreement/TosSection";
import { getAllServiceAgreementPaginate } from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsServiceAgreement } from "./Table/TableServiceAgreement";
import TablePaginationNew from "../../../../../components/TablePaginationNew";

const ServiceAgreementSection = ({ ratingCodeId, calculationCode }) => {
  // Selector
  const { data_serviceAgreement } = useSelector((state) => state.rating);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_serviceAgreement?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [tabSection, setTabSection] = useState("Detail");
  const [ratingSaId, setRatingSaId] = useState();
  const [pageDetail, setPageDetail] = useState(false);

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllServiceAgreementPaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [ratingCodeId, search, page, pageSize, sort, dispatch]);

  // Function Search API
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
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

  // change tabs
  const onChangeTab = ({ target: { value } }) => {
    setTabSection(value);
  };

  // Handle Detail
  const handleDetail = (record) => {
    setPageDetail(true);
    setRatingSaId(record.ratingSaId);
  };

  // render SA Detail Section
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

  return (
    <>
      <BaseContainer header={"Service Agreement Information"}>
        <div className="flex flex-row align-middle gap-2">
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
          <TablePaginationNew
            dataSource={dataSource}
            columns={columnsServiceAgreement(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              handleDetail,
            )}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data_serviceAgreement?.page?.totalElements || 0}
            onSort={onSortApi}
            tableScrolled={{ y: 525, x: 3000 }}
          />
        </div>
      </BaseContainer>

      {/* Detail Service Agreement */}
      {pageDetail === true ? (
        <div className="pt-[30px]">
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
